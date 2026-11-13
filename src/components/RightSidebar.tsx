"use client";

import Link from "next/link";
import { Icon } from "./icons";

interface RightSidebarProps {
  user: {
    name: string;
    avatarUrl: string;
    department: string;
    year: string;
  };
}

const topics = [
  "Computer Science",
  "Biology",
  "Business",
  "Music",
  "Art & Design",
  "Psychology",
  "Engineering",
  "Sports",
];

export default function RightSidebar({ user }: RightSidebarProps) {
  return (
    <div className="flex flex-col gap-4 py-6">
      {/* Search */}
      <Link
        href="/explore"
        className="flex min-h-11 items-center gap-2.5 rounded-full bg-muted px-4 text-sm text-ink-mute transition-colors duration-200 hover:bg-line"
        aria-label="Search people"
      >
        <Icon name="search" className="h-4 w-4" />
        Search people
      </Link>

      {/* Your corner */}
      <section className="card p-5">
        <h2 className="mb-3 text-xs font-semibold tracking-wide text-ink-mute uppercase">
          Your corner
        </h2>
        <p className="text-sm font-semibold text-ink">{user.name}</p>
        <p className="mt-0.5 text-xs text-ink-mute">
          {[user.department, user.year].filter(Boolean).join(" · ") ||
            "Kingsborough Community College"}
        </p>
        <Link
          href="/profile"
          className="btn btn-secondary mt-4 w-full"
          aria-label="Open my profile"
        >
          View profile
        </Link>
      </section>

      {/* Topics */}
      <section className="card p-5">
        <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-wide text-ink-mute uppercase">
          <Icon name="trending" className="h-4 w-4" />
          Trending on campus
        </h2>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <Link
              key={topic}
              href={`/explore?q=${encodeURIComponent(topic)}`}
              className="chip bg-muted text-ink-soft hover:bg-accent-soft hover:text-accent"
            >
              <Icon name="hash" className="h-3.5 w-3.5" />
              {topic}
            </Link>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="card p-5">
        <h2 className="mb-2 text-xs font-semibold tracking-wide text-ink-mute uppercase">
          About KCC Chat
        </h2>
        <p className="text-xs leading-relaxed text-ink-soft">
          A quiet place for Kingsborough students to share campus life, find
          classmates and keep the conversation going.
        </p>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-mute">
          <Link href="/explore" className="hover:text-ink">
            Explore
          </Link>
          <Link href="/settings" className="hover:text-ink">
            Settings
          </Link>
          <Link href="/feed" className="hover:text-ink">
            Feed
          </Link>
        </div>
      </section>

      <p className="px-1 text-2xs text-ink-mute">
        © {new Date().getFullYear()} KCC Chat · Kingsborough Community College
      </p>
    </div>
  );
}
