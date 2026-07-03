import React from "react";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-ink";

export function PrimaryButton({ children, className = "", ...props }) {
  return (
    <button
      className={`inline-flex touch-manipulation items-center justify-center gap-2 rounded-full bg-accent-gradient px-6 py-3 text-sm font-semibold text-ink shadow-glow-sm transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none ${FOCUS_RING} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, className = "", ...props }) {
  return (
    <button
      className={`glass inline-flex touch-manipulation items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none ${FOCUS_RING} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
