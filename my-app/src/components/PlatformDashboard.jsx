import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown, Bot, Sparkles, Globe } from "lucide-react";
import { getAnalytics, isAuthenticated } from "../services/api";
import Background from "./ui/Background";
import GlassCard from "./ui/GlassCard";
import { PrimaryButton, GhostButton } from "./ui/Button";
import Navbar from "./Navbar";

const PLATFORM_CONFIG = {
  facebook: {
    label: "Facebook",
    color: "from-blue-600/20 to-blue-400/10",
    glow: "shadow-[0_0_60px_rgba(59,130,246,0.08)]",
    accent: "text-blue-400",
    Icon: Globe,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10",
  },
};

function StatCard({ label, value, trend }) {
  const up = trend && !trend.startsWith("-");
  return (
    <div className="glass flex flex-col gap-3 rounded-3xl p-5 transition duration-200 hover:bg-white/8">
      <span className="text-xs font-medium uppercase tracking-widest text-white/35">{label}</span>
      <span className="bg-accent-gradient bg-clip-text font-display text-3xl font-bold text-transparent leading-none">
        {value}
      </span>
      {trend && (
        <span className={`flex items-center gap-1 text-xs font-medium ${up ? "text-emerald-400" : "text-red-400"}`}>
          {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {trend} this week
        </span>
      )}
    </div>
  );
}

function SectionCard({ section }) {
  return (
    <GlassCard className="flex flex-col p-6">
      <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-white/40">
        {section.title}
      </h3>
      <ul className="flex flex-col">
        {(section.items || []).map((item) => (
          <li
            key={item.label}
            className="flex items-center justify-between gap-4 border-b border-white/5 py-3 last:border-0"
          >
            <span className="text-sm text-white/55">{item.label}</span>
            <span className="font-display text-sm font-semibold tabular-nums">{item.value}</span>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}

export default function PlatformDashboard({ platform }) {
  const navigate = useNavigate();
  const config = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.facebook;
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login-analytics");
      return;
    }

    let cancelled = false;

    async function loadAnalytics() {
      try {
        const analytics = await getAnalytics(platform);
        if (!cancelled) setData(analytics);
      } catch (err) {
        if (!cancelled) {
          if (err.status === 401) navigate("/login-analytics");
          else setError(err.message || "Failed to load analytics");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAnalytics();
    return () => { cancelled = true; };
  }, [navigate, platform]);

  if (loading) {
    return (
      <Background className="flex min-h-screen items-center justify-center">
        <div role="status" aria-label="Loading analytics" className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-white/8" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-orange-400 motion-reduce:animate-none" />
        </div>
      </Background>
    );
  }

  if (error) {
    return (
      <Background className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-white/60">{error}</p>
        <PrimaryButton onClick={() => navigate("/login")}>Back to connect accounts</PrimaryButton>
      </Background>
    );
  }

  const stats = Object.entries(data.stats || {});
  const trends = data.stat_trends || {};

  return (
    <Background>
      <Navbar />

      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 pb-24">

        {/* Profile header */}
        <GlassCard className={`relative overflow-hidden p-6 bg-gradient-to-r ${config.color} ${config.glow}`}>
          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ring-1 ring-white/10 ${config.iconBg}`}>
                <config.Icon className={`h-7 w-7 ${config.iconColor}`} />
              </span>
              <div>
                <h1 className="font-display text-2xl font-bold">{data.username}</h1>
                <div className="mt-1 flex items-center gap-2">
                  <span className={`text-sm font-medium ${config.accent}`}>{config.label}</span>
                  {data.data_source && (
                    <span className="rounded-full bg-white/8 px-2.5 py-0.5 text-xs text-white/40">
                      {data.data_source === "live" ? "● Live" : "● Demo"}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <GhostButton onClick={() => navigate("/login")} className="self-start sm:self-auto">
              Switch account
            </GhostButton>
          </div>
        </GlassCard>

        {/* Demo data notice */}
        {data.data_source === "mock" && (
          <div className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-xs text-white/40">
            <span className="font-semibold text-white/60">Showing demo data.</span>{" "}
            Connect a Facebook Page to see your real analytics.
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map(([label, value]) => (
            <StatCard key={label} label={label} value={value} trend={trends[label]} />
          ))}
        </div>

        {/* GrowthBot banner */}
        <div className="relative overflow-hidden rounded-3xl border border-orange-500/20 bg-gradient-to-r from-orange-500/10 via-red-500/8 to-orange-400/5 p-6 transition-colors duration-200 hover:border-orange-500/35 hover:from-orange-500/15">
          <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-orange-500/10 blur-2xl" />
          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500/15 ring-1 ring-orange-500/20">
                <Bot aria-hidden="true" className="h-6 w-6 text-orange-400" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-bold">GrowthBot</h3>
                  <span className="flex items-center gap-1 rounded-full bg-orange-500/15 px-2.5 py-0.5 text-xs font-medium text-orange-400">
                    <Sparkles aria-hidden="true" className="h-3 w-3" />
                    AI
                  </span>
                </div>
                <p className="text-sm text-white/50">
                  Get personalized growth tips based on your {config.label} analytics.
                </p>
              </div>
            </div>
            <PrimaryButton
              onClick={() => navigate("/growth-bot", { state: { platform } })}
              className="shrink-0 self-start sm:self-auto"
            >
              Ask GrowthBot
            </PrimaryButton>
          </div>
        </div>

        {/* Analytics sections */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {(data.sections || []).map((section) => (
            <SectionCard key={section.title} section={section} />
          ))}
        </div>

      </div>
    </Background>
  );
}
