import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register, resendVerification } from "../services/api";
import Background from "../components/ui/Background";
import GlassCard from "../components/ui/GlassCard";
import { PrimaryButton, GhostButton } from "../components/ui/Button";
import { AnalyticoBadge, AnalyticoWordmark } from "../components/ui/AnalyticoBadge";
import { Mail, CheckCircle } from "lucide-react";

function CreateAccountPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      await register(email.trim(), password);
      setSent(true);
    } catch (err) {
      setError(err.message || "Could not create account.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendMsg("");
    setResendLoading(true);
    try {
      await resendVerification(email.trim());
      setResendMsg("Link resent — check your inbox.");
    } catch {
      setResendMsg("Could not resend. Try again shortly.");
    } finally {
      setResendLoading(false);
    }
  };

  if (sent) {
    return (
      <Background className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
        <GlassCard className="w-full max-w-md p-8 sm:p-10">
          <div className="flex flex-col items-center gap-5 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 ring-1 ring-orange-500/20">
              <Mail className="h-7 w-7 text-orange-400" />
            </span>
            <div>
              <h2 className="font-display text-2xl font-bold">Check your email</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/55">
                We sent a verification link to{" "}
                <span className="font-medium text-white/80">{email}</span>.
                Click it to activate your account.
              </p>
            </div>

            <div className="w-full rounded-2xl bg-white/5 px-5 py-4 text-left text-sm text-white/50 leading-relaxed">
              Didn't get it? Check your spam folder, or{" "}
              <button
                onClick={handleResend}
                disabled={resendLoading}
                className="font-medium text-orange-400 transition hover:text-orange-300 disabled:opacity-50"
              >
                {resendLoading ? "Sending..." : "resend the link"}
              </button>
              .
              {resendMsg && (
                <p className="mt-2 flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle className="h-3.5 w-3.5" />
                  {resendMsg}
                </p>
              )}
            </div>

            <GhostButton onClick={() => navigate("/login-analytics")} className="w-full">
              Go to log in
            </GhostButton>
          </div>
        </GlassCard>
      </Background>
    );
  }

  return (
    <Background className="flex min-h-screen items-center justify-center px-6 py-12">
      <GlassCard className="w-full max-w-md p-8 sm:p-10">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <AnalyticoBadge className="h-7 w-7" />
            <AnalyticoWordmark className="text-2xl" />
          </div>
          <h2 className="font-display text-2xl font-semibold">Create your account</h2>
          <p className="text-sm text-white/50">Start tracking your Meta analytics.</p>
        </div>

        <form onSubmit={handleCreateAccount} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="glass-input"
          />
          <input
            type="password"
            placeholder="Password (min. 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="glass-input"
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <PrimaryButton type="submit" disabled={loading} className="mt-2 w-full">
            {loading ? "Creating account..." : "Create account"}
          </PrimaryButton>
        </form>

        <p className="mt-6 text-center text-sm text-white/50">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login-analytics")}
            className="font-semibold text-orange-400 transition hover:text-orange-300"
          >
            Log in
          </button>
        </p>
      </GlassCard>
    </Background>
  );
}

export default CreateAccountPage;
