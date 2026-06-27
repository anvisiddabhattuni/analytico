import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, setAuth, resendVerification } from "../services/api";
import Background from "../components/ui/Background";
import GlassCard from "../components/ui/GlassCard";
import { PrimaryButton } from "../components/ui/Button";
import { AnalyticoBadge, AnalyticoWordmark } from "../components/ui/AnalyticoBadge";

function LoginAnalyticsPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [unverified, setUnverified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  const handleLoginClick = async (e) => {
    e.preventDefault();
    setError("");
    setUnverified(false);
    setResendMsg("");

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
      if (err.status === 403) {
        setUnverified(true);
      } else {
        setError(err.message || "Invalid email or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendMsg("");
    try {
      await resendVerification(email.trim());
      setResendMsg("Verification link resent — check your inbox.");
    } catch {
      setResendMsg("Could not resend. Try again shortly.");
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
          <h2 className="font-display text-2xl font-semibold">Welcome back</h2>
          <p className="text-sm text-white/50">Log in to see your latest growth stats.</p>
        </div>

        <form onSubmit={handleLoginClick} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="glass-input"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="glass-input"
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          {unverified && (
            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 px-4 py-3 text-sm">
              <p className="text-orange-300">Please verify your email before logging in.</p>
              <button
                type="button"
                onClick={handleResend}
                className="mt-1 font-medium text-orange-400 underline underline-offset-2 transition hover:text-orange-300"
              >
                Resend verification link
              </button>
              {resendMsg && <p className="mt-1 text-emerald-400">{resendMsg}</p>}
            </div>
          )}

          <PrimaryButton type="submit" disabled={loading} className="mt-2 w-full">
            {loading ? "Logging in..." : "Log in"}
          </PrimaryButton>
        </form>

        <p className="mt-6 text-center text-sm text-white/50">
          Don&apos;t have an account?{" "}
          <button
            onClick={handleSignUpClick}
            className="font-semibold text-orange-400 transition hover:text-orange-300"
          >
            Sign up
          </button>
        </p>
      </GlassCard>
    </Background>
  );
}

export default LoginAnalyticsPage;
