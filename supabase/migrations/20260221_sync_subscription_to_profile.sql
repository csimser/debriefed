-- Trigger: sync profiles.tier, subscription_tier, plan, plan_expires_at
-- whenever a subscriptions row is inserted or updated.
-- Uses the most recent active, non-expired subscription (started_at DESC)
-- so that multiple rows for one user are handled correctly.

CREATE OR REPLACE FUNCTION sync_subscription_to_profile()
RETURNS TRIGGER AS $$
DECLARE
  latest_tier VARCHAR(20);
  latest_expires TIMESTAMPTZ;
BEGIN
  -- Find the most recent active, non-expired subscription for this user
  SELECT s.tier, s.expires_at
    INTO latest_tier, latest_expires
    FROM subscriptions s
   WHERE s.user_id = NEW.user_id
     AND s.status = 'active'
     AND s.expires_at > NOW()
   ORDER BY s.started_at DESC
   LIMIT 1;

  IF latest_tier IS NOT NULL THEN
    UPDATE profiles
       SET tier             = latest_tier,
           subscription_tier = latest_tier,
           plan             = latest_tier,
           plan_expires_at  = latest_expires
     WHERE user_id = NEW.user_id;
  ELSE
    -- No active subscription — revert to free
    UPDATE profiles
       SET tier             = 'free',
           subscription_tier = 'free',
           plan             = 'free',
           plan_expires_at  = NULL
     WHERE user_id = NEW.user_id;
  END IF;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in sync_subscription_to_profile: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fire on every INSERT or UPDATE on the subscriptions table
CREATE TRIGGER trg_sync_subscription_to_profile
  AFTER INSERT OR UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION sync_subscription_to_profile();
