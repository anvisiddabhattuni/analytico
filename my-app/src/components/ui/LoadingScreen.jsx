import React from "react";
import { AnalyticoBadge, AnalyticoWordmark } from "./AnalyticoBadge";
import Background from "./Background";

export default function LoadingScreen({ message = "Loading..." }) {
  return (
    <Background className="flex min-h-screen flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-5">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-white/8" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-orange-400" />
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
            <AnalyticoBadge className="h-7 w-7" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AnalyticoBadge className="h-5 w-5" />
          <AnalyticoWordmark className="text-base" />
        </div>
      </div>

      <p className="text-sm text-white/40">{message}</p>
    </Background>
  );
}
