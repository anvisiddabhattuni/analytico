import React from "react";
import { useNavigate } from "react-router-dom";
import Background from "./ui/Background";
import GlassCard from "./ui/GlassCard";
import { GhostButton } from "./ui/Button";
import { AnalyticoBadge, AnalyticoWordmark } from "./ui/AnalyticoBadge";

export default function LegalPageLayout({ title, updated, children }) {
  const navigate = useNavigate();

  return (
    <Background className="min-h-screen px-6 py-12">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="glass flex items-center gap-2 rounded-full py-1.5 pl-2 pr-4 transition hover:bg-white/10"
          >
            <AnalyticoBadge className="h-6 w-6" />
            <AnalyticoWordmark className="text-sm" />
          </button>
          <GhostButton onClick={() => navigate(-1)} className="px-4 py-2 text-xs">
            Back
          </GhostButton>
        </div>

        <GlassCard className="flex flex-col gap-6 p-8 sm:p-10">
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">{title}</h1>
            <p className="mt-1 text-xs text-white/40">Last updated {updated}</p>
          </div>

          <div className="flex flex-col gap-6 text-sm leading-relaxed text-white/65">
            {children}
          </div>
        </GlassCard>
      </div>
    </Background>
  );
}

export function Section({ title, children }) {
  return (
    <section className="flex flex-col gap-2">
      {title && (
        <h2 className="font-display text-base font-bold text-white/90">{title}</h2>
      )}
      {children}
    </section>
  );
}

export function Bullets({ items }) {
  return (
    <ul className="flex flex-col gap-1.5 pl-5">
      {items.map((item, i) => (
        <li key={i} className="list-disc marker:text-orange-400/60">
          {item}
        </li>
      ))}
    </ul>
  );
}
