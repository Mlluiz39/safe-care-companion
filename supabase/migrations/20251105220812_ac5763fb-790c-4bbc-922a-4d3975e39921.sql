-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'member', 'viewer');

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create family_members table (elderly people being cared for)
CREATE TABLE public.family_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  blood_type TEXT,
  allergies TEXT[],
  chronic_conditions TEXT[],
  emergency_contact TEXT,
  emergency_phone TEXT,
  notes TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on family_members
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

-- Create user_roles table for family access control
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  family_member_id UUID NOT NULL REFERENCES public.family_members(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, family_member_id)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create medications table
CREATE TABLE public.medications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_member_id UUID NOT NULL REFERENCES public.family_members(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  times TEXT[] NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  instructions TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on medications
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;

-- Create medication_logs table for tracking intake
CREATE TABLE public.medication_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  medication_id UUID NOT NULL REFERENCES public.medications(id) ON DELETE CASCADE,
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  taken_at TIMESTAMP WITH TIME ZONE,
  confirmed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on medication_logs
ALTER TABLE public.medication_logs ENABLE ROW LEVEL SECURITY;

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_member_id UUID NOT NULL REFERENCES public.family_members(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  doctor_name TEXT,
  specialty TEXT,
  location TEXT,
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER,
  notes TEXT,
  reminder_sent BOOLEAN NOT NULL DEFAULT false,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Create medical_documents table for exams
CREATE TABLE public.medical_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_member_id UUID NOT NULL REFERENCES public.family_members(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  document_type TEXT NOT NULL,
  document_date DATE,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  notes TEXT,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on medical_documents
ALTER TABLE public.medical_documents ENABLE ROW LEVEL SECURITY;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_family_members_updated_at BEFORE UPDATE ON public.family_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medications_updated_at BEFORE UPDATE ON public.medications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medical_documents_updated_at BEFORE UPDATE ON public.medical_documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _family_member_id UUID, _role public.app_role)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND family_member_id = _family_member_id
      AND role = _role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for family_members
CREATE POLICY "Users can view family members they have access to"
  ON public.family_members FOR SELECT
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND family_member_id = family_members.id
    )
  );

CREATE POLICY "Users can create family members"
  ON public.family_members FOR INSERT
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Creators and admins can update family members"
  ON public.family_members FOR UPDATE
  USING (
    created_by = auth.uid() OR
    public.has_role(auth.uid(), id, 'admin')
  );

CREATE POLICY "Creators can delete family members"
  ON public.family_members FOR DELETE
  USING (created_by = auth.uid());

-- RLS Policies for user_roles
CREATE POLICY "Users can view roles for their family members"
  ON public.user_roles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      WHERE id = user_roles.family_member_id
        AND (created_by = auth.uid() OR 
             EXISTS (SELECT 1 FROM public.user_roles ur2 
                     WHERE ur2.user_id = auth.uid() 
                       AND ur2.family_member_id = family_members.id))
    )
  );

CREATE POLICY "Family member creators and admins can manage roles"
  ON public.user_roles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      WHERE id = user_roles.family_member_id
        AND (created_by = auth.uid() OR public.has_role(auth.uid(), id, 'admin'))
    )
  );

-- RLS Policies for medications
CREATE POLICY "Users can view medications for their family members"
  ON public.medications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      WHERE id = medications.family_member_id
        AND (created_by = auth.uid() OR 
             EXISTS (SELECT 1 FROM public.user_roles 
                     WHERE user_id = auth.uid() AND family_member_id = family_members.id))
    )
  );

CREATE POLICY "Users with edit access can create medications"
  ON public.medications FOR INSERT
  WITH CHECK (
    created_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.family_members
      WHERE id = medications.family_member_id
        AND (created_by = auth.uid() OR 
             public.has_role(auth.uid(), id, 'admin') OR 
             public.has_role(auth.uid(), id, 'member'))
    )
  );

CREATE POLICY "Users with edit access can update medications"
  ON public.medications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      WHERE id = medications.family_member_id
        AND (created_by = auth.uid() OR 
             public.has_role(auth.uid(), id, 'admin') OR 
             public.has_role(auth.uid(), id, 'member'))
    )
  );

CREATE POLICY "Users with edit access can delete medications"
  ON public.medications FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      WHERE id = medications.family_member_id
        AND (created_by = auth.uid() OR 
             public.has_role(auth.uid(), id, 'admin') OR 
             public.has_role(auth.uid(), id, 'member'))
    )
  );

