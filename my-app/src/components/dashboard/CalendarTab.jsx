import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Sparkles, X, Trash2 } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import { PrimaryButton, GhostButton } from "../ui/Button";
import {
  getScheduledPosts,
  createScheduledPost,
  deleteScheduledPost,
  generateSchedule,
} from "../../services/api";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

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

function formatTime(t) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export default function CalendarTab() {
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(toISODate(today));

  const [showAddForm, setShowAddForm] = useState(false);
  const [addTime, setAddTime] = useState("10:00");
  const [addContent, setAddContent] = useState("");
  const [addSaving, setAddSaving] = useState(false);

  const [showAiPanel, setShowAiPanel] = useState(false);
  const [aiScope, setAiScope] = useState("week");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [suggestions, setSuggestions] = useState(null);
  const [addingSuggestionKey, setAddingSuggestionKey] = useState(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const grid = useMemo(() => buildMonthGrid(year, month), [year, month]);

  const monthStart = toISODate(new Date(year, month, 1));
  const monthEnd = toISODate(new Date(year, month + 1, 0));

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    getScheduledPosts(monthStart, monthEnd)
      .then((res) => { if (!cancelled) setPosts(res.posts || []); })
      .catch((err) => { if (!cancelled) setError(err.message || "Failed to load calendar."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [monthStart, monthEnd]);

  const postsByDate = useMemo(() => {
    const map = {};
    for (const post of posts) {
      (map[post.scheduled_date] = map[post.scheduled_date] || []).push(post);
    }
    return map;
  }, [posts]);

  const selectedPosts = (postsByDate[selectedDate] || []).slice().sort((a, b) =>
    (a.scheduled_time || "").localeCompare(b.scheduled_time || "")
  );

  function goToMonth(delta) {
    setViewDate(new Date(year, month + delta, 1));
  }

  function selectDay(date) {
    if (!date) return;
    setSelectedDate(toISODate(date));
    setShowAddForm(false);
    setShowAiPanel(false);
    setSuggestions(null);
  }

  async function handleAddPost(e) {
    e.preventDefault();
    if (!addContent.trim()) return;
    setAddSaving(true);
    try {
      const created = await createScheduledPost({
        date: selectedDate,
        time: addTime,
        content: addContent.trim(),
      });
      setPosts((prev) => [...prev, created]);
      setAddContent("");
      setShowAddForm(false);
    } catch (err) {
      setError(err.message || "Failed to add post.");
    } finally {
      setAddSaving(false);
    }
  }

  async function handleDelete(postId) {
    const prev = posts;
    setPosts((p) => p.filter((post) => post.id !== postId));
    try {
      await deleteScheduledPost(postId);
    } catch (err) {
      setPosts(prev);
      setError(err.message || "Failed to delete post.");
    }
  }

  async function handleGenerate() {
    setAiLoading(true);
    setAiError("");
    setSuggestions(null);
    try {
      const res = await generateSchedule({ scope: aiScope, startDate: selectedDate });
      setSuggestions(res.suggestions || []);
    } catch (err) {
      setAiError(err.message || "Failed to generate schedule.");
    } finally {
      setAiLoading(false);
    }
  }

  async function addSuggestion(suggestion, key) {
    setAddingSuggestionKey(key);
    try {
      const created = await createScheduledPost({
        date: suggestion.date,
        time: suggestion.time,
        content: suggestion.content,
        source: "ai",
      });
      setPosts((prev) => [...prev, created]);
      setSuggestions((prev) => prev.filter((_, i) => `${suggestion.date}-${i}` !== key));
    } catch (err) {
      setAiError(err.message || "Failed to add suggestion.");
    } finally {
      setAddingSuggestionKey(null);
    }
  }

  async function addAllSuggestions() {
    if (!suggestions || suggestions.length === 0) return;
    setAddingSuggestionKey("all");
    const created = [];
    const failed = [];
    for (const s of suggestions) {
      try {
        created.push(await createScheduledPost({ date: s.date, time: s.time, content: s.content, source: "ai" }));
      } catch {
        failed.push(s);
      }
    }
    setPosts((prev) => [...prev, ...created]);
    setSuggestions(failed.length ? failed : null);
    setAddingSuggestionKey(null);
    if (failed.length) setAiError(`${failed.length} post(s) failed to add — try again.`);
  }

  return (
    <div className="flex flex-col gap-5">
      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Month navigation + actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => goToMonth(-1)}
            aria-label="Previous month"
            className="glass flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h2 className="min-w-[10rem] text-center font-display text-lg font-bold">
            {MONTH_NAMES[month]} {year}
          </h2>
          <button
            onClick={() => goToMonth(1)}
            aria-label="Next month"
            className="glass flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/10"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <GhostButton
            onClick={() => { setShowAiPanel((v) => !v); setShowAddForm(false); }}
            className="px-4 py-2 text-xs"
          >
            <Sparkles className="h-3.5 w-3.5 text-orange-400" /> Ask AI
          </GhostButton>
          <PrimaryButton
            onClick={() => { setShowAddForm((v) => !v); setShowAiPanel(false); }}
            className="px-4 py-2 text-xs"
          >
            <Plus className="h-3.5 w-3.5" /> Add post
          </PrimaryButton>
        </div>
      </div>

      {/* Month grid */}
      <GlassCard className="p-4 sm:p-5">
        <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-medium uppercase tracking-widest text-white/35">
          {WEEKDAYS.map((d) => <div key={d} className="py-2">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {grid.map((date, i) => {
            if (!date) return <div key={`blank-${i}`} className="aspect-square" />;
            const iso = toISODate(date);
            const dayPosts = postsByDate[iso] || [];
            const isSelected = iso === selectedDate;
            const isToday = iso === toISODate(today);
            return (
              <button
                key={iso}
                onClick={() => selectDay(date)}
                className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl text-sm transition
                  ${isSelected ? "bg-accent-gradient text-ink font-semibold" : "hover:bg-white/8"}
                  ${!isSelected && isToday ? "ring-1 ring-orange-400/50" : ""}
                `}
              >
                <span>{date.getDate()}</span>
                {dayPosts.length > 0 && (
                  <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? "bg-ink" : "bg-orange-400"}`} />
                )}
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* AI generate panel */}
      {showAiPanel && (
        <GlassCard className="flex flex-col gap-4 p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-bold uppercase tracking-widest text-white/50">
              Generate with AI — starting {selectedDate}
            </h3>
            <button onClick={() => setShowAiPanel(false)} className="text-white/40 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[["day", "Day"], ["week", "Week"], ["month", "Rest of month"]].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setAiScope(value)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                  aiScope === value ? "bg-accent-gradient text-ink" : "glass text-white/70 hover:bg-white/10"
                }`}
              >
                {label}
              </button>
            ))}
            <PrimaryButton onClick={handleGenerate} disabled={aiLoading} className="ml-auto px-4 py-2 text-xs">
              {aiLoading ? "Generating…" : "Generate"}
            </PrimaryButton>
          </div>

          {aiError && <p className="text-sm text-red-400">{aiError}</p>}

          {suggestions && suggestions.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/40">{suggestions.length} suggested post(s)</span>
                <GhostButton
                  onClick={addAllSuggestions}
                  disabled={addingSuggestionKey === "all"}
                  className="px-3 py-1.5 text-xs"
                >
                  Add all
                </GhostButton>
              </div>
              {suggestions.map((s, i) => {
                const key = `${s.date}-${i}`;
                return (
                  <div key={key} className="flex items-start justify-between gap-3 rounded-2xl bg-white/5 p-4">
                    <div>
                      <div className="mb-1 text-xs font-medium text-orange-400">
                        {s.date} · {formatTime(s.time)}
                      </div>
                      <p className="text-sm text-white/70">{s.content}</p>
                    </div>
                    <button
                      onClick={() => addSuggestion(s, key)}
                      disabled={addingSuggestionKey === key || addingSuggestionKey === "all"}
                      className="glass shrink-0 rounded-full p-2 transition hover:bg-white/10"
                      aria-label="Add to calendar"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {suggestions && suggestions.length === 0 && (
            <p className="text-sm text-white/40">No suggestions generated — try again.</p>
          )}
        </GlassCard>
      )}

      {/* Add post form */}
      {showAddForm && (
        <GlassCard className="flex flex-col gap-4 p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-bold uppercase tracking-widest text-white/50">
              New post — {selectedDate}
            </h3>
            <button onClick={() => setShowAddForm(false)} className="text-white/40 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={handleAddPost} className="flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase tracking-widest text-white/35">Time</span>
              <input
                type="time"
                value={addTime}
                onChange={(e) => setAddTime(e.target.value)}
                className="glass-input w-40"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase tracking-widest text-white/35">Content idea</span>
              <textarea
                value={addContent}
                onChange={(e) => setAddContent(e.target.value)}
                placeholder="What are you posting?"
                rows={3}
                maxLength={500}
                className="glass-input resize-none"
                required
              />
            </label>
            <PrimaryButton type="submit" disabled={addSaving} className="self-start px-5 py-2.5 text-sm">
              {addSaving ? "Adding…" : "Add to calendar"}
            </PrimaryButton>
          </form>
        </GlassCard>
      )}

      {/* Selected day agenda */}
      <GlassCard className="flex flex-col gap-3 p-5">
        <h3 className="font-display text-sm font-bold uppercase tracking-widest text-white/50">
          {selectedDate}
        </h3>
        {loading ? (
          <p className="text-sm text-white/40">Loading…</p>
        ) : selectedPosts.length === 0 ? (
          <p className="text-sm text-white/40">Nothing scheduled yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {selectedPosts.map((post) => (
              <li
                key={post.id}
                className="flex items-start justify-between gap-3 rounded-2xl bg-white/5 p-4"
              >
                <div>
                  <div className="mb-1 text-xs font-medium text-orange-400">
                    {formatTime(post.scheduled_time)}
                    {post.source === "ai" && (
                      <span className="ml-2 rounded-full bg-orange-500/15 px-2 py-0.5 text-[10px] text-orange-300">AI</span>
                    )}
                  </div>
                  <p className="text-sm text-white/70">{post.content}</p>
                </div>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="glass shrink-0 rounded-full p-2 text-white/40 transition hover:bg-white/10 hover:text-red-400"
                  aria-label="Delete post"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>
    </div>
  );
}
