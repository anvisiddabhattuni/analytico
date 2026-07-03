import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../services/api";
import Background from "../components/ui/Background";
import GlassCard from "../components/ui/GlassCard";
import { PrimaryButton } from "../components/ui/Button";
import { AnalyticoBadge, AnalyticoWordmark } from "../components/ui/AnalyticoBadge";
import { CheckCircle, XCircle } from "lucide-react";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    if (!token) {
      setStatus("error");
      setMessage("No verification token found. Please use the link from your email.");
      return;
    }

    verifyEmail(token)
      .then(() => setStatus("success"))
      .catch((err) => {
        setStatus("error");
        setMessage(err.message || "This link is invalid or has expired.");
      });
  }, [token]);

  return (
    <Background className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <GlassCard className="w-full max-w-md p-8 sm:p-10">
        <div className="mb-6 flex justify-center">
          <div className="flex items-center gap-2">
            <AnalyticoBadge className="h-6 w-6" />
            <AnalyticoWordmark className="text-sm" />
          </div>
        </div>

        {status === "loading" && (
          <div role="status" aria-live="polite" className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="flex space-x-2">
              {[0, 150, 300].map((delay) => (
                <div
                  key={delay}
                  className="h-2.5 w-2.5 animate-bounce rounded-full bg-orange-400"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
            <p className="text-sm text-white/50">Verifying your email…</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-5 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
              <CheckCircle className="h-7 w-7 text-emerald-400" />
            </span>
            <div>
              <h1 className="font-display text-2xl font-bold">You're verified!</h1>
              <p className="mt-2 text-sm text-white/55">
                Your email is confirmed. You can now log in and start tracking your growth.
              </p>
            </div>
            <PrimaryButton onClick={() => navigate("/login-analytics")} className="w-full">
              Go to log in
            </PrimaryButton>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-5 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 ring-1 ring-red-500/20">
              <XCircle className="h-7 w-7 text-red-400" />
            </span>
            <div>
              <h1 className="font-display text-2xl font-bold">Link expired</h1>
              <p className="mt-2 text-sm text-white/55">
                {message || "This verification link is invalid or has expired."}
              </p>
            </div>
            <PrimaryButton onClick={() => navigate("/create-account")} className="w-full">
              Sign up again
            </PrimaryButton>
          </div>
        )}
      </GlassCard>
    </Background>
  );
}
