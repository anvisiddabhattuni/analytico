import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MoveRight,
  BarChart2,
  MessageSquare,
  Zap,
  PlugZap,
  TrendingUp,
  ChevronDown,
  ArrowRight,
  TrendingDown,
  Globe,
  Bot,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import Background from "../components/ui/Background";
import { ContainerScroll } from "../components/ui/container-scroll-animation";
import DisplayCards from "../components/ui/display-cards";
import { AnimatedHeroText } from "../components/ui/animated-hero";
import { PrimaryButton, GhostButton } from "../components/ui/Button";
import { AnalyticoBadge, AnalyticoWordmark } from "../components/ui/AnalyticoBadge";

const PREVIEW_STATS = [
  { label: "Page Likes", value: "12.4K", trend: "+8.2%", up: true },
  { label: "Reach", value: "48.2K", trend: "+22%", up: true },
  { label: "Engagement", value: "4.8%", trend: "+1.1%", up: true },
  { label: "Shares", value: "3.1K", trend: "-0.4%", up: false },
];

const PREVIEW_SECTIONS = [
  {
    title: "General",
    items: [
      { label: "Page Views", value: "14.2K" },
      { label: "Avg. Shares", value: "845" },
      { label: "Avg. Clicks", value: "1.2K" },
    ],
  },
  {
    title: "Videos",
    items: [
      { label: "Avg. Views", value: "45.2K" },
      { label: "Avg. Shares", value: "320" },
      { label: "Avg. Reactions", value: "890" },
    ],
  },
  {
    title: "Top Posts",
    items: [
      { label: "Video #12", value: "48.2K" },
      { label: "Post #7", value: "21.1K" },
      { label: "Post #3", value: "9.8K" },
    ],
  },
];

const PLATFORM_TABS = [
  { key: "facebook", label: "Facebook", Icon: Globe, active: true },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: <PlugZap className="h-6 w-6 text-orange-400" />,
    title: "Connect with Meta",
    description:
      "One OAuth login links your Facebook Page. No complex setup — just authorize and your data is in.",
  },
  {
    step: "02",
    icon: <BarChart2 className="h-6 w-6 text-orange-400" />,
    title: "See it all clearly",
    description:
      "A clear dashboard shows your Page growth, engagement, reach, and top-performing posts — all in one place.",
  },
  {
    step: "03",
    icon: <TrendingUp className="h-6 w-6 text-orange-400" />,
    title: "Grow with purpose",
    description:
      "GrowthBot reads your Facebook data and tells you exactly what to post, when to post, and who to target.",
  },
];

const FEATURES = [
  {
    icon: <BarChart2 className="h-5 w-5 text-orange-400" />,
    title: "Facebook analytics hub",
    description:
      "Page likes, reach, engagement, and top posts in a single clear view.",
  },
  {
    icon: <Zap className="h-5 w-5 text-orange-400" />,
    title: "Real-time insights",
    description:
      "Your numbers update live so you always see what's trending right now.",
  },
  {
    icon: <MessageSquare className="h-5 w-5 text-orange-400" />,
    title: "AI-powered GrowthBot",
    description:
      "Ask anything about your content and get tailored, data-backed recommendations.",
  },
];

