"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileHeader, { type ProfileHeaderData } from "@/components/ProfileHeader";
import PostCard, { type PostData } from "@/components/PostCard";
import Avatar from "@/components/Avatar";
import EmptyState from "@/components/EmptyState";
import { SkeletonPost } from "@/components/Skeleton";
import { Icon } from "@/components/icons";
import { apiFetch } from "@/lib/api";
import { useDashboard } from "@/lib/dashboard";
import PageLayout from "@/components/PageLayout";

type Tab = "posts" | "followers" | "following";

interface Follower {
  id: string;
  name: string;
  avatarUrl: string | null;
  department: string | null;
  bio: string | null;
  isOnline: boolean | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const { signOut } = useDashboard();
  const [profile, setProfile] = useState<ProfileHeaderData | null>(null);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("posts");
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [following, setFollowing] = useState<Follower[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const meRes = await apiFetch("/api/auth/me");
        if (!meRes.ok) {
          router.push("/login");
          return;
        }
        const me = await meRes.json();

        const res = await apiFetch(`/api/users/${me.id}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }

        const postsRes = await apiFetch(`/api/posts?userId=${me.id}`);
        if (postsRes.ok) setPosts(await postsRes.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const handleFollow = async () => {
    if (!profile) return;
    try {
      const res = await apiFetch("/api/follow", {
        method: "POST",
        body: JSON.stringify({ userId: profile.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                isFollowing: data.following,
                followerCount: data.following
                  ? prev.followerCount + 1
                  : prev.followerCount - 1,
              }
            : prev
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchFollowersList = async () => {
    if (!profile) return;
    try {
      const res = await apiFetch(`/api/follow?userId=${profile.id}&type=followers`);
      if (res.ok) setFollowers(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchFollowingList = async () => {
    if (!profile) return;
    try {
      const res = await apiFetch(`/api/follow?userId=${profile.id}&type=following`);
      if (res.ok) setFollowing(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === "followers") fetchFollowersList();
    if (tab === "following") fetchFollowingList();
  };

  const handlePostDeleted = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  if (loading)
    return (
      <div className="space-y-4">
        <div className="skeleton h-72 w-full rounded-2xl" />
        <SkeletonPost />
      </div>
    );
  if (!profile)
    return (
      <EmptyState
        icon="👤"
        title="Profile not found"
        description="This user doesn't exist."
      />
    );

  return (
    <PageLayout>
      <ProfileHeader
        profile={profile}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onEdit={() => router.push("/settings")}
      />

      {activeTab === "posts" && (
        <section className="space-y-4">
          {posts.length === 0 ? (
            <EmptyState
              icon="📝"
              title="No posts yet"
              description={
                profile.isOwn
                  ? "Share your first post with the community!"
                  : "This user hasn't posted yet."
              }
            />
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={profile.isOwn ? profile.id : undefined}
                onDeleted={handlePostDeleted}
              />
            ))
          )}
        </section>
      )}

      {(activeTab === "followers" || activeTab === "following") && (
        <section className="space-y-4">
          <div className="card divide-y divide-line-soft overflow-hidden">
            {activeTab === "followers" && followers.length === 0 && (
              <EmptyState
                icon="👥"
                title="No followers yet"
                description="When someone follows you, they'll appear here."
              />
            )}
            {activeTab === "following" && following.length === 0 && (
              <EmptyState
                icon="👥"
                title="Not following anyone yet"
                description="Explore and follow other students!"
              />
            )}
            {(activeTab === "followers" ? followers : following).map((user) => (
              <button
                key={user.id}
                onClick={() => router.push(`/profile/${user.id}`)}
                className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors duration-200 hover:bg-muted"
              >
                <Avatar
                  name={user.name}
                  src={user.avatarUrl}
                  size="md"
                  isOnline={user.isOnline ?? undefined}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-ink-mute">
                    {user.department}
                  </p>
                </div>
                <Icon name="chevronDown" className="h-4 w-4 -rotate-90 text-ink-mute" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Account */}
      <section>
        <div className="card p-5 sm:p-6">
          <h2 className="text-lg font-semibold tracking-tight text-ink">Account</h2>
          <p className="mt-1 mb-4 text-sm text-ink-mute">
            Sign out of KCC Chat on this device.
          </p>
          <button
            onClick={signOut}
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
