import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Target, ArrowUpRight, Sparkles } from "lucide-react";
import { getScheduledPosts, getProfile } from "../../services/api";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function buildMonthGrid(year, month) {
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function formatShortDate(iso) {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function CalendarMiniCard({ onExpand }) {
  const today = useMemo(() => new Date(), []);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const year = today.getFullYear();
  const month = today.getMonth();
  const grid = useMemo(() => buildMonthGrid(year, month), [year, month]);
  const monthStart = toISODate(new Date(year, month, 1));
  const monthEnd = toISODate(new Date(year, month + 1, 0));
  const todayIso = toISODate(today);

  useEffect(() => {
    let cancelled = false;
    getScheduledPosts(monthStart, monthEnd)
      .then((res) => { if (!cancelled) setPosts(res.posts || []); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [monthStart, monthEnd]);

  const postDates = useMemo(() => new Set(posts.map((p) => p.scheduled_date)), [posts]);
  const upcoming = useMemo(
    () =>
      posts
        .filter((p) => p.scheduled_date >= todayIso)
        .sort((a, b) => (a.scheduled_date + a.scheduled_time).localeCompare(b.scheduled_date + b.scheduled_time))
        .slice(0, 2),
    [posts, todayIso]
  );

  return (
    <motion.button
      layoutId="calendar-panel"
      onClick={onExpand}
      className="glass group flex flex-col gap-4 rounded-3xl p-5 text-left transition duration-200 hover:bg-white/8"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10">
            <Calendar className="h-4 w-4 text-orange-400" />
          </span>
          <div>
            <h3 className="font-display text-sm font-bold">Calendar</h3>
            <p className="text-[11px] text-white/40">
              {today.toLocaleDateString(undefined, { month: "long" })}
            </p>
          </div>
        </div>
        <ArrowUpRight className="h-4 w-4 text-white/25 transition group-hover:text-white/60" />
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {WEEKDAYS.map((d, i) => (
          <span key={i} className="text-center text-[8px] font-medium text-white/25">{d}</span>
        ))}
        {grid.map((date, i) => {
          if (!date) return <span key={`b-${i}`} className="h-5" />;
          const iso = toISODate(date);
          const isToday = iso === todayIso;
          const hasPost = postDates.has(iso);
          return (
            <span
              key={iso}
              className={`mx-auto flex h-5 w-5 items-center justify-center rounded-md text-[9px] ${
                isToday ? "bg-accent-gradient font-bold text-ink" : hasPost ? "bg-white/10 text-white/70" : "text-white/35"
              }`}
            >
              {date.getDate()}
            </span>
          );
        })}
      </div>

      <div className="flex flex-col gap-1.5 border-t border-white/5 pt-3">
        {loading ? (
          <p className="text-xs text-white/30">Loading…</p>
        ) : upcoming.length === 0 ? (
          <p className="text-xs text-white/40">Nothing scheduled — tap to plan your week.</p>
        ) : (
          upcoming.map((post) => (
            <div key={post.id} className="flex items-center gap-2 text-xs">
              <span className="shrink-0 font-medium text-orange-400">{formatShortDate(post.scheduled_date)}</span>
              <span className="truncate text-white/50">{post.content}</span>
            </div>
          ))
        )}
      </div>
    </motion.button>
  );
}

export function ObjectiveMiniCard({ onExpand }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getProfile()
      .then((res) => { if (!cancelled) setProfile(res); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const hasObjective = profile?.objective || profile?.company_name;

  return (
    <motion.button
      layoutId="objective-panel"
      onClick={onExpand}
      className="glass group flex flex-col gap-4 rounded-3xl p-5 text-left transition duration-200 hover:bg-white/8"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10">
            <Target className="h-4 w-4 text-orange-400" />
          </span>
          <div>
            <h3 className="font-display text-sm font-bold">Objective</h3>
            <p className="text-[11px] text-white/40">Feeds GrowthBot &amp; AI calendar</p>
          </div>
        </div>
        <ArrowUpRight className="h-4 w-4 text-white/25 transition group-hover:text-white/60" />
      </div>

      <div className="flex flex-1 flex-col justify-center">
        {loading ? (
          <p className="text-xs text-white/30">Loading…</p>
        ) : hasObjective ? (
          <>
            {profile.company_name && (
              <p className="mb-1 text-sm font-semibold text-white/85">{profile.company_name}</p>
            )}
            <p className="line-clamp-3 text-xs leading-relaxed text-white/50">
              {profile.objective || "No objective written yet — tap to add one."}
            </p>
          </>
        ) : (
          <div className="flex items-start gap-2">
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-400" />
            <p className="text-xs leading-relaxed text-white/45">
              You haven't set an objective yet — tap to tell Analytico what you're trying to
              achieve and get sharper AI suggestions.
            </p>
          </div>
        )}
      </div>
    </motion.button>
  );
}
