"use client";

import { useState } from "react";
import Avatar from "./Avatar";
import { Icon } from "./icons";
import { apiFetch } from "@/lib/api";

interface CreatePostFormProps {
  user: {
    name: string;
    avatarUrl: string;
  };
  onPostCreated: (post: unknown) => void;
  /**
   * "inline" sits in the feed and expands into a bottom sheet on phones.
   * "modal" is rendered inside the composer modal, where the shell already
   * provides the surface, so it stays put.
   */
  presentation?: "inline" | "modal";
}

export default function CreatePostForm({
  user,
  onPostCreated,
  presentation = "inline",
}: CreatePostFormProps) {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [focused, setFocused] = useState(false);
  const isModal = presentation === "modal";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || sending) return;
    setSending(true);

    try {
      const res = await apiFetch("/api/posts", {
        method: "POST",
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        const post = await res.json();
        onPostCreated(post);
        setContent("");
        setFocused(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const closeSheet = () => {
    setFocused(false);
    setContent("");
  };

  return (
    <>
      {/* Dimmed backdrop behind the mobile bottom sheet (inline variant only) */}
      {focused && !isModal && (
        <button
          type="button"
          onClick={closeSheet}
          aria-label="Close composer"
          className="fixed inset-0 z-40 cursor-default bg-ink/30 backdrop-blur-sm sm:hidden"
        />
      )}

      <form
        id={isModal ? undefined : "composer"}
        onSubmit={handleSubmit}
        className={`overflow-hidden transition-[box-shadow,border-radius] duration-200 ease-soft ${
          isModal
            ? ""
            : focused
              ? "fixed inset-x-0 bottom-0 z-50 rounded-t-3xl rounded-b-none shadow-pop sm:static sm:inset-auto sm:bottom-auto sm:z-auto sm:rounded-2xl sm:shadow-card"
              : "card card-hover"
        }`}
      >
        <div className="p-5 pb-4">
          <div className="flex gap-3">
            <Avatar name={user.name} src={user.avatarUrl} />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setFocused(true)}
              placeholder="What's on your mind?"
              aria-label="What's on your mind?"
              autoFocus={isModal}
              className="min-h-[44px] flex-1 resize-none border-none bg-transparent text-base leading-relaxed text-ink outline-none placeholder:text-ink-mute"
              rows={focused || isModal ? 3 : 1}
            />
          </div>
        </div>

        {(focused || content) && (
          <div className="flex items-center justify-between gap-3 border-t border-line-soft px-5 py-3">
            <div className="flex gap-1.5">
              <button
                type="button"
                className="pill min-h-11 text-ink-mute hover:bg-muted hover:text-ink"
              >
                <Icon name="image" className="h-4 w-4 text-accent" />
                Photo
              </button>
              <button
                type="button"
                className="pill min-h-11 text-ink-mute hover:bg-muted hover:text-ink"
              >
                <Icon name="paperclip" className="h-4 w-4 text-accent" />
                File
              </button>
            </div>
            <button
              type="submit"
              disabled={!content.trim() || sending}
              className="btn btn-primary px-5"
            >
              {sending ? "Posting..." : "Post"}
            </button>
          </div>
        )}
      </form>
    </>
  );
}
