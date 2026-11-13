"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import Toast from "@/components/Toast";
import { Icon } from "@/components/icons";
import { apiFetch, getAuthToken, setAuthToken } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If we already have a token (e.g. after registration or a refresh), verify
  // it and skip straight to the dashboard instead of forcing a re-login.
  useEffect(() => {
    if (!getAuthToken()) return;
    let cancelled = false;
    apiFetch("/api/auth/me")
      .then((res) => {
        if (res.ok && !cancelled) window.location.assign("/feed");
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = async (emailToUse: string, passwordToUse: string) => {
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: emailToUse.trim().toLowerCase(),
          password: passwordToUse,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        if (data.token) setAuthToken(data.token);
        window.location.assign("/feed");
        return;
      }
      setError(data.error || "Login failed. Please check your credentials.");
    } catch {
      setError("Could not reach KCC Chat. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };

  const handleDemoLogin = async () => {
    const demoEmail = "alex@kcc.edu";
    const demoPassword = "password123";
    setEmail(demoEmail);
    setPassword(demoPassword);
    await signIn(demoEmail, demoPassword);
  };

  return (
    <AuthShell>
      <div className="card p-6 sm:p-8">
        <h1 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-ink-mute">
          Sign in to KCC Chat to continue.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <Toast tone="danger" title={error} />
          )}

          <div>
            <label htmlFor="login-email" className="label">
              Email
            </label>
            <div className="auth-input-wrap">
              <Icon name="mail" className="h-4 w-4 shrink-0 text-ink-mute" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@kcc.edu"
                required
                autoComplete="email"
                className="input"
              />
            </div>
          </div>

          <div>
            <label htmlFor="login-password" className="label">
              Password
            </label>
            <div className="auth-input-wrap">
              <Icon name="lock" className="h-4 w-4 shrink-0 text-ink-mute" />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="input"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="shrink-0 text-ink-mute transition-colors duration-200 hover:text-ink"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <Icon name={showPassword ? "eyeOff" : "eye"} className="h-4 w-4" />
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Demo access */}
        <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl bg-accent-soft px-4 py-3">
          <div className="flex items-start gap-2.5">
            <Icon name="sparkles" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <div>
              <p className="text-xs font-semibold text-accent">
                Explore the demo
              </p>
              <p className="mt-0.5 text-xs text-ink-soft">
                Sign in as Alex to see the live KCC community.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="btn btn-secondary shrink-0 px-4 py-2 text-xs"
          >
            Use demo
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-ink-mute">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-accent hover:text-accent-strong"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
