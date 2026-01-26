-- Migration: Complete Tracking Tables
-- Date: 2026-01-25
-- Description: Creates all missing tables for analytics, usage tracking, and activity logging

-- =====================================================
-- PAGE VIEWS TABLE - Site analytics tracking
-- =====================================================
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path VARCHAR(500) NOT NULL,
  session_id VARCHAR(100) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  referrer TEXT,
  user_agent TEXT,
  ip_hash VARCHAR(64),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_page_views_created ON page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(path);
CREATE INDEX IF NOT EXISTS idx_page_views_session ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_user ON page_views(user_id);

-- Enable RLS but allow inserts for everyone (tracking needs to work for anonymous visitors)
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert page views (tracking endpoint uses service client anyway)
DROP POLICY IF EXISTS "Allow page view inserts" ON page_views;
CREATE POLICY "Allow page view inserts" ON page_views
  FOR INSERT WITH CHECK (true);

-- Only admins can read page views
DROP POLICY IF EXISTS "Admins can read page views" ON page_views;
CREATE POLICY "Admins can read page views" ON page_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid() AND profiles.is_admin = true
    )
  );

-- =====================================================
-- API USAGE TABLE - Token consumption tracking
-- =====================================================
CREATE TABLE IF NOT EXISTS api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  endpoint VARCHAR(100) NOT NULL,
  tokens_used INT DEFAULT 0,
  input_tokens INT DEFAULT 0,
  output_tokens INT DEFAULT 0,
  model VARCHAR(100),
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for API usage queries
CREATE INDEX IF NOT EXISTS idx_api_usage_user ON api_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_created ON api_usage(created_at);
CREATE INDEX IF NOT EXISTS idx_api_usage_endpoint ON api_usage(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_usage_user_created ON api_usage(user_id, created_at);

-- Enable RLS
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- Users can view their own API usage
DROP POLICY IF EXISTS "Users can view own api usage" ON api_usage;
CREATE POLICY "Users can view own api usage" ON api_usage
  FOR SELECT USING (auth.uid() = user_id);

-- Service role can insert (for logging from API routes)
DROP POLICY IF EXISTS "Service can manage api usage" ON api_usage;
CREATE POLICY "Service can manage api usage" ON api_usage
  FOR ALL USING (true);

-- =====================================================
-- USAGE TABLE - Cumulative feature usage counters
-- =====================================================
CREATE TABLE IF NOT EXISTS usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  resumes_created INT DEFAULT 0,
  resumes_downloaded INT DEFAULT 0,
  cover_letters INT DEFAULT 0,
  job_matches INT DEFAULT 0,
  eval_uploads INT DEFAULT 0,
  bullet_rewrites INT DEFAULT 0,
  ai_summaries INT DEFAULT 0,
  private_downloads INT DEFAULT 0,
  federal_downloads INT DEFAULT 0,
  linkedin_generations INT DEFAULT 0,
  federal_or_tailored_used BOOLEAN DEFAULT false,
  monthly_private_downloads INT DEFAULT 0,
  daily_private_downloads INT DEFAULT 0,
  monthly_federal_downloads INT DEFAULT 0,
  daily_federal_downloads INT DEFAULT 0,
  monthly_reset_date TIMESTAMPTZ,
  daily_reset_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for usage lookups
CREATE INDEX IF NOT EXISTS idx_usage_user ON usage(user_id);

-- Enable RLS
ALTER TABLE usage ENABLE ROW LEVEL SECURITY;

-- Users can view their own usage
DROP POLICY IF EXISTS "Users can view own usage stats" ON usage;
CREATE POLICY "Users can view own usage stats" ON usage
  FOR SELECT USING (auth.uid() = user_id);

-- Service role can manage (for incrementing from API routes)
DROP POLICY IF EXISTS "Service can manage usage stats" ON usage;
CREATE POLICY "Service can manage usage stats" ON usage
  FOR ALL USING (true);

-- =====================================================
-- ACTIVITY LOG TABLE - User and admin action tracking
-- =====================================================
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action VARCHAR(100) NOT NULL,
  details JSONB DEFAULT '{}',
  ip_hash VARCHAR(64),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for activity log queries
CREATE INDEX IF NOT EXISTS idx_activity_log_user ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_action ON activity_log(action);
CREATE INDEX IF NOT EXISTS idx_activity_log_created ON activity_log(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_action ON activity_log(user_id, action);

-- Enable RLS
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Users can view their own activity
DROP POLICY IF EXISTS "Users can view own activity" ON activity_log;
CREATE POLICY "Users can view own activity" ON activity_log
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all activity
DROP POLICY IF EXISTS "Admins can view all activity" ON activity_log;
CREATE POLICY "Admins can view all activity" ON activity_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Service role can insert (for logging from API routes)
DROP POLICY IF EXISTS "Service can manage activity log" ON activity_log;
CREATE POLICY "Service can manage activity log" ON activity_log
  FOR ALL USING (true);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to increment private downloads with reset logic
CREATE OR REPLACE FUNCTION increment_private_downloads(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO usage (user_id, private_downloads)
  VALUES (p_user_id, 1)
  ON CONFLICT (user_id)
  DO UPDATE SET
    private_downloads = usage.private_downloads + 1,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment monthly private downloads with reset date
CREATE OR REPLACE FUNCTION increment_monthly_private_downloads(p_user_id UUID, p_reset_date TIMESTAMPTZ)
RETURNS VOID AS $$
BEGIN
  UPDATE usage
  SET
    monthly_private_downloads = CASE
      WHEN monthly_reset_date IS NULL OR monthly_reset_date <= NOW() THEN 1
      ELSE monthly_private_downloads + 1
    END,
    monthly_reset_date = p_reset_date,
    updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment daily private downloads with reset date
CREATE OR REPLACE FUNCTION increment_daily_private_downloads(p_user_id UUID, p_reset_date TIMESTAMPTZ)
RETURNS VOID AS $$
BEGIN
  UPDATE usage
  SET
    daily_private_downloads = CASE
      WHEN daily_reset_date IS NULL OR daily_reset_date <= NOW() THEN 1
      ELSE daily_private_downloads + 1
    END,
    daily_reset_date = p_reset_date,
    updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment federal downloads
CREATE OR REPLACE FUNCTION increment_federal_downloads(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO usage (user_id, federal_downloads)
  VALUES (p_user_id, 1)
  ON CONFLICT (user_id)
  DO UPDATE SET
    federal_downloads = usage.federal_downloads + 1,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment monthly federal downloads with reset date
CREATE OR REPLACE FUNCTION increment_monthly_federal_downloads(p_user_id UUID, p_reset_date TIMESTAMPTZ)
RETURNS VOID AS $$
BEGIN
  -- First ensure monthly_federal_downloads column exists (add if missing)
  UPDATE usage
  SET
    monthly_federal_downloads = CASE
      WHEN monthly_reset_date IS NULL OR monthly_reset_date <= NOW() THEN 1
      ELSE COALESCE(monthly_federal_downloads, 0) + 1
    END,
    monthly_reset_date = p_reset_date,
    updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment daily federal downloads with reset date
CREATE OR REPLACE FUNCTION increment_daily_federal_downloads(p_user_id UUID, p_reset_date TIMESTAMPTZ)
RETURNS VOID AS $$
BEGIN
  UPDATE usage
  SET
    daily_federal_downloads = CASE
      WHEN daily_reset_date IS NULL OR daily_reset_date <= NOW() THEN 1
      ELSE COALESCE(daily_federal_downloads, 0) + 1
    END,
    daily_reset_date = p_reset_date,
    updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION increment_private_downloads TO authenticated;
GRANT EXECUTE ON FUNCTION increment_monthly_private_downloads TO authenticated;
GRANT EXECUTE ON FUNCTION increment_daily_private_downloads TO authenticated;
GRANT EXECUTE ON FUNCTION increment_federal_downloads TO authenticated;
GRANT EXECUTE ON FUNCTION increment_monthly_federal_downloads TO authenticated;
GRANT EXECUTE ON FUNCTION increment_daily_federal_downloads TO authenticated;
