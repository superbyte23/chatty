"use client";

import { useState } from "react";
import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import Toast from "@/components/Toast";
import { Icon } from "@/components/icons";
import { apiFetch, setAuthToken } from "@/lib/api";

const departments = [
  "Computer Science",
  "Biology",
  "Business Administration",
  "Mathematics",
  "Music",
  "English",
  "Art & Design",
  "Psychology",
  "Engineering",
  "Chemistry",
  "Physics",
  "History",
  "Nursing",
  "Communications",
];

const years = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"];

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    year: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          department: form.department,
          year: form.year,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        if (data.token) setAuthToken(data.token);
        window.location.assign("/feed");
        return;
      }

      if (typeof data.error === "string") {
        setError(data.error);
      } else {
        setError("Registration failed. Please check your inputs.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <AuthShell>
      <div className="card p-6 sm:p-8">
        <h1 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          Join KCC Chat
        </h1>
        <p className="mt-1 text-sm text-ink-mute">
          Create your student account in under a minute.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && <Toast tone="danger" title={error} />}

          <div>
            <label htmlFor="reg-name" className="label">
              Full Name
            </label>
            <input
              id="reg-name"
              type="text"
              value={form.name}
              onChange={(e) => updateForm("name", e.target.value)}
              placeholder="Alex Johnson"
              required
              autoComplete="name"
              className="input"
            />
          </div>

          <div>
            <label htmlFor="reg-email" className="label">
              Email
            </label>
            <input
              id="reg-email"
              type="email"
              value={form.email}
              onChange={(e) => updateForm("email", e.target.value)}
              placeholder="you@kcc.edu"
              required
              autoComplete="email"
              className="input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="reg-department" className="label">
                Department
              </label>
              <div className="relative">
                <select
                  id="reg-department"
                  value={form.department}
                  onChange={(e) => updateForm("department", e.target.value)}
                  className="input appearance-none pr-9"
                >
                  <option value="">Select...</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <Icon
                  name="chevronDown"
                  className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-ink-mute"
                />
              </div>
            </div>
            <div>
              <label htmlFor="reg-year" className="label">
                Year
              </label>
              <div className="relative">
                <select
                  id="reg-year"
                  value={form.year}
                  onChange={(e) => updateForm("year", e.target.value)}
                  className="input appearance-none pr-9"
                >
                  <option value="">Select...</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <Icon
                  name="chevronDown"
                  className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-ink-mute"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="reg-password" className="label">
              Password
            </label>
            <input
              id="reg-password"
              type="password"
              value={form.password}
              onChange={(e) => updateForm("password", e.target.value)}
              placeholder="At least 6 characters"
              required
              minLength={6}
              autoComplete="new-password"
              className="input"
            />
          </div>

          <div>
            <label htmlFor="reg-confirm" className="label">
              Confirm Password
            </label>
            <input
              id="reg-confirm"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => updateForm("confirmPassword", e.target.value)}
              placeholder="Repeat password"
              required
              autoComplete="new-password"
              className="input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary mt-2 w-full"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-mute">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-accent hover:text-accent-strong"
          >
            Sign In
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
