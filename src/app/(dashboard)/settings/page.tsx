"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import Toast from "@/components/Toast";
import { Icon } from "@/components/icons";
import { apiFetch, clearAuthToken } from "@/lib/api";
import PageLayout from "@/components/PageLayout";

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

export default function SettingsPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    bio: "",
    department: "",
    year: "",
  });
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiFetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        setUserId(data.id);
        setForm({
          name: data.name || "",
          bio: data.bio || "",
          department: data.department || "",
          year: data.year || "",
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      const res = await apiFetch(`/api/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    clearAuthToken();
    window.location.assign("/login");
  };

  if (loading)
    return (
      <div className="space-y-4">
        <div className="skeleton h-80 w-full rounded-2xl" />
        <div className="skeleton h-40 w-full rounded-2xl" />
      </div>
    );

  return (
    <PageLayout constrained={false}>
      {/* Profile form */}
      <section>
        <form onSubmit={handleSubmit} className="card space-y-5 p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-ink">
              Profile
            </h2>
            <p className="mt-1 text-sm text-ink-mute">
              Update your public profile information.
            </p>
          </div>

          {saved && (
            <Toast
              tone="success"
              title="Profile updated successfully"
              description="Your changes are live for the whole campus."
            />
          )}

          <div>
            <label htmlFor="set-name" className="label">
              Full Name
            </label>
            <input
              id="set-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="set-bio" className="label">
              Bio
            </label>
            <textarea
              id="set-bio"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              rows={3}
              className="input-area resize-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="set-department" className="label">
                Department
              </label>
              <div className="relative">
                <select
                  id="set-department"
                  value={form.department}
                  onChange={(e) =>
                    setForm({ ...form, department: e.target.value })
                  }
                  className="input appearance-none pr-10"
                >
                  <option value="">Select department...</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <Icon
                  name="chevronDown"
                  className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-ink-mute"
                />
              </div>
            </div>
            <div>
              <label htmlFor="set-year" className="label">
                Year
              </label>
              <div className="relative">
                <select
                  id="set-year"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  className="input appearance-none pr-10"
                >
                  <option value="">Select year...</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <Icon
                  name="chevronDown"
                  className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-ink-mute"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary px-6"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </section>

      {/* Appearance */}
      <section>
        <div className="card p-5 sm:p-6">
          <h2 className="text-lg font-semibold tracking-tight text-ink">
            Appearance
          </h2>
          <p className="mt-1 mb-4 text-sm text-ink-mute">
            Choose how KCC Chat looks on this device.
          </p>
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-muted px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-elevated text-ink-soft">
                <Icon name="sun" className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">Dark mode</p>
                <p className="text-xs text-ink-mute">
                  Follows your system by default.
                </p>
              </div>
            </div>
            <ThemeToggle label="Toggle dark mode" />
          </div>
        </div>
      </section>

      {/* Account section */}
      <section>
        <div className="card p-5 sm:p-6">
          <h2 className="mb-4 text-lg font-semibold tracking-tight text-ink">
            Account
          </h2>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl bg-danger-soft px-4 py-3.5 text-left text-sm font-semibold text-danger transition-colors duration-200 hover:bg-danger hover:text-on-danger"
          >
            <Icon name="logout" className="h-4 w-4" />
            Sign out of your account
          </button>
        </div>
      </section>
    </PageLayout>
  );
}
