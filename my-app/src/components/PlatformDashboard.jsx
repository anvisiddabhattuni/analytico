import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, LayoutGroup } from "framer-motion";
import { Globe, BarChart3, Calendar, Target } from "lucide-react";
import { getAnalytics, isAuthenticated } from "../services/api";
import Background from "./ui/Background";
import GlassCard from "./ui/GlassCard";
import { PrimaryButton, GhostButton } from "./ui/Button";
import Navbar from "./Navbar";
import AnalyticsTab from "./dashboard/AnalyticsTab";
import CalendarTab from "./dashboard/CalendarTab";
import ObjectiveTab from "./dashboard/ObjectiveTab";

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

const TABS = [
  { key: "analytics", label: "Analytics", Icon: BarChart3 },
  { key: "calendar", label: "Calendar", Icon: Calendar },
  { key: "objective", label: "Objective", Icon: Target },
];

export default function PlatformDashboard({ platform }) {
  const navigate = useNavigate();
  const config = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.facebook;
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("analytics");

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

        {/* Tab bar */}
        <div className="glass flex w-fit items-center gap-1 rounded-full p-1.5">
          {TABS.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                activeTab === key ? "bg-accent-gradient text-ink" : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        <LayoutGroup>
          {activeTab === "analytics" && (
            <AnalyticsTab
              data={data}
              config={config}
              platform={platform}
              navigate={navigate}
              onNavigateTab={setActiveTab}
            />
          )}
          {activeTab === "calendar" && (
            <motion.div layoutId="calendar-panel">
              <CalendarTab />
            </motion.div>
          )}
          {activeTab === "objective" && (
            <motion.div layoutId="objective-panel">
              <ObjectiveTab />
            </motion.div>
          )}
        </LayoutGroup>

      </div>
    </Background>
  );
}
