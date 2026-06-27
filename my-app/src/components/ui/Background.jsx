import React from "react";
import { BackgroundPathsLayer } from "./background-paths";

export default function Background({ children, className = "" }) {
  return (
    <div className={`relative min-h-screen w-full bg-ink ${className}`}>
      <div className="pointer-events-none fixed inset-0 bg-glow-orange" />
      <BackgroundPathsLayer />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
