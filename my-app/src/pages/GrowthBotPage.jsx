import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getRecommendations, isAuthenticated } from "../services/api";
import Background from "../components/ui/Background";
import GlassCard from "../components/ui/GlassCard";
import { PrimaryButton, GhostButton } from "../components/ui/Button";

const PLATFORM_LABELS = {
  facebook: "Facebook",
};

const PLATFORM_DASH_PATHS = {
  facebook: "/facebook-dash",
};

const SUGGESTED_PROMPTS = [
  "How can I improve my engagement rate?",
  "What should I post next?",
  "What's my best time to post?",
  "Why did my reach drop this week?",
];

export default function GrowthBotPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const platform = location.state?.platform || "facebook";

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e, questionOverride) => {
    e.preventDefault();
    const question = (questionOverride ?? input).trim();
    if (!question) return;

    if (!isAuthenticated()) {
      navigate("/login-analytics");
      return;
    }

    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setInput("");
    setTyping(true);
    setError("");

    try {
      const data = await getRecommendations(platform, question);
      const recs = Array.isArray(data.recommendations)
        ? data.recommendations
        : [String(data.recommendations ?? "No recommendations available right now.")];
      setMessages((prev) => [...prev, { role: "bot", content: recs }]);
    } catch (err) {
      if (err.status === 401) {
        navigate("/login-analytics");
      } else {
        setError(err.message || "Could not get recommendations.");
      }
    } finally {
      setTyping(false);
    }
  };

  return (
    <Background className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-6">
        <GhostButton onClick={() => navigate(PLATFORM_DASH_PATHS[platform] || "/facebook-dash")}>
          &larr; Back
        </GhostButton>
        <div className="flex items-center gap-2">
          <h1 className="font-display text-lg font-semibold">GrowthBot</h1>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs uppercase tracking-wide text-white/50">
            {PLATFORM_LABELS[platform] || platform}
          </span>
        </div>
        <div className="w-[88px]" />
      </header>

      <div className="mx-auto flex w-full max-w-3xl min-h-[calc(100vh-14rem)] flex-col gap-4 px-6 pb-44">
        {messages.length === 0 && !typing && (
          <div className="flex flex-1 flex-col items-center justify-center gap-6">
            <GlassCard className="flex w-full flex-col gap-2 p-6 text-center">
              <h2 className="font-display text-xl font-semibold">Ask GrowthBot anything</h2>
              <p className="text-sm text-white/60">
                Get growth advice grounded in your actual Facebook Page analytics.
              </p>
            </GlassCard>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={(e) => handleSubmit(e, prompt)}
                  className="glass rounded-full px-4 py-2 text-xs font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) =>
          message.role === "user" ? (
            <div
              key={index}
              className="ml-auto max-w-md rounded-3xl bg-accent-gradient px-5 py-3 text-sm font-medium text-ink"
            >
              {message.content}
            </div>
          ) : (
            <GlassCard key={index} className="max-w-md p-5">
              <h3 className="mb-2 font-display text-sm font-semibold text-white/70">
                GrowthBot suggests
              </h3>
              <ul className="flex flex-col gap-2 text-sm">
                {message.content.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-0.5 text-orange-400">●</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          )
        )}

        {typing && (
          <GlassCard aria-live="polite" className="max-w-xs p-4 text-sm italic text-white/50">
            GrowthBot is thinking…
          </GlassCard>
        )}

        {error && (
          <div role="alert" className="max-w-md rounded-3xl border border-red-400/30 bg-red-500/10 px-5 py-3 text-sm text-red-300">
            {error}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="fixed bottom-0 left-0 right-0 px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-4">
        <div className="glass mx-auto flex max-w-3xl items-center gap-3 rounded-full p-2 pl-6 shadow-glow transition-shadow focus-within:ring-2 focus-within:ring-orange-400/60">
          <input
            type="text"
            name="question"
            aria-label="Ask GrowthBot a question"
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask GrowthBot a question…"
            className="flex-1 bg-transparent text-sm text-white placeholder-white/40 outline-none focus-visible:ring-0"
          />
          <PrimaryButton type="submit" className="px-5 py-2.5">
            Send
          </PrimaryButton>
        </div>
      </form>
    </Background>
  );
}