function FadeUp({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function DashboardPreview() {
  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden p-2.5 text-white">
      {/* Mini navbar */}
      <div className="flex shrink-0 items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-xl">
        <div className="flex items-center gap-1.5">
          <AnalyticoBadge className="h-3.5 w-3.5" />
          <span className="font-display text-[10px] font-bold tracking-tight text-white">Analytico</span>
        </div>
        <div className="flex items-center gap-1">
          {PLATFORM_TABS.map((t) => (
            <span
              key={t.key}
              className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[9px] font-medium ${
                t.active ? "bg-accent-gradient text-[#08070b]" : "text-white/40"
              }`}
            >
              <t.Icon className="h-2.5 w-2.5" />
              {t.label}
            </span>
          ))}
        </div>
      </div>

      {/* Profile header */}
      <div className="flex shrink-0 items-center gap-2.5 rounded-2xl border border-white/10 bg-gradient-to-r from-blue-500/15 to-blue-400/10 px-3 py-2.5 backdrop-blur-xl">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 ring-1 ring-white/10">
          <Globe className="h-4 w-4 text-blue-400" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-display text-xs font-bold">Demo Page</p>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-medium text-blue-400">Facebook</span>
            <span className="rounded-full bg-white/8 px-1.5 py-px text-[8px] text-white/40">● Demo</span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid shrink-0 grid-cols-4 gap-1.5">
        {PREVIEW_STATS.map((s) => (
          <div
            key={s.label}
            className="flex flex-col gap-0.5 rounded-xl border border-white/8 bg-white/5 px-2 py-2 backdrop-blur-xl"
          >
            <span className="text-[8px] uppercase tracking-wider text-white/35">{s.label}</span>
            <span className="bg-accent-gradient bg-clip-text font-display text-sm font-bold text-transparent leading-none">
              {s.value}
            </span>
            <span className={`flex items-center gap-0.5 text-[8px] font-medium ${s.up ? "text-emerald-400" : "text-red-400"}`}>
              {s.up ? <TrendingUp className="h-2 w-2" /> : <TrendingDown className="h-2 w-2" />}
              {s.trend}
            </span>
          </div>
        ))}
      </div>

      {/* GrowthBot mini banner */}
      <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-orange-500/20 bg-gradient-to-r from-orange-500/10 to-red-500/5 px-3 py-2">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-orange-500/15 ring-1 ring-orange-500/20">
          <Bot className="h-3 w-3 text-orange-400" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-bold">GrowthBot</p>
          <p className="truncate text-[8px] text-white/40">Personalized tips from your analytics</p>
        </div>
        <span className="shrink-0 rounded-full bg-accent-gradient px-2 py-0.5 text-[8px] font-bold text-[#08070b]">
          Ask
        </span>
      </div>

      {/* Analytics sections */}
      <div className="grid flex-1 grid-cols-3 gap-1.5 overflow-hidden">
        {PREVIEW_SECTIONS.map((section) => (
          <div
            key={section.title}
            className="flex flex-col rounded-xl border border-white/8 bg-white/5 p-2 backdrop-blur-xl overflow-hidden"
          >
            <span className="mb-1.5 text-[8px] font-bold uppercase tracking-widest text-white/35">
              {section.title}
            </span>
            {section.items.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between border-b border-white/5 py-1 last:border-0"
              >
                <span className="text-[8px] text-white/45">{item.label}</span>
                <span className="font-display text-[8px] font-semibold text-white/80">{item.value}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SignUpPage() {
  const navigate = useNavigate();

  return (
    <Background>
      {/* ── Sticky nav ── */}
      <header className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-2xl bg-ink/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <AnalyticoBadge className="h-6 w-6" />
            <AnalyticoWordmark className="text-sm" />
          </div>
          <div className="flex items-center gap-3">
            <GhostButton onClick={() => navigate("/login-analytics")}>Log in</GhostButton>
            <PrimaryButton onClick={() => navigate("/create-account")}>Get started</PrimaryButton>
          </div>
        </div>
      </header>

      {/* ── Hero + ContainerScroll (dashboard preview) ── */}
      <ContainerScroll
        titleComponent={
          <div className="flex flex-col items-center gap-6 pb-20 text-center md:pb-28">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-white/55"
            >
              For creators &amp; social media managers
            </motion.span>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <AnimatedHeroText />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="max-w-xl text-base leading-relaxed text-white/50 sm:text-lg"
            >
              Pull your Facebook Page analytics into one clear dashboard — see where
              you're falling short and exactly what to do about it.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="flex flex-wrap items-center justify-center gap-3"
            >
              <PrimaryButton onClick={() => navigate("/create-account")}>
                Get started
                <MoveRight className="h-4 w-4" />
              </PrimaryButton>
              <GhostButton onClick={() => navigate("/login-analytics")}>
                I have an account
              </GhostButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col items-center gap-1 text-white/45"
            >
              <span className="text-xs tracking-widest uppercase">Scroll to explore</span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </motion.div>
          </div>
        }
      >
        <DashboardPreview />
      </ContainerScroll>

      {/* ── How it works ── */}
      <section className="mx-auto max-w-6xl px-6 pb-28">
        <FadeUp className="mb-14 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-orange-400/70">
            Simple by design
          </p>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Up and running in{" "}
            <span className="bg-accent-gradient bg-clip-text text-transparent">
              under a minute.
            </span>
          </h2>
        </FadeUp>

        <div className="grid gap-6 sm:grid-cols-3">
          {HOW_IT_WORKS.map((item, i) => (
            <FadeUp key={item.step} delay={i * 0.1}>
              <div className="glass group relative flex h-full flex-col gap-4 rounded-3xl p-6 transition duration-300 hover:bg-white/10">
                <div className="flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 transition group-hover:bg-orange-500/20">
                    {item.icon}
                  </span>
                  <span className="font-display text-5xl font-bold text-white/5 select-none">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                <p className="text-sm leading-relaxed text-white/50">{item.description}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── Platforms showcase: features + DisplayCards ── */}
      <section className="mx-auto max-w-6xl px-6 pb-28">
        <div className="flex flex-col gap-16 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <FadeUp>
              <p className="mb-3 text-xs uppercase tracking-[0.25em] text-orange-400/70">
                All your data
              </p>
              <h2 className="mb-4 font-display text-3xl font-bold sm:text-4xl">
                Meta ecosystem.{" "}
                <span className="bg-accent-gradient bg-clip-text text-transparent">
                  One view.
                </span>
              </h2>
              <p className="mb-10 max-w-sm text-white/50 leading-relaxed">
                Stop guessing what's working. Analytico surfaces what matters from
                your Facebook Page — all in one place.
              </p>
            </FadeUp>

            <div className="grid gap-4 sm:grid-cols-3">
              {FEATURES.map((f, i) => (
                <FadeUp key={f.title} delay={i * 0.08}>
                  <div className="glass flex h-full flex-col gap-3 rounded-2xl p-5 transition hover:bg-white/10">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">
                      {f.icon}
                    </span>
                    <h3 className="font-display text-sm font-bold">{f.title}</h3>
                    <p className="text-xs leading-relaxed text-white/50">{f.description}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>

          <FadeUp delay={0.15} className="flex-shrink-0">
            <DisplayCards />
          </FadeUp>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <FadeUp>
        <section className="mx-auto max-w-6xl px-6 pb-32">
          <div className="glass relative overflow-hidden rounded-4xl p-12 text-center">
            <div className="pointer-events-none absolute inset-0 bg-accent-gradient opacity-5" />
            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/15">
                <TrendingUp className="h-7 w-7 text-orange-400" />
              </div>
              <h2 className="font-display text-3xl font-bold sm:text-4xl">
                Ready to grow{" "}
                <span className="bg-accent-gradient bg-clip-text text-transparent">
                  on purpose?
                </span>
              </h2>
              <p className="max-w-md text-white/50 leading-relaxed">
                Join creators who've stopped guessing and started growing. Set up your
                dashboard in under a minute.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <PrimaryButton onClick={() => navigate("/create-account")}>
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </PrimaryButton>
                <GhostButton onClick={() => navigate("/login-analytics")}>
                  Log in
                </GhostButton>
              </div>
            </div>
          </div>
        </section>
      </FadeUp>

      {/* ── Footer ── */}
      <footer className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 pb-12 text-xs text-white/35 sm:flex-row sm:justify-between">
        <span>© {new Date().getFullYear()} Analytico</span>
        <div className="flex items-center gap-5">
          <button onClick={() => navigate("/privacy")} className="transition hover:text-white/60">
            Privacy
          </button>
          <button onClick={() => navigate("/terms")} className="transition hover:text-white/60">
            Terms
          </button>
          <button onClick={() => navigate("/data-deletion")} className="transition hover:text-white/60">
            Data Deletion
          </button>
        </div>
      </footer>
    </Background>
  );
}
