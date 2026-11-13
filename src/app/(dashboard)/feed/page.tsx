"use client";

import { useEffect, useState, useCallback } from "react";
import PostCard, { type PostData } from "@/components/PostCard";
import EmptyState from "@/components/EmptyState";
import CreatePostForm from "@/components/CreatePostForm";
import { SkeletonPost } from "@/components/Skeleton";
import { apiFetch } from "@/lib/api";
import { useDashboard } from "@/lib/dashboard";
import PageLayout from "@/components/PageLayout";

export default function FeedPage() {
  const { registerPostHandler, openComposer } = useDashboard();
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{
    id: string;
    name: string;
    avatarUrl: string;
  } | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await apiFetch("/api/posts");
      if (res.ok) setPosts(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const bootstrap = async () => {
      try {
        const [userRes, postsRes] = await Promise.all([
          apiFetch("/api/auth/me"),
          apiFetch("/api/posts"),
        ]);
        if (active) {
          if (userRes.ok) setUser(await userRes.json());
          if (postsRes.ok) setPosts(await postsRes.json());
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (active) setLoading(false);
      }
    };
    bootstrap();
    return () => {
      active = false;
    };
  }, []);

  const handlePostCreated = (post: unknown) => {
    setPosts((prev) => [post as PostData, ...prev]);
  };

  const handlePostDeleted = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  // Posts created from the composer modal land at the top of the feed.
  useEffect(() => {
    registerPostHandler((post) => {
      setPosts((prev) => [post as PostData, ...prev]);
    });
    return () => registerPostHandler(null);
  }, [registerPostHandler]);

  return (
    <PageLayout>
      {/* Create Post - inline composer using shared component */}
      {user && (
        <CreatePostForm
          user={{ name: user.name, avatarUrl: user.avatarUrl }}
          onPostCreated={handlePostCreated}
          presentation="inline"
        />
      )}

      {/* Posts */}
      {loading ? (
        <div className="space-y-4">
          <SkeletonPost />
          <SkeletonPost />
          <SkeletonPost />
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          icon="📝"
          title="No posts yet"
          description="Be the first to share something with the KCC community!"
        />
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={user?.id}
              onDeleted={handlePostDeleted}
            />
          ))}
        </div>
      )}
    </PageLayout>
  );
}
