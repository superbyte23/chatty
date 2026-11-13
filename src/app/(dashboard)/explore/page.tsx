"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Avatar from "@/components/Avatar";
import EmptyState from "@/components/EmptyState";
import { SkeletonUserCard } from "@/components/Skeleton";
import { Icon } from "@/components/icons";
import { apiFetch } from "@/lib/api";
import PageLayout from "@/components/PageLayout";

interface ExploreUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  department: string | null;
  year: string | null;
  bio: string | null;
  isOnline: boolean | null;
  postCount: number;
  followerCount: number;
  isFollowing: boolean;
}

const topics = [
  "Computer Science",
  "Biology",
  "Business Administration",
  "Music",
  "Art & Design",
  "Psychology",
  "Engineering",
  "Nursing",
];

export default function ExplorePage() {
  const router = useRouter();
  const [users, setUsers] = useState<ExploreUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const fetchUsers = async (search?: string) => {
    try {
      const url = search
        ? `/api/users?q=${encodeURIComponent(search)}`
        : "/api/users";
      const res = await apiFetch(url);
      if (res.ok) setUsers(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Seed the search field from the URL so topic chips can deep-link into it.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initial = params.get("q");
    if (!initial) {
      fetchUsers();
      return;
    }
    const frame = requestAnimationFrame(() => setQuery(initial));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(query || undefined);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleFollow = async (userId: string) => {
    try {
      const res = await apiFetch("/api/follow", {
        method: "POST",
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        const data = await res.json();
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId
              ? {
                  ...u,
                  isFollowing: data.following,
                  followerCount: data.following
                    ? u.followerCount + 1
                    : u.followerCount - 1,
                }
              : u
          )
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <PageLayout constrained={false}>
      {/* Search section */}
      <section className="space-y-4">
        <div className="relative">
          <Icon
            name="search"
            className="pointer-events-none absolute top-1/2 left-4 h-[18px] w-[18px] -translate-y-1/2 text-ink-mute"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, department, or email..."
            aria-label="Search people"
            className="input min-h-12 pl-11"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-ink-mute transition-colors duration-200 hover:bg-line hover:text-ink"
            >
              <Icon name="x" className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Topic chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {topics.map((topic) => {
            const active = query === topic;
            return (
              <button
                key={topic}
                type="button"
                onClick={() => setQuery(active ? "" : topic)}
                className={`chip shrink-0 ${
                  active
                    ? "bg-accent text-on-accent"
                    : "bg-muted text-ink-soft hover:bg-line hover:text-ink"
                }`}
              >
                <Icon name="hash" className="h-3.5 w-3.5" />
                {topic}
              </button>
            );
          })}
        </div>
      </section>

      {/* Users grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <SkeletonUserCard />
          <SkeletonUserCard />
          <SkeletonUserCard />
          <SkeletonUserCard />
        </div>
      ) : users.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No users found"
          description={
            query
              ? `No results for "${query}". Try a different search.`
              : "No other users have joined yet."
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {users.map((user) => (
            <div
              key={user.id}
              className="card card-hover flex flex-col p-5"
            >
              <div className="flex items-start gap-3">
                <Avatar
                  name={user.name}
                  src={user.avatarUrl}
                  size="lg"
                  isOnline={user.isOnline ?? undefined}
                />
                <div className="min-w-0 flex-1">
                  <button
                    onClick={() => router.push(`/profile/${user.id}`)}
                    className="block max-w-full truncate text-left text-sm font-semibold tracking-tight text-ink transition-colors duration-200 hover:text-accent"
                  >
                    {user.name}
                  </button>
                  <p className="mt-0.5 truncate text-xs text-ink-mute">
                    {user.department && `${user.department}`}
                    {user.department && user.year && " · "}
                    {user.year}
                  </p>
                  {user.bio && (
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink-soft">
                      {user.bio}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between gap-3 border-t border-line-soft pt-4">
                <div className="flex gap-4 text-xs text-ink-mute">
                  <span className="tabular-nums">
                    <strong className="font-semibold text-ink">
                      {user.postCount}
                    </strong>{" "}
                    posts
                  </span>
                  <span className="tabular-nums">
                    <strong className="font-semibold text-ink">
                      {user.followerCount}
                    </strong>{" "}
                    followers
                  </span>
                </div>
                <button
                  onClick={() => handleFollow(user.id)}
                  className={`btn px-4 ${
                    user.isFollowing ? "btn-secondary" : "btn-primary"
                  }`}
                >
                  {user.isFollowing ? "Following" : "Follow"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