-- RLS Policies for medication_logs
CREATE POLICY "Users can view logs for their family members"
  ON public.medication_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.medications m
      JOIN public.family_members fm ON fm.id = m.family_member_id
      WHERE m.id = medication_logs.medication_id
        AND (fm.created_by = auth.uid() OR 
             EXISTS (SELECT 1 FROM public.user_roles 
                     WHERE user_id = auth.uid() AND family_member_id = fm.id))
    )
  );

CREATE POLICY "Users with access can create logs"
  ON public.medication_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.medications m
      JOIN public.family_members fm ON fm.id = m.family_member_id
      WHERE m.id = medication_logs.medication_id
        AND (fm.created_by = auth.uid() OR 
             EXISTS (SELECT 1 FROM public.user_roles 
                     WHERE user_id = auth.uid() AND family_member_id = fm.id))
    )
  );

-- RLS Policies for appointments
CREATE POLICY "Users can view appointments for their family members"
  ON public.appointments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      WHERE id = appointments.family_member_id
        AND (created_by = auth.uid() OR 
             EXISTS (SELECT 1 FROM public.user_roles 
                     WHERE user_id = auth.uid() AND family_member_id = family_members.id))
    )
  );

CREATE POLICY "Users with edit access can create appointments"
  ON public.appointments FOR INSERT
  WITH CHECK (
    created_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.family_members
      WHERE id = appointments.family_member_id
        AND (created_by = auth.uid() OR 
             public.has_role(auth.uid(), id, 'admin') OR 
             public.has_role(auth.uid(), id, 'member'))
    )
  );

CREATE POLICY "Users with edit access can update appointments"
  ON public.appointments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      WHERE id = appointments.family_member_id
        AND (created_by = auth.uid() OR 
             public.has_role(auth.uid(), id, 'admin') OR 
             public.has_role(auth.uid(), id, 'member'))
    )
  );

CREATE POLICY "Users with edit access can delete appointments"
  ON public.appointments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      WHERE id = appointments.family_member_id
        AND (created_by = auth.uid() OR 
             public.has_role(auth.uid(), id, 'admin') OR 
             public.has_role(auth.uid(), id, 'member'))
    )
  );

-- RLS Policies for medical_documents
CREATE POLICY "Users can view documents for their family members"
  ON public.medical_documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      WHERE id = medical_documents.family_member_id
        AND (created_by = auth.uid() OR 
             EXISTS (SELECT 1 FROM public.user_roles 
                     WHERE user_id = auth.uid() AND family_member_id = family_members.id))
    )
  );

CREATE POLICY "Users with edit access can upload documents"
  ON public.medical_documents FOR INSERT
  WITH CHECK (
    uploaded_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.family_members
      WHERE id = medical_documents.family_member_id
        AND (created_by = auth.uid() OR 
             public.has_role(auth.uid(), id, 'admin') OR 
             public.has_role(auth.uid(), id, 'member'))
    )
  );

CREATE POLICY "Users with edit access can update documents"
  ON public.medical_documents FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      WHERE id = medical_documents.family_member_id
        AND (created_by = auth.uid() OR 
             public.has_role(auth.uid(), id, 'admin') OR 
             public.has_role(auth.uid(), id, 'member'))
    )
  );

CREATE POLICY "Users with edit access can delete documents"
  ON public.medical_documents FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      WHERE id = medical_documents.family_member_id
        AND (created_by = auth.uid() OR 
             public.has_role(auth.uid(), id, 'admin') OR 
             public.has_role(auth.uid(), id, 'member'))
    )
  );

-- Create storage bucket for medical documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('medical-documents', 'medical-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for medical documents
CREATE POLICY "Users can view documents they have access to"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'medical-documents' AND
    EXISTS (
      SELECT 1 FROM public.medical_documents md
      JOIN public.family_members fm ON fm.id = md.family_member_id
      WHERE md.file_path = storage.objects.name
        AND (fm.created_by = auth.uid() OR 
             EXISTS (SELECT 1 FROM public.user_roles 
                     WHERE user_id = auth.uid() AND family_member_id = fm.id))
    )
  );

CREATE POLICY "Users can upload documents for their family members"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'medical-documents' AND
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can update documents they uploaded"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'medical-documents' AND
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can delete documents they have access to"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'medical-documents' AND
    EXISTS (
      SELECT 1 FROM public.medical_documents md
      JOIN public.family_members fm ON fm.id = md.family_member_id
      WHERE md.file_path = storage.objects.name
        AND (fm.created_by = auth.uid() OR 
             public.has_role(auth.uid(), fm.id, 'admin') OR 
             public.has_role(auth.uid(), fm.id, 'member'))
    )
  );