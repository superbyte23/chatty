"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ProfileHeader, { type ProfileHeaderData } from "@/components/ProfileHeader";
import PostCard, { type PostData } from "@/components/PostCard";
import EmptyState from "@/components/EmptyState";
import { SkeletonPost } from "@/components/Skeleton";
import { apiFetch } from "@/lib/api";

export default function UserProfilePage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const [profile, setProfile] = useState<ProfileHeaderData | null>(null);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const meRes = await apiFetch("/api/auth/me");
        if (!meRes.ok) {
          router.push("/login");
          return;
        }
        const me = await meRes.json();
        setCurrentUserId(me.id);

        const res = await apiFetch(`/api/users/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }

        const postsRes = await apiFetch(`/api/posts?userId=${userId}`);
        if (postsRes.ok) setPosts(await postsRes.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId, router]);

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
    <div className="space-y-6">
      <ProfileHeader
        profile={profile}
        onFollow={handleFollow}
        onMessage={() => router.push("/messages")}
      />

      <div className="space-y-4">
        {posts.length === 0 ? (
          <EmptyState
            icon="📝"
            title="No posts yet"
            description="This user hasn't posted anything yet."
          />
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={currentUserId}
              onDeleted={handlePostDeleted}
            />
          ))
        )}
      </div>
    </div>
  );
}
