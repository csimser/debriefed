-- Migration: Payment and Usage Tracking Tables
-- Date: 2026-01-19
-- Description: Creates tables for Stripe payments, usage tracking, and abuse detection

-- Usage tracking table (tracks feature usage per period)
CREATE TABLE IF NOT EXISTS usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  feature VARCHAR(50) NOT NULL,
  count INT DEFAULT 0,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, feature, period_start)
);

-- Daily usage for rate limiting (Full tier)
CREATE TABLE IF NOT EXISTS daily_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  feature VARCHAR(50) NOT NULL,
  count INT DEFAULT 0,
  date DATE DEFAULT CURRENT_DATE,
  UNIQUE(user_id, feature, date)
);

-- Subscriptions / Payment tracking
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_customer_id VARCHAR(100),
  stripe_payment_id VARCHAR(100),
  tier VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Abuse tracking log
CREATE TABLE IF NOT EXISTS abuse_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  ip_address VARCHAR(64),
  action VARCHAR(100),
  details JSONB,
  severity VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add is_suspended column to profiles if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_suspended'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_suspended BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user ON usage_tracking(user_id, feature);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_period ON usage_tracking(user_id, period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_daily_usage_user ON daily_usage(user_id, date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_expires ON subscriptions(expires_at);
CREATE INDEX IF NOT EXISTS idx_abuse_log_user ON abuse_log(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_abuse_log_severity ON abuse_log(severity, created_at);

-- Enable Row Level Security
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE abuse_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Drop existing if they exist, then create
DROP POLICY IF EXISTS "Users can view own usage" ON usage_tracking;
DROP POLICY IF EXISTS "Service can manage usage" ON usage_tracking;
DROP POLICY IF EXISTS "Users can view own daily usage" ON daily_usage;
DROP POLICY IF EXISTS "Service can manage daily usage" ON daily_usage;
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Service can manage subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Admins only abuse" ON abuse_log;

-- Usage tracking policies
CREATE POLICY "Users can view own usage" ON usage_tracking
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service can manage usage" ON usage_tracking
  FOR ALL USING (true);

-- Daily usage policies
CREATE POLICY "Users can view own daily usage" ON daily_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service can manage daily usage" ON daily_usage
  FOR ALL USING (true);

-- Subscription policies
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service can manage subscriptions" ON subscriptions
  FOR ALL USING (true);

-- Abuse log policies (admin only)
CREATE POLICY "Admins only abuse" ON abuse_log
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Function to increment usage tracking (upsert pattern)
CREATE OR REPLACE FUNCTION increment_usage(
  p_user_id UUID,
  p_feature VARCHAR(50),
  p_period_start TIMESTAMPTZ
)
RETURNS VOID AS $$
BEGIN
  UPDATE usage_tracking
  SET count = count + 1, updated_at = NOW()
  WHERE user_id = p_user_id
    AND feature = p_feature
    AND period_start = p_period_start;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment daily usage (upsert pattern)
CREATE OR REPLACE FUNCTION increment_daily_usage(
  p_user_id UUID,
  p_feature VARCHAR(50),
  p_date DATE
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO daily_usage (user_id, feature, date, count)
  VALUES (p_user_id, p_feature, p_date, 1)
  ON CONFLICT (user_id, feature, date)
  DO UPDATE SET count = daily_usage.count + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION increment_usage TO authenticated;
GRANT EXECUTE ON FUNCTION increment_daily_usage TO authenticated;
