-- Fix storage upload authorization for medical documents
-- This prevents users from uploading files to folders they don't have access to

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Users can upload documents for their family members" ON storage.objects;

-- Create a new policy that verifies access to the family member
CREATE POLICY "Users can upload documents for accessible family members"
ON storage.objects 
FOR INSERT
WITH CHECK (
  bucket_id = 'medical-documents' AND
  auth.uid() IS NOT NULL AND
  -- Extract family_member_id from path (format: family_member_id/filename)
  (SELECT split_part(name, '/', 1)::uuid) IN (
    SELECT id FROM public.family_members
    WHERE created_by = auth.uid() OR 
          public.has_role(auth.uid(), id, 'admin'::app_role) OR 
          public.has_role(auth.uid(), id, 'member'::app_role)
  )
);