import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAnalytics, isAuthenticated } from "../services/api";

const PLATFORM_CONFIG = {
  instagram: {
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png",
    logoClass: "w-36 h-36 rounded-full",
  },
  tiktok: {
    logo: "https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg",
    logoClass: "w-36 h-36 rounded-full bg-white p-4",
  },
  x: {
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/91/X_logo_2023.svg",
    logoClass: "w-36 h-36 rounded-full bg-white p-4",
  },
};

export default function PlatformDashboard({ platform }) {
  const navigate = useNavigate();
  const config = PLATFORM_CONFIG[platform];
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login-analytics");
      return;
    }

    let cancelled = false;

    async function loadAnalytics() {
      try {
        const analytics = await getAnalytics(platform);
        if (!cancelled) {
          setData(analytics);
        }
      } catch (err) {
        if (!cancelled) {
          if (err.status === 401) {
            navigate("/login-analytics");
          } else {
            setError(err.message || "Failed to load analytics");
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAnalytics();

    return () => {
      cancelled = true;
    };
  }, [navigate, platform]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a1437]">
        <div className="flex space-x-4">
          <div className="w-4 h-4 bg-orange-400 rounded-full animate-bounce" />
          <div className="w-4 h-4 bg-orange-300 rounded-full animate-bounce delay-150" />
          <div className="w-4 h-4 bg-orange-200 rounded-full animate-bounce delay-300" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0e1c3f] text-white flex flex-col items-center justify-center gap-4">
        <p>{error}</p>
        <button
          onClick={() => navigate("/login")}
          className="bg-[#f97316] text-black font-semibold px-6 py-3 rounded-xl"
        >
          Back to Login
        </button>
      </div>
    );
  }

  const stats = Object.entries(data.stats || {});

  return (
    <div className="min-h-screen bg-[#0e1c3f] text-white px-10 py-12 flex flex-col items-center gap-10">
      <div className="flex flex-col items-center gap-4">
        <img src={config.logo} alt={`${platform} logo`} className={config.logoClass} />
        <h1 className="text-xl font-bold">{data.username}</h1>
        {data.data_source && (
          <span className="text-xs uppercase tracking-wide bg-white/10 px-3 py-1 rounded-full">
            {data.data_source === "live" ? "Live data" : "Demo data"}
          </span>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {stats.map(([label, value]) => (
          <div
            key={label}
            className="bg-[#f4a100] w-40 h-20 rounded-xl flex flex-col items-center justify-center text-center"
          >
            <h2 className="text-xl font-bold text-black">{value}</h2>
            <p className="text-sm text-black">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
        {(data.sections || []).map((section) => (
          <div
            key={section.title}
            className="bg-white text-black p-6 rounded-2xl shadow-md min-h-[250px]"
          >
            <h3 className="text-xl font-bold mb-3">{section.title}</h3>
            <ul className="space-y-2">
              {(section.items || []).map((item) => (
                <li key={item.label} className="flex justify-between gap-4">
                  <span>{item.label}</span>
                  <span className="font-semibold">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/login")}
          className="bg-[#f97316] text-black font-semibold px-6 py-3 rounded-xl text-lg hover:bg-orange-400 transition"
        >
          Back to Login
        </button>
        <button
          onClick={() => navigate("/growth-bot", { state: { platform } })}
          className="bg-[#0ea5e9] text-white font-semibold px-6 py-3 rounded-xl text-lg hover:bg-blue-500 transition"
        >
          Ask Growth Bot
        </button>
      </div>
    </div>
  );
}
