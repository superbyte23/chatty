import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { Avatar } from "./Avatar";
import { Icon } from "./Icon";
import { api, type Post } from "@/lib/api";
import { timeAgo } from "@/lib/format";
import { confirmAsync } from "@/lib/ui";
import { useTheme } from "@/lib/theme";
import { fonts, radii, softShadow, spacing } from "@/theme";

interface PostCardProps {
  post: Post;
  currentUserId?: string;
  onDeleted?: (id: string) => void;
  onUpdated?: (post: Post) => void;
}

export function PostCard({ post, currentUserId, onDeleted, onUpdated }: PostCardProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const isOwner = currentUserId !== undefined && currentUserId === post.authorId;

  const [liked, setLiked] = useState(post.userLiked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [commentCount, setCommentCount] = useState(post.commentCount);
  const [content, setContent] = useState(post.content);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [menuOpen, setMenuOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setLiked(post.userLiked);
    setLikeCount(post.likeCount);
    setCommentCount(post.commentCount);
    setContent(post.content);
  }, [post]);

  // Spring reaction on like
  useEffect(() => {
    if (!liked) return;
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1.3,
        useNativeDriver: true,
        friction: 4,
        tension: 220,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 4,
        tension: 220,
      }),
    ]).start();
  }, [liked, scale]);

  const handleLike = async () => {
    if (busy) return;
    setBusy(true);
    const next = !liked;
    setLiked(next);
    setLikeCount((c) => c + (next ? 1 : -1));
    try {
      const result = await api.toggleLike(post.id);
      setLiked(result);
      setLikeCount(result ? post.likeCount + 1 : post.likeCount);
    } catch {
      setLiked(!next);
      setLikeCount(post.likeCount);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    setMenuOpen(false);
    const ok = await confirmAsync("Delete this post?", "This can't be undone.");
    if (!ok) return;
    try {
      await api.deletePost(post.id);
      onDeleted?.(post.id);
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = async () => {
    if (!editContent.trim()) return;
    try {
      const updated = await api.updatePost(post.id, editContent.trim());
      setContent(updated.content ?? editContent);
      setEditing(false);
      if (onUpdated) {
        onUpdated({ ...post, content: editContent });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const meta = [
    post.authorDepartment,
    post.authorYear,
    timeAgo(post.createdAt),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.elevated,
          borderColor: colors.lineSoft,
          ...softShadow(colors, "card"),
        },
      ]}
    >
      {/* Header */}
      <View style={styles.padTop}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.push(`/user/${post.authorId}`)}
            accessibilityRole="button"
            style={({ pressed }) => [styles.author, pressed && { opacity: 0.7 }]}
          >
            <Avatar name={post.authorName} src={post.authorAvatar} size="md" />
            <View style={styles.authorText}>
              <Text style={[styles.authorName, { color: colors.ink }]} numberOfLines={1}>
                {post.authorName}
              </Text>
              <Text style={[styles.authorMeta, { color: colors.inkMute }]} numberOfLines={1}>
                {meta}
              </Text>
            </View>
          </Pressable>

          {isOwner && (
            <View>
              <Pressable
                onPress={() => setMenuOpen((v) => !v)}
                accessibilityRole="button"
                accessibilityLabel="Post options"
                hitSlop={8}
                style={({ pressed }) => [
                  styles.iconBtn,
                  { backgroundColor: colors.muted },
                  pressed && { opacity: 0.6 },
                ]}
              >
                <Icon name="dots" size={18} color={colors.inkSoft} />
              </Pressable>
              {menuOpen && (
                <View
                  style={[
                    styles.menu,
                    {
                      backgroundColor: colors.elevated,
                      borderColor: colors.lineSoft,
                      ...softShadow(colors, "pop"),
                    },
                  ]}
                >
                  <Pressable
                    style={({ pressed }) => [
                      styles.menuItem,
                      pressed && { backgroundColor: colors.muted },
                    ]}
                    onPress={() => {
                      setMenuOpen(false);
                      setEditing(true);
                    }}
                  >
                    <Icon name="edit" size={16} color={colors.inkMute} />
                    <Text style={[styles.menuText, { color: colors.inkSoft }]}>
                      Edit
                    </Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [
                      styles.menuItem,
                      pressed && { backgroundColor: colors.dangerSoft },
                    ]}
                    onPress={handleDelete}
                  >
                    <Icon name="trash" size={16} color={colors.danger} />
                    <Text style={[styles.menuText, { color: colors.danger }]}>
                      Delete
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Content */}
        {editing ? (
          <View style={styles.editBox}>
            <TextInput
              value={editContent}
              onChangeText={setEditContent}
              multiline
              placeholderTextColor={colors.inkMute}
              style={[
                styles.editInput,
                {
                  color: colors.ink,
                  backgroundColor: colors.muted,
                  borderColor: colors.line,
                },
              ]}
            />
            <View style={styles.editActions}>
              <Pressable
                onPress={handleEdit}
                style={({ pressed }) => [
                  styles.btnPrimary,
                  { backgroundColor: colors.accent },
                  pressed && { opacity: 0.9 },
                ]}
              >
                <Text style={[styles.btnPrimaryText, { color: colors.onAccent }]}>
                  Save
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setEditing(false);
                  setEditContent(content);
                }}
                style={({ pressed }) => [
                  styles.btnSecondary,
                  {
                    backgroundColor: colors.muted,
                    borderColor: colors.line,
                  },
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Text style={[styles.btnSecondaryText, { color: colors.inkSoft }]}>
                  Cancel
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Text style={[styles.content, { color: colors.inkSoft }]}>{content}</Text>
        )}
      </View>

      {/* Edge-to-edge media */}
      {post.imageUrl ? (
        <Image
          source={{ uri: post.imageUrl }}
          style={[styles.image, { backgroundColor: colors.sunken }]}
          contentFit="cover"
          transition={150}
        />
      ) : null}

      {/* Actions */}
      <View style={[styles.actions, { borderTopColor: colors.lineSoft }]}>
        <Pressable
          onPress={handleLike}
          disabled={busy}
          accessibilityRole="button"
          accessibilityLabel={liked ? "Unlike post" : "Like post"}
          style={({ pressed }) => [
            styles.pill,
            liked
              ? { backgroundColor: colors.accentSoft }
              : pressed
                ? { backgroundColor: colors.muted }
                : null,
          ]}
        >
          <Animated.View style={{ transform: [{ scale }] }}>
            <Icon
              name="heart"
              size={18}
              filled={liked}
              color={liked ? colors.accent : colors.inkMute}
            />
          </Animated.View>
          <Text
            style={[
              styles.pillText,
              { color: liked ? colors.accent : colors.inkMute },
            ]}
          >
            {likeCount}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push(`/post/${post.id}`)}
          accessibilityRole="button"
          accessibilityLabel="Open comments"
          style={({ pressed }) => [
            styles.pill,
            pressed ? { backgroundColor: colors.muted } : null,
          ]}
        >
          <Icon name="comment" size={18} color={colors.inkMute} />
          <Text style={[styles.pillText, { color: colors.inkMute }]}>
            {commentCount}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
    borderWidth: StyleSheet.hairlineWidth,
  },
  padTop: {
    padding: spacing.xl,
    paddingBottom: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  author: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    flex: 1,
  },
  authorText: {
    flex: 1,
  },
  authorName: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    letterSpacing: -0.2,
  },
  authorMeta: {
    fontFamily: fonts.regular,
    fontSize: 12,
    marginTop: 1,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  menu: {
    position: "absolute",
    right: 0,
    top: 44,
    zIndex: 20,
    width: 168,
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    minHeight: 44,
  },
  menuText: {
    fontFamily: fonts.semibold,
    fontSize: 14,
  },
  content: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 24,
  },
  editBox: {
    marginTop: spacing.sm,
  },
  editInput: {
    minHeight: 80,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radii.lg,
    padding: spacing.md,
    fontFamily: fonts.regular,
    fontSize: 15,
    textAlignVertical: "top",
  },
  editActions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  btnPrimary: {
    paddingHorizontal: spacing.lg,
    minHeight: 40,
    justifyContent: "center",
    borderRadius: radii.pill,
  },
  btnPrimaryText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
  },
  btnSecondary: {
    paddingHorizontal: spacing.lg,
    minHeight: 40,
    justifyContent: "center",
    borderRadius: radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  btnSecondaryText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
  },
  image: {
    width: "100%",
    aspectRatio: 16 / 10,
    borderRadius: radii.xl,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 12,
    minHeight: 44,
    borderRadius: radii.pill,
  },
  pillText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
  },
});
