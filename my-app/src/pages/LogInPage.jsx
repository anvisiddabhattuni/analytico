import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../services/api';
import Background from '../components/ui/Background';
import GlassCard from '../components/ui/GlassCard';
import { PrimaryButton } from '../components/ui/Button';
import { Globe, ShieldCheck, BarChart2 } from 'lucide-react';

function LogInPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) navigate('/login-analytics');
  }, [navigate]);

  return (
    <Background className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">

        <div className="mb-6 flex justify-center">
          <span className="glass rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-white/50">
            Meta Analytics
          </span>
        </div>

        <GlassCard className="flex flex-col items-center gap-7 p-8 text-center">

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 ring-1 ring-white/10">
            <Globe className="h-8 w-8 text-blue-400" />
          </div>

          <div className="flex flex-col items-center gap-2">
            <h2 className="font-display text-2xl font-bold">Facebook Analytics</h2>
            <p className="text-sm leading-relaxed text-white/50">
              Connect your Facebook Page to see reach, engagement, impressions, and growth — all in one dashboard.
            </p>
          </div>

          <div className="w-full rounded-2xl bg-white/5 px-4 py-3 text-left">
            {[
              'Page likes & follower growth',
              'Reach & impressions (28 days)',
              'Post engagement & performance',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 py-1.5">
                <BarChart2 className="h-3.5 w-3.5 shrink-0 text-orange-400" />
                <span className="text-xs text-white/55">{item}</span>
              </div>
            ))}
          </div>

          <PrimaryButton onClick={() => navigate('/meta-connect')} className="w-full">
            Connect Facebook Page
          </PrimaryButton>

          <div className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-white/25" />
            <span className="text-xs text-white/25">Read-only · Secure OAuth 2.0 · Revoke anytime</span>
          </div>

        </GlassCard>
      </div>
    </Background>
  );
}

export default LogInPage;
