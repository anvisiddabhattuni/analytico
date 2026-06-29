import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Globe, ChevronRight, AlertCircle } from 'lucide-react';
import { isAuthenticated, getMetaOAuthUrl } from '../services/api';
import Background from '../components/ui/Background';
import GlassCard from '../components/ui/GlassCard';
import { PrimaryButton, GhostButton } from '../components/ui/Button';
import { AnalyticoBadge, AnalyticoWordmark } from '../components/ui/AnalyticoBadge';

const PERMISSIONS = [
  { icon: Globe, label: 'Facebook Page', detail: 'Page likes, impressions, engagement, reach & top post performance' },
];

export default function MetaConnectPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) navigate('/login-analytics');
  }, [navigate]);

  const handleConnect = async () => {
    setLoading(true);
    setError('');
    try {
      const { url } = await getMetaOAuthUrl();
      window.location.href = url;
    } catch (err) {
      if (err.status === 503) {
        navigate('/loading-facebook');
      } else {
        setError('Could not start connection. Please try again.');
        setLoading(false);
      }
    }
  };

  return (
    <Background className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <AnalyticoBadge className="h-6 w-6" />
            <AnalyticoWordmark className="text-sm" />
          </div>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            Connect your Meta account
          </h1>
          <p className="text-sm text-white/50">
            Grant read-only access so Analytico can display your stats.
          </p>
        </div>

        <GlassCard className="flex flex-col gap-6 p-8">
          {/* Permissions list */}
          <div className="flex flex-col gap-1">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-white/40">
              What we'll access
            </p>
            {PERMISSIONS.map(({ icon: Icon, label, detail }) => (
              <div key={label} className="flex items-start gap-3 rounded-2xl px-4 py-3 transition hover:bg-white/5">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange-500/10">
                  <Icon className="h-4 w-4 text-orange-400" />
                </span>
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-white/45 leading-relaxed">{detail}</p>
                </div>
                <ChevronRight className="ml-auto mt-1 h-4 w-4 shrink-0 text-white/20" />
              </div>
            ))}
          </div>

          {/* Trust badge */}
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3">
            <Shield className="h-4 w-4 shrink-0 text-emerald-400" />
            <p className="text-xs text-white/50 leading-relaxed">
              Read-only access. We never post, like, or modify anything.
              Revoke access from Meta settings at any time.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <PrimaryButton onClick={handleConnect} disabled={loading} className="w-full">
              {loading ? 'Connecting…' : 'Connect with Meta'}
            </PrimaryButton>
            <GhostButton onClick={() => navigate('/loading-facebook')} className="w-full">
              Try with demo data
            </GhostButton>
            <GhostButton onClick={() => navigate('/login')} className="w-full text-white/40">
              Back
            </GhostButton>
          </div>
        </GlassCard>
      </div>
    </Background>
  );
}
