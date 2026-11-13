"use client";

import Avatar from "./Avatar";
import { Icon } from "./icons";
import { format } from "date-fns";

export interface ProfileHeaderData {
  id: string;
  name: string;
  avatarUrl: string | null;
  department: string;
  year: string;
  bio: string;
  isOnline: boolean;
  createdAt: string;
  postCount: number;
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
  isOwn: boolean;
}

type Tab = "posts" | "followers" | "following";

interface ProfileHeaderProps {
  profile: ProfileHeaderData;
  activeTab?: Tab;
  onTabChange?: (tab: Tab) => void;
  onFollow?: () => void;
  onMessage?: () => void;
  onEdit?: () => void;
}

const tabLabels: { key: Tab; label: string }[] = [
  { key: "posts", label: "Posts" },
  { key: "followers", label: "Followers" },
  { key: "following", label: "Following" },
];

export default function ProfileHeader({
  profile,
  activeTab,
  onTabChange,
  onFollow,
  onMessage,
  onEdit,
}: ProfileHeaderProps) {
  const stats: { key: Tab; count: number; label: string }[] = [
    { key: "posts", count: profile.postCount, label: "Posts" },
    { key: "followers", count: profile.followerCount, label: "Followers" },
    { key: "following", count: profile.followingCount, label: "Following" },
  ];

  return (
    <div className="card overflow-hidden">
      {/* Cover */}
      <div className="relative h-36 overflow-hidden bg-gradient-to-br from-brand via-brand to-brand-2 sm:h-44">
        <div
          aria-hidden
          className="absolute -top-16 right-10 h-48 w-48 rounded-full bg-white/15 blur-2xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-24 left-20 h-52 w-52 rounded-full bg-white/10 blur-3xl"
        />
      </div>

      <div className="px-5 pb-5 sm:px-6 sm:pb-6">
        {/* Avatar overlapping the cover */}
        <div className="-mt-12 flex items-end justify-between gap-4 sm:-mt-14">
          <div className="rounded-full bg-elevated p-1 shadow-card">
            <Avatar
              name={profile.name}
              src={profile.avatarUrl}
              size="xl"
              isOnline={profile.isOnline}
            />
          </div>

          <div className="flex flex-wrap gap-2 pb-1">
            {!profile.isOwn && (
              <>
                {onFollow && (
                  <button
                    onClick={onFollow}
                    className={`btn px-5 ${
                      profile.isFollowing ? "btn-secondary" : "btn-primary"
                    }`}
                  >
                    {profile.isFollowing ? "Following" : "Follow"}
                  </button>
                )}
                {onMessage && (
                  <button onClick={onMessage} className="btn btn-secondary px-5">
                    <Icon name="message" className="h-4 w-4" />
                    Message
                  </button>
                )}
              </>
            )}
            {profile.isOwn && onEdit && (
              <button onClick={onEdit} className="btn btn-secondary px-5">
                <Icon name="edit" className="h-4 w-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Identity */}
        <div className="mt-4">
          <h1 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            {profile.name}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            {profile.department && `${profile.department}`}
            {profile.department && profile.year && " · "}
            {profile.year}
          </p>
          {profile.createdAt && (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-mute">
              <Icon name="gradCap" className="h-3.5 w-3.5" />
              Joined {format(new Date(profile.createdAt), "MMMM yyyy")}
            </p>
          )}
        </div>

        {profile.bio && (
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
            {profile.bio}
          </p>
        )}

        {/* Stats */}
        <div className="mt-5 grid grid-cols-3 divide-x divide-line-soft rounded-2xl bg-sunken px-2 py-3">
          {stats.map((s) => (
            <div key={s.key} className="px-2 text-center">
              <p className="text-lg font-semibold tabular-nums text-ink">
                {s.count}
              </p>
              <p className="text-xs text-ink-mute">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Refined tab bar */}
        {onTabChange && (
          <div
            role="tablist"
            aria-label="Profile sections"
            className="mt-4 flex gap-1 rounded-full bg-muted p-1"
          >
            {tabLabels.map((t) => (
              <button
                key={t.key}
                role="tab"
                aria-selected={activeTab === t.key}
                onClick={() => onTabChange(t.key)}
                className={`min-h-10 flex-1 rounded-full px-3 text-sm font-semibold transition-all duration-200 ease-soft ${
                  activeTab === t.key
                    ? "bg-elevated text-ink shadow-card"
                    : "text-ink-mute hover:text-ink-soft"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
