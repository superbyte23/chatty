"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import ComposerModal from "@/components/ComposerModal";

interface DashboardState {
  notificationCount: number;
  signOut: () => void;
  composerOpen: boolean;
  openComposer: () => void;
  closeComposer: () => void;
  registerPostHandler: (handler: ((post: unknown) => void) | null) => void;
  submitPost: (post: unknown) => void;
}

const DashboardContext = createContext<DashboardState>({
  notificationCount: 0,
  signOut: () => {},
  composerOpen: false,
  openComposer: () => {},
  closeComposer: () => {},
  registerPostHandler: () => {},
  submitPost: () => {},
});

/**
 * Shares dashboard-level state with chrome and page components — the unread
 * notification count, the sign-out action and the post composer — without
 * changing the props of any existing component.
 */
export function DashboardProvider({
  notificationCount,
  signOut,
  user,
  children,
}: {
  notificationCount: number;
  signOut: () => void;
  user: { name: string; avatarUrl: string };
  children: ReactNode;
}) {
  const [composerOpen, setComposerOpen] = useState(false);
  const postHandlerRef = useRef<((post: unknown) => void) | null>(null);

  const openComposer = useCallback(() => setComposerOpen(true), []);
  const closeComposer = useCallback(() => setComposerOpen(false), []);

  // Screens that list posts register a handler so a post created from the
  // composer can be inserted without a refetch.
  const registerPostHandler = useCallback(
    (handler: ((post: unknown) => void) | null) => {
      postHandlerRef.current = handler;
    },
    []
  );

  const submitPost = useCallback((post: unknown) => {
    postHandlerRef.current?.(post);
  }, []);

  const value = useMemo(
    () => ({
      notificationCount,
      signOut,
      composerOpen,
      openComposer,
      closeComposer,
      registerPostHandler,
      submitPost,
    }),
    [
      notificationCount,
      signOut,
      composerOpen,
      openComposer,
      closeComposer,
      registerPostHandler,
      submitPost,
    ]
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
      <ComposerModal
        open={composerOpen}
        onClose={closeComposer}
        user={user}
        onPostCreated={submitPost}
      />
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  return useContext(DashboardContext);
}
