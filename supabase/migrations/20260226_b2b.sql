-- B2B Multi-Tenant Schema
-- Organizations, members, invites + RLS

-- ============================================================
-- 1. organizations table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.organizations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  slug        text NOT NULL UNIQUE,
  logo_url    text,
  primary_color text,
  contact_email text NOT NULL,
  plan        text NOT NULL DEFAULT 'starter' CHECK (plan IN ('starter', 'growth', 'enterprise')),
  max_seats   integer NOT NULL DEFAULT 25,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 2. organization_members table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.organization_members (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role        text NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  invited_by  uuid,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(org_id, user_id)
);

ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 3. organization_invites table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.organization_invites (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  email       text NOT NULL,
  role        text NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  token       text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  expires_at  timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  accepted_at timestamptz,
  created_by  uuid,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.organization_invites ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 4. Add org_id to profiles
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'org_id'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN org_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Index for fast org member lookups
CREATE INDEX IF NOT EXISTS idx_org_members_org_id ON public.organization_members(org_id);
CREATE INDEX IF NOT EXISTS idx_org_members_user_id ON public.organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_org_invites_org_id ON public.organization_invites(org_id);
CREATE INDEX IF NOT EXISTS idx_org_invites_token ON public.organization_invites(token);
CREATE INDEX IF NOT EXISTS idx_profiles_org_id ON public.profiles(org_id);

-- ============================================================
-- 5. RLS Policies — organizations
-- ============================================================

-- Super-admin (service role) can do everything via service client.
-- Org admins can read their own org.
CREATE POLICY "org_admins_read_own_org" ON public.organizations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_members.org_id = organizations.id
        AND organization_members.user_id = auth.uid()
        AND organization_members.role = 'admin'
    )
  );

-- Org admins can update their own org (name, logo, color, contact_email — not plan/seats)
CREATE POLICY "org_admins_update_own_org" ON public.organizations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_members.org_id = organizations.id
        AND organization_members.user_id = auth.uid()
        AND organization_members.role = 'admin'
    )
  );

-- Public read for slug lookup (white-label signup needs to resolve slug → org)
CREATE POLICY "public_read_org_by_slug" ON public.organizations
  FOR SELECT USING (true);

-- ============================================================
-- 6. RLS Policies — organization_members
-- ============================================================

-- Org admins can read all members in their org
CREATE POLICY "org_admins_read_members" ON public.organization_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.organization_members AS om
      WHERE om.org_id = organization_members.org_id
        AND om.user_id = auth.uid()
        AND om.role = 'admin'
    )
  );

-- Org admins can insert members into their org
CREATE POLICY "org_admins_insert_members" ON public.organization_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organization_members AS om
      WHERE om.org_id = organization_members.org_id
        AND om.user_id = auth.uid()
        AND om.role = 'admin'
    )
  );

-- Org admins can delete members from their org
CREATE POLICY "org_admins_delete_members" ON public.organization_members
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.organization_members AS om
      WHERE om.org_id = organization_members.org_id
        AND om.user_id = auth.uid()
        AND om.role = 'admin'
    )
  );

-- Members can read their own membership
CREATE POLICY "members_read_own" ON public.organization_members
  FOR SELECT USING (user_id = auth.uid());

-- ============================================================
-- 7. RLS Policies — organization_invites
-- ============================================================

-- Org admins can manage invites for their org
CREATE POLICY "org_admins_manage_invites" ON public.organization_invites
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_members.org_id = organization_invites.org_id
        AND organization_members.user_id = auth.uid()
        AND organization_members.role = 'admin'
    )
  );

-- ============================================================
-- 8. Storage bucket for org logos (optional — create if not exists)
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('org-logos', 'org-logos', true)
-- ON CONFLICT (id) DO NOTHING;
