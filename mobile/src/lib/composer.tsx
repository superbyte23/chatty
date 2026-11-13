import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { CreatePost } from "@/components/CreatePost";
import { useTheme } from "./theme";
import { fonts, radii, softShadow, spacing } from "@/theme";

interface ComposerState {
  composerOpen: boolean;
  openComposer: () => void;
  closeComposer: () => void;
  registerPostHandler: (handler: ((post: unknown) => void) | null) => void;
  submitPost: (post: unknown) => void;
}

const ComposerContext = createContext<ComposerState>({
  composerOpen: false,
  openComposer: () => {},
  closeComposer: () => {},
  registerPostHandler: () => {},
  submitPost: () => {},
});

/**
 * Owns the post composer modal so it can be opened from the tab bar, and
 * lets the feed insert posts created through it.
 */
export function ComposerProvider({
  user,
  children,
}: {
  user: { id: string; name: string; avatarUrl: string | null } | null;
  children: ReactNode;
}) {
  const { colors } = useTheme();
  const [composerOpen, setComposerOpen] = useState(false);
  const postHandlerRef = useRef<((post: unknown) => void) | null>(null);

  const openComposer = useCallback(() => setComposerOpen(true), []);
  const closeComposer = useCallback(() => setComposerOpen(false), []);

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
      composerOpen,
      openComposer,
      closeComposer,
      registerPostHandler,
      submitPost,
    }),
    [composerOpen, openComposer, closeComposer, registerPostHandler, submitPost]
  );

  const handleCreated = (post: unknown) => {
    submitPost(post);
    closeComposer();
  };

  return (
    <ComposerContext.Provider value={value}>
      {children}

      <Modal
        visible={composerOpen}
        transparent
        animationType="slide"
        onRequestClose={closeComposer}
      >
        <View style={styles.backdrop}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={closeComposer}
            accessibilityRole="button"
            accessibilityLabel="Close composer"
          />
          <View
            style={[
              styles.sheet,
              {
                backgroundColor: colors.elevated,
                borderColor: colors.lineSoft,
                ...softShadow(colors, "pop"),
              },
            ]}
          >
            <View style={[styles.grabber, { backgroundColor: colors.line }]} />
            <Text style={[styles.title, { color: colors.ink }]}>New post</Text>
            {user ? (
              <CreatePost
                currentUserId={user.id}
                currentUserName={user.name}
                currentUserAvatar={user.avatarUrl}
                onCreated={handleCreated}
              />
            ) : null}
          </View>
        </View>
      </Modal>
    </ComposerContext.Provider>
  );
}

export function useComposer() {
  return useContext(ComposerContext);
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(9,9,11,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: radii.xxl,
    borderTopRightRadius: radii.xxl,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  grabber: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 999,
    marginBottom: spacing.md,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 17,
    marginBottom: spacing.md,
  },
});
