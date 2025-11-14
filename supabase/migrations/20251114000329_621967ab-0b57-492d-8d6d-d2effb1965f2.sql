-- Fix infinite recursion between family_members and user_roles policies
-- The problem: family_members policies check user_roles, which check family_members back

-- Drop problematic policies on family_members
DROP POLICY IF EXISTS "Users can view family members they have access to" ON public.family_members;
DROP POLICY IF EXISTS "Creators and admins can update family members" ON public.family_members;
DROP POLICY IF EXISTS "Creators can delete family members" ON public.family_members;
DROP POLICY IF EXISTS "Users can create family members" ON public.family_members;

-- Create simple policies for family_members that don't check user_roles
CREATE POLICY "Users can view family members they created"
ON public.family_members
FOR SELECT
USING (created_by = auth.uid());

CREATE POLICY "Users can create their own family members"
ON public.family_members
FOR INSERT
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Creators can update their family members"
ON public.family_members
FOR UPDATE
USING (created_by = auth.uid());

CREATE POLICY "Creators can delete their family members"
ON public.family_members
FOR DELETE
USING (created_by = auth.uid());