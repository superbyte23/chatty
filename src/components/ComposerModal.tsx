"use client";

import { useEffect } from "react";
import CreatePostForm from "./CreatePostForm";
import { Icon } from "./icons";

interface ComposerModalProps {
  open: boolean;
  onClose: () => void;
  user: {
    name: string;
    avatarUrl: string;
  };
  onPostCreated: (post: unknown) => void;
}

/**
 * Modal composer. A bottom sheet on phones, a centred dialog from `sm` up.
 */
export default function ComposerModal({
  open,
  onClose,
  user,
  onPostCreated,
}: ComposerModalProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center sm:p-4">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close composer"
        className="absolute inset-0 animate-fade-in cursor-default bg-ink/40 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Create a post"
        className="relative w-full max-w-lg animate-rise"
      >
        <div className="rounded-t-3xl bg-elevated p-4 shadow-pop ring-1 ring-line-soft sm:rounded-3xl sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold tracking-tight text-ink">
              New post
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="icon-btn"
              aria-label="Close"
              title="Close"
            >
              <Icon name="x" className="h-5 w-5" />
            </button>
          </div>

          <CreatePostForm
            presentation="modal"
            user={user}
            onPostCreated={(post) => {
              onPostCreated(post);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}
