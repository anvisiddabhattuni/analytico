import React from "react";
import GlassCard from "./GlassCard";

export default function StatTile({ label, value }) {
  return (
    <GlassCard className="flex flex-col items-center justify-center gap-1 px-6 py-5 text-center">
      <span className="bg-accent-gradient bg-clip-text font-display text-2xl font-semibold text-transparent">
        {value}
      </span>
      <span className="text-xs uppercase tracking-wide text-white/50">{label}</span>
    </GlassCard>
  );
}
