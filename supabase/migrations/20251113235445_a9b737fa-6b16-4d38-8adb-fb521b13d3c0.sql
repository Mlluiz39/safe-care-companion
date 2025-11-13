-- Fix infinite recursion in RLS policies
-- The problem: user_roles policies were calling has_role() which queries user_roles, creating infinite recursion

-- Drop problematic policies on user_roles
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Family member creators can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view roles for family members they created" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own role assignments" ON public.user_roles;

-- Create new simple policies for user_roles that don't use has_role()
-- Users can always view their own role assignments
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (user_id = auth.uid());

-- Users can view roles for family members they created
CREATE POLICY "Creators can view family member roles"
ON public.user_roles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.family_members
    WHERE id = user_roles.family_member_id
    AND created_by = auth.uid()
  )
);

-- Only family member creators can manage roles (no has_role check to avoid recursion)
CREATE POLICY "Creators can manage roles"
ON public.user_roles
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.family_members
    WHERE id = user_roles.family_member_id
    AND created_by = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.family_members
    WHERE id = user_roles.family_member_id
    AND created_by = auth.uid()
  )
);