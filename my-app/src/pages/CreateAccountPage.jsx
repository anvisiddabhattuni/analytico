import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register, login, setAuth } from "../services/api";
import Background from "../components/ui/Background";
import GlassCard from "../components/ui/GlassCard";
import { PrimaryButton } from "../components/ui/Button";
import { AnalyticoBadge, AnalyticoWordmark } from "../components/ui/AnalyticoBadge";

function CreateAccountPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      const data = await login(email.trim(), password);
      setAuth(data.access_token, data.username);
      navigate("/login");
    } catch (err) {
      setError(err.message || "Could not create account.");
      setLoading(false);
    }
  };

  return (
    <Background className="flex min-h-screen items-center justify-center px-6 py-12">
      <GlassCard className="w-full max-w-md p-8 sm:p-10">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <AnalyticoBadge className="h-7 w-7" />
            <AnalyticoWordmark className="text-2xl" />
          </div>
          <h1 className="font-display text-2xl font-semibold">Create your account</h1>
          <p className="text-sm text-white/50">Start tracking your Meta analytics.</p>
        </div>

        <form onSubmit={handleCreateAccount} className="flex flex-col gap-4">
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
            name="new-password"
            aria-label="Password"
            autoComplete="new-password"
            placeholder="Password (min. 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="glass-input"
          />

          {error && <p role="alert" className="text-sm text-red-400">{error}</p>}

          <PrimaryButton type="submit" disabled={loading} className="mt-2 w-full">
            {loading ? "Creating account…" : "Create Account"}
          </PrimaryButton>
        </form>

        <p className="mt-6 text-center text-sm text-white/50">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login-analytics")}
            className="font-semibold text-orange-400 transition-colors hover:text-orange-300"
          >
            Log in
          </button>
        </p>
      </GlassCard>
    </Background>
  );
}

export default CreateAccountPage;
