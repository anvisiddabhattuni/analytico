import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, setAuth } from "../services/api";
import Background from "../components/ui/Background";
import GlassCard from "../components/ui/GlassCard";
import { PrimaryButton } from "../components/ui/Button";
import { AnalyticoBadge, AnalyticoWordmark } from "../components/ui/AnalyticoBadge";

function LoginAnalyticsPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginClick = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      const data = await login(email.trim(), password);
      setAuth(data.access_token, data.username);
      navigate("/login");
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpClick = () => {
    navigate("/create-account");
  };

  return (
    <Background className="flex items-center justify-center px-6 py-12">
      <GlassCard className="w-full max-w-md p-8 sm:p-10">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <AnalyticoBadge className="h-7 w-7" />
            <AnalyticoWordmark className="text-2xl" />
          </div>
          <h1 className="font-display text-2xl font-semibold">Welcome back</h1>
          <p className="text-sm text-white/50">Log in to see your latest growth stats.</p>
        </div>

        <form onSubmit={handleLoginClick} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            aria-label="Email"
            autoComplete="email"
            spellCheck={false}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="glass-input"
          />

          <input
            type="password"
            name="current-password"
            aria-label="Password"
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="glass-input"
          />

          {error && <p role="alert" className="text-sm text-red-400">{error}</p>}

          <PrimaryButton type="submit" disabled={loading} className="mt-2 w-full">
            {loading ? "Logging in…" : "Log In"}
          </PrimaryButton>
        </form>

        <p className="mt-6 text-center text-sm text-white/50">
          Don&apos;t have an account?{" "}
          <button
            onClick={handleSignUpClick}
            className="font-semibold text-orange-400 transition-colors hover:text-orange-300"
          >
            Sign up
          </button>
        </p>
      </GlassCard>
    </Background>
  );
}

export default LoginAnalyticsPage;
