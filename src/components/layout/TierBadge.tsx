'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface TierInfo {
  tier: string;
  expires_at: string | null;
}

export function TierBadge() {
  const [tierInfo, setTierInfo] = useState<TierInfo>({ tier: 'free', expires_at: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTier() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('tier, plan_expires_at')
          .eq('user_id', user.id)
          .single();

        if (profile) {
          // Check if tier has expired client-side
          if ((profile.tier === 'full' || profile.tier === 'core') && profile.plan_expires_at) {
            const expiresAt = new Date(profile.plan_expires_at);
            if (expiresAt < new Date()) {
              setTierInfo({ tier: 'expired', expires_at: null });
            } else {
              setTierInfo({ tier: profile.tier, expires_at: profile.plan_expires_at });
            }
          } else {
            setTierInfo({ tier: profile.tier || 'free', expires_at: profile.plan_expires_at });
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
      const fetchTier = async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('tier, plan_expires_at')
            .eq('user_id', user.id)
            .single();

          if (profile) {
            if ((profile.tier === 'full' || profile.tier === 'core') && profile.plan_expires_at) {
              const expiresAt = new Date(profile.plan_expires_at);
              if (expiresAt < new Date()) {
                setTierInfo({ tier: 'expired', expires_at: null });
              } else {
                setTierInfo({ tier: profile.tier, expires_at: profile.plan_expires_at });
              }
            } else {
              setTierInfo({ tier: profile.tier || 'free', expires_at: profile.plan_expires_at });
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
      className: 'bg-status-blue/20 text-status-blue border-status-blue/50'
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

  const config = tierConfig[tierInfo.tier] || tierConfig.free;

  // Format expiration for display
  const formatExpiration = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const daysLeft = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysLeft <= 0) {
      return 'Expired';
    }
    if (daysLeft === 1) {
      const hoursLeft = Math.round((date.getTime() - now.getTime()) / (1000 * 60 * 60));
      return `${hoursLeft}h remaining`;
    }
    return `${daysLeft}d remaining`;
  };

  return (
    <div className={`px-3 py-2 rounded-lg border ${config.className}`}>
      <div className="flex items-center gap-2">
        <span className="text-lg">{config.icon}</span>
        <div>
          <span className="font-medium text-sm">
            {config.label}
          </span>
          {tierInfo.expires_at && (tierInfo.tier === 'core' || tierInfo.tier === 'full') && (
            <p className="text-xs opacity-70">
              {formatExpiration(tierInfo.expires_at)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
