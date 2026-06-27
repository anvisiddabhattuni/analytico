import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../services/api';
import Background from '../components/ui/Background';
import GlassCard from '../components/ui/GlassCard';
import { PrimaryButton } from '../components/ui/Button';
import { Camera, Globe, MessageSquare, ShieldCheck } from 'lucide-react';

const META_PLATFORMS = [
  { icon: Camera, label: 'Instagram', color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { icon: Globe, label: 'Facebook', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { icon: MessageSquare, label: 'Threads', color: 'text-white/50', bg: 'bg-white/5' },
];

function LogInPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login-analytics');
    }
  }, [navigate]);

  return (
    <Background className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">

        {/* Badge */}
        <div className="mb-6 flex justify-center">
          <span className="glass rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-white/50">
            Meta Analytics
          </span>
        </div>

        <GlassCard className="flex flex-col items-center gap-7 p-8 text-center">

          {/* Platform icons */}
          <div className="flex items-center justify-center gap-4">
            {META_PLATFORMS.map(({ icon: Icon, label, color, bg }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${bg} ring-1 ring-white/10`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </span>
                <span className="text-[11px] text-white/35">{label}</span>
              </div>
            ))}
          </div>

          {/* Heading */}
          <div className="flex flex-col items-center gap-2">
            <h2 className="font-display text-2xl font-bold">Meta Business Suite</h2>
            <p className="text-sm leading-relaxed text-white/50">
              Connect once and see your Instagram, Facebook, and Threads analytics all in one place.
            </p>
          </div>

          {/* CTA */}
          <PrimaryButton onClick={() => navigate('/meta-connect')} className="w-full">
            Continue with Meta
          </PrimaryButton>

          {/* Trust line */}
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
