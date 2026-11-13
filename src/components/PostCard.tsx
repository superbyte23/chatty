"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Avatar from "./Avatar";
import CommentSection from "./CommentSection";
import { Icon } from "./icons";
import { apiFetch } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";

export interface PostData {
  id: string;
  content: string;
  imageUrl?: string | null;
  createdAt: string | Date;
  authorId: string;
  authorName: string;
  authorAvatar: string | null;
  authorDepartment: string | null;
  authorYear: string | null;
  likeCount: number;
  commentCount: number;
  userLiked: boolean;
}

interface PostCardProps {
  post: PostData;
  currentUserId?: string;
  onDeleted?: (id: string) => void;
}

export default function PostCard({ post, currentUserId, onDeleted }: PostCardProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(post.userLiked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [commentCount, setCommentCount] = useState(post.commentCount);
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [content, setContent] = useState(post.content);
  const [showMenu, setShowMenu] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const isOwner = currentUserId === post.authorId;

  const handleLike = async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    // Optimistic update
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));

    try {
      await apiFetch(`/api/posts/${post.id}/like`, { method: "POST" });
    } catch {
      // Revert on error
      setLiked(liked);
      setLikeCount(likeCount);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this post?")) return;
    try {
      const res = await apiFetch(`/api/posts/${post.id}`, { method: "DELETE" });
      if (res.ok) {
        onDeleted?.(post.id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = async () => {
    try {
      const res = await apiFetch(`/api/posts/${post.id}`, {
        method: "PUT",
        body: JSON.stringify({ content: editContent }),
      });
      if (res.ok) {
        setContent(editContent);
        setIsEditing(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handle = post.authorDepartment || post.authorYear || "";

  return (
    <article className="card card-hover animate-rise">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 p-5 pb-4">
        <button
          onClick={() => router.push(`/profile/${post.authorId}`)}
          className="group flex min-w-0 items-center gap-3 text-left"
        >
          <Avatar name={post.authorName} src={post.authorAvatar} size="md" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight text-ink transition-colors duration-200 group-hover:text-accent">
              {post.authorName}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-ink-mute">
              {handle && (
                <span className="truncate">
                  {post.authorDepartment}
                  {post.authorDepartment && post.authorYear ? " · " : ""}
                  {post.authorYear}
                </span>
              )}
              {handle && <span aria-hidden>&middot;</span>}
              <span className="shrink-0">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </p>
          </div>
        </button>

        {isOwner && (
          <div className="relative shrink-0">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="icon-btn h-10 w-10"
              aria-label="Post options"
            >
              <Icon name="dots" className="h-5 w-5" />
            </button>
            {showMenu && (
              <div className="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-xl bg-elevated/90 p-1 shadow-pop ring-1 ring-line-soft backdrop-blur-xl">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                  className="flex min-h-11 w-full items-center gap-2.5 rounded-lg px-3 text-left text-sm font-semibold text-ink-soft transition-colors duration-200 hover:bg-muted hover:text-ink"
                >
                  <Icon name="edit" className="h-4 w-4 text-ink-mute" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    handleDelete();
                  }}
                  className="flex min-h-11 w-full items-center gap-2.5 rounded-lg px-3 text-left text-sm font-semibold text-danger transition-colors duration-200 hover:bg-danger-soft"
                >
                  <Icon name="trash" className="h-4 w-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {isEditing ? (
        <div className="px-5 pb-4">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="input-area resize-none"
            rows={3}
          />
          <div className="mt-3 flex gap-2">
            <button onClick={handleEdit} className="btn btn-primary px-5">
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditContent(content);
              }}
              className="btn btn-secondary px-5"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="whitespace-pre-wrap px-5 pb-4 text-base leading-relaxed text-ink-soft">
          {content}
        </p>
      )}

      {/* Edge-to-edge rounded media */}
      {post.imageUrl && (
        <div className="overflow-hidden bg-sunken">
          <img
            src={post.imageUrl}
            alt="Post"
            className="max-h-[560px] w-full rounded-2xl object-cover"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 px-4 py-2.5">
        <button
          onClick={handleLike}
          disabled={likeLoading}
          aria-pressed={liked}
          aria-label={liked ? "Unlike post" : "Like post"}
          className={`pill min-h-11 px-3 ${
            liked
              ? "bg-accent-soft text-accent"
              : "text-ink-mute hover:bg-muted hover:text-accent"
          }`}
        >
          <span key={String(liked)} className={liked ? "animate-pop" : ""}>
            <Icon
              name="heart"
              filled={liked}
              className="h-[18px] w-[18px]"
            />
          </span>
          <span className="tabular-nums">{likeCount}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          aria-pressed={showComments}
          aria-label={showComments ? "Hide comments" : "Show comments"}
          className={`pill min-h-11 px-3 ${
            showComments
              ? "bg-accent-soft text-accent"
              : "text-ink-mute hover:bg-muted hover:text-accent"
          }`}
        >
          <Icon name="comment" className="h-[18px] w-[18px]" />
          <span className="tabular-nums">{commentCount}</span>
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <CommentSection
          postId={post.id}
          currentUserId={currentUserId}
          onCommentAdded={() => setCommentCount((c) => c + 1)}
        />
      )}
    </article>
  );
}
