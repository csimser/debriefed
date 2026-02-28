-- Fix RLS recursion on organization_members and organization_invites
-- Problem: organization_members SELECT policy subqueries organization_members → infinite recursion
-- Solution: Use a SECURITY DEFINER function to bypass RLS for the admin check

-- 1. Create a SECURITY DEFINER function that checks org admin membership
--    This runs with table-owner privileges, bypassing RLS on organization_members
CREATE OR REPLACE FUNCTION public.is_org_admin(check_org_id uuid, check_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE org_id = check_org_id
      AND user_id = check_user_id
      AND role = 'admin'
  );
$$;

-- 2. Drop the self-referencing policies on organization_members
DROP POLICY IF EXISTS "org_admins_read_members" ON public.organization_members;
DROP POLICY IF EXISTS "org_admins_insert_members" ON public.organization_members;
DROP POLICY IF EXISTS "org_admins_delete_members" ON public.organization_members;

-- 3. Recreate policies using the SECURITY DEFINER function (no recursion)
CREATE POLICY "org_admins_read_members" ON public.organization_members
  FOR SELECT USING (
    public.is_org_admin(org_id, auth.uid())
  );

CREATE POLICY "org_admins_insert_members" ON public.organization_members
  FOR INSERT WITH CHECK (
    public.is_org_admin(org_id, auth.uid())
  );

CREATE POLICY "org_admins_delete_members" ON public.organization_members
  FOR DELETE USING (
    public.is_org_admin(org_id, auth.uid())
  );

-- 4. Drop and recreate the organization_invites policy (same fix)
DROP POLICY IF EXISTS "org_admins_manage_invites" ON public.organization_invites;

CREATE POLICY "org_admins_manage_invites" ON public.organization_invites
  FOR ALL USING (
    public.is_org_admin(org_id, auth.uid())
  );

-- 5. Also fix the organizations table policies that reference organization_members
DROP POLICY IF EXISTS "org_admins_read_own_org" ON public.organizations;
DROP POLICY IF EXISTS "org_admins_update_own_org" ON public.organizations;

CREATE POLICY "org_admins_read_own_org" ON public.organizations
  FOR SELECT USING (
    public.is_org_admin(id, auth.uid())
  );

CREATE POLICY "org_admins_update_own_org" ON public.organizations
  FOR UPDATE USING (
    public.is_org_admin(id, auth.uid())
  );
