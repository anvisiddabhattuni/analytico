import React, { useEffect, useState } from "react";
import { Target, Check } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import { PrimaryButton } from "../ui/Button";
import { getProfile, updateProfile } from "../../services/api";

export default function ObjectiveTab() {
  const [companyName, setCompanyName] = useState("");
  const [objective, setObjective] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getProfile()
      .then((profile) => {
        if (cancelled) return;
        setCompanyName(profile.company_name || "");
        setObjective(profile.objective || "");
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load your objective.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      await updateProfile(companyName.trim(), objective.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message || "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="relative flex h-10 w-10 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-white/8" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-orange-400 motion-reduce:animate-none" />
        </div>
      </div>
    );
  }

  return (
    <GlassCard className="mx-auto flex max-w-2xl flex-col gap-6 p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-500/15 ring-1 ring-orange-500/20">
          <Target aria-hidden="true" className="h-5 w-5 text-orange-400" />
        </span>
        <div>
          <h2 className="font-display text-lg font-bold">Your objective</h2>
          <p className="text-sm text-white/50">
            Tell Analytico what you're trying to achieve — GrowthBot and the AI calendar use this
            to tailor advice and content ideas.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-5">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-widest text-white/35">
            Company / brand name
          </span>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Brew & Co"
            maxLength={120}
            className="glass-input"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-widest text-white/35">
            What's your objective with Analytico?
          </span>
          <textarea
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            placeholder="e.g. Grow local awareness for our coffee shop and drive more foot traffic from social."
            rows={5}
            maxLength={1000}
            className="glass-input resize-none"
          />
        </label>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex items-center gap-3">
          <PrimaryButton type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save objective"}
          </PrimaryButton>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-400">
              <Check className="h-4 w-4" /> Saved
            </span>
          )}
        </div>
      </form>
    </GlassCard>
  );
}
