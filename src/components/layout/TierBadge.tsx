'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface TierInfo {
  plan: string;
  expires_at: string | null;
}

export function TierBadge() {
  const [tier, setTier] = useState<TierInfo>({ plan: 'free', expires_at: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTier() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('plan, plan_expires_at')
          .eq('user_id', user.id)
          .single();

        if (profile) {
          // Check if plan has expired client-side
          if (profile.plan === 'full' && profile.plan_expires_at) {
            const expiresAt = new Date(profile.plan_expires_at);
            if (expiresAt < new Date()) {
              setTier({ plan: 'free', expires_at: null });
            } else {
              setTier({ plan: profile.plan, expires_at: profile.plan_expires_at });
            }
          } else {
            setTier({ plan: profile.plan || 'free', expires_at: profile.plan_expires_at });
          }
        }
      }
      setLoading(false);
    }

    fetchTier();

    // Refresh tier status periodically (every 5 minutes)
    const interval = setInterval(fetchTier, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Listen for tier update events (triggered after code redemption)
  useEffect(() => {
    const handleTierUpdate = () => {
      setLoading(true);
      // Re-fetch tier info
      const fetchTier = async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('plan, plan_expires_at')
            .eq('user_id', user.id)
            .single();

          if (profile) {
            if (profile.plan === 'full' && profile.plan_expires_at) {
              const expiresAt = new Date(profile.plan_expires_at);
              if (expiresAt < new Date()) {
                setTier({ plan: 'free', expires_at: null });
              } else {
                setTier({ plan: profile.plan, expires_at: profile.plan_expires_at });
              }
            } else {
              setTier({ plan: profile.plan || 'free', expires_at: profile.plan_expires_at });
            }
          }
        }
        setLoading(false);
      };
      fetchTier();
    };

    window.addEventListener('tier-updated', handleTierUpdate);
    return () => window.removeEventListener('tier-updated', handleTierUpdate);
  }, []);

  if (loading) {
    return <div className="animate-pulse bg-bg-tertiary h-10 w-24 rounded-lg" />;
  }

  const tierConfig: Record<string, { label: string; icon: string; className: string }> = {
    free: {
      label: 'Free',
      icon: '○',
      className: 'bg-bg-tertiary text-text-muted border-border'
    },
    core: {
      label: 'Core',
      icon: '◐',
      className: 'bg-blue-900/30 text-blue-400 border-blue-800'
    },
    full: {
      label: 'Full Access',
      icon: '★',
      className: 'bg-gold-dim text-gold border-gold/50'
    },
    expired: {
      label: 'Expired',
      icon: '○',
      className: 'bg-status-red/10 text-status-red border-status-red/30'
    }
  };

  const config = tierConfig[tier.plan] || tierConfig.free;
  const isBeta = tier.plan === 'full' && tier.expires_at;

  // Format expiration for display
  const formatExpiration = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const hoursLeft = Math.round((date.getTime() - now.getTime()) / (1000 * 60 * 60));

    if (hoursLeft <= 0) {
      return 'Expired';
    }
    if (hoursLeft < 24) {
      return `${hoursLeft}h remaining`;
    }
    if (hoursLeft < 48) {
      return `${Math.round(hoursLeft / 24)}d ${hoursLeft % 24}h left`;
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`px-3 py-2 rounded-lg border ${config.className}`}>
      <div className="flex items-center gap-2">
        <span className="text-lg">{config.icon}</span>
        <div>
          <span className="font-medium text-sm">
            {isBeta ? 'Beta (Full Access)' : config.label}
          </span>
          {isBeta && tier.expires_at && (
            <p className="text-xs opacity-70">
              {formatExpiration(tier.expires_at)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
