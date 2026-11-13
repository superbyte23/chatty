"use client";

import { useState, useEffect } from "react";
import Avatar from "./Avatar";
import { Icon } from "./icons";
import { apiFetch } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string | null;
}

interface CommentSectionProps {
  postId: string;
  currentUserId?: string;
  onCommentAdded?: () => void;
}

function CommentSkeleton() {
  return (
    <div className="flex gap-3">
      <div className="skeleton h-8 w-8 rounded-full" />
      <div className="flex-1 space-y-2 rounded-xl bg-muted p-3">
        <div className="skeleton h-3 w-28" />
        <div className="skeleton h-3 w-full" />
      </div>
    </div>
  );
}

export default function CommentSection({
  postId,
  currentUserId,
  onCommentAdded,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await apiFetch(`/api/posts/${postId}/comments`);
        if (res.ok) setComments(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || sending) return;
    setSending(true);

    try {
      const res = await apiFetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({ content: newComment }),
      });
      if (res.ok) {
        const comment = await res.json();
        setComments((prev) => [comment, ...prev]);
        setNewComment("");
        onCommentAdded?.();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="border-t border-line-soft bg-sunken/70 px-4 py-4 sm:px-5">
      {/* Pinned reply composer */}
      {currentUserId && (
        <form
          onSubmit={handleSubmit}
          className="mb-4 flex items-center gap-2.5"
        >
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            aria-label="Write a comment"
            className="input min-h-11 flex-1"
          />
          <button
            type="submit"
            disabled={!newComment.trim() || sending}
            aria-label="Post comment"
            className="btn btn-primary h-11 w-11 shrink-0 p-0"
          >
            <Icon name="send" className="h-[18px] w-[18px]" />
          </button>
        </form>
      )}

      {/* Threaded comments */}
      {loading ? (
        <div className="space-y-4">
          <CommentSkeleton />
          <CommentSkeleton />
        </div>
      ) : comments.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-mute">
          No comments yet. Be the first!
        </p>
      ) : (
        <div className="space-y-4 border-l border-line-soft pl-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar
                name={comment.authorName}
                src={comment.authorAvatar}
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="truncate text-sm font-semibold text-ink">
                    {comment.authorName}
                  </span>
                  <span className="shrink-0 text-xs text-ink-mute">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="mt-1 rounded-xl bg-elevated px-3.5 py-2 text-sm leading-relaxed text-ink-soft ring-1 ring-line-soft">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
