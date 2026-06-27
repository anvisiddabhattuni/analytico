import React from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Globe } from "lucide-react";
import { clearAuth, getUsername } from "../services/api";
import { ExpandableTabs } from "./ui/expandable-tabs";
import { AnalyticoBadge, AnalyticoWordmark } from "./ui/AnalyticoBadge";

const PLATFORMS = [
  { key: "instagram", title: "Instagram", icon: Camera, path: "/instagram-dash" },
  { key: "facebook", title: "Facebook", icon: Globe, path: "/facebook-dash" },
];

export default function Navbar({ active }) {
  const navigate = useNavigate();
  const username = getUsername();

  const handleLogout = () => {
    clearAuth();
    navigate("/login-analytics");
  };

  return (
    <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-5">
      <button
        onClick={() => navigate("/")}
        className="glass flex items-center gap-2 rounded-full py-1.5 pl-2 pr-4 transition hover:bg-white/10"
      >
        <AnalyticoBadge className="h-6 w-6" />
        <AnalyticoWordmark className="text-sm" />
      </button>

      <ExpandableTabs
        tabs={PLATFORMS}
        value={active}
        onChange={(tab) => navigate(tab.path)}
      />

      <div className="flex items-center gap-3">
        {username && <span className="hidden text-sm text-white/60 sm:block">{username}</span>}
        <button
          onClick={handleLogout}
          className="glass rounded-full px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
