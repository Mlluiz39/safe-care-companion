-- Fix infinite recursion in user_roles RLS policies

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Family member creators and admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view roles for their family members" ON public.user_roles;

-- Create new policies that avoid recursion
CREATE POLICY "Family member creators can manage roles"
ON public.user_roles
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM family_members
    WHERE family_members.id = user_roles.family_member_id
      AND family_members.created_by = auth.uid()
  )
);

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
USING (
  has_role(auth.uid(), user_roles.family_member_id, 'admin'::app_role)
);

CREATE POLICY "Users can view their own role assignments"
ON public.user_roles
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can view roles for family members they created"
ON public.user_roles
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM family_members
    WHERE family_members.id = user_roles.family_member_id
      AND family_members.created_by = auth.uid()
  )
);