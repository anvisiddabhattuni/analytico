import React from "react";
import { useNavigate } from "react-router-dom";
import { Globe } from "lucide-react";
import { clearAuth, getUsername, isGuest } from "../services/api";
import { AnalyticoBadge, AnalyticoWordmark } from "./ui/AnalyticoBadge";

export default function Navbar() {
  const navigate = useNavigate();
  const guest = isGuest();
  const username = guest ? "Guest" : getUsername();

  return (
    <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-5">
      <button
        onClick={() => navigate("/")}
        className="glass flex items-center gap-2 rounded-full py-1.5 pl-2 pr-4 transition hover:bg-white/10"
      >
        <AnalyticoBadge className="h-6 w-6" />
        <AnalyticoWordmark className="text-sm" />
      </button>

      <div className="glass flex items-center gap-2 rounded-full px-4 py-2">
        <Globe className="h-4 w-4 text-blue-400" />
        <span className="text-sm font-medium">Facebook</span>
      </div>

      <div className="flex items-center gap-3">
        {username && <span className="hidden text-sm text-white/60 sm:block">{username}</span>}
        <button
          onClick={() => { clearAuth(); navigate(guest ? "/" : "/login-analytics"); }}
          className="glass rounded-full px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
        >
          {guest ? "Exit demo" : "Log out"}
        </button>
      </div>
    </header>
  );
}
