import { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useFocusEffect } from "expo-router";
import { Screen } from "@/components/Screen";
import { PostCard } from "@/components/PostCard";
import { Avatar } from "@/components/Avatar";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Icon } from "@/components/Icon";
import { api, type Post, type Comment } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { timeAgo } from "@/lib/format";
import { useTheme } from "@/lib/theme";
import { fonts, radii, spacing } from "@/theme";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user: me } = useAuth();
  const { colors } = useTheme();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      const [postData, commentsData] = await Promise.all([
        api.getPost(id),
        api.getComments(id),
      ]);
      setPost(postData);
      setComments(commentsData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchAll();
    }, [fetchAll])
  );

  const handleAddComment = async () => {
    if (!text.trim() || sending || !me) return;
    setSending(true);
    const content = text.trim();
    setText("");
    try {
      const comment = await api.addComment(id, content);
      setComments((prev) => [comment, ...prev]);
      setPost((prev) =>
        prev ? { ...prev, commentCount: prev.commentCount + 1 } : prev
      );
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Screen back title="Post" subtitle="Discussion">
        {loading ? (
          <LoadingSpinner size="large" />
        ) : post ? (
          <>
            <FlatList
              data={comments}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
              ListHeaderComponent={
                <>
                  <PostCard post={post} currentUserId={me?.id} />
                  <Text style={[styles.commentsHeader, { color: colors.ink }]}>
                    Comments ({comments.length})
                  </Text>
                </>
              }
              ListEmptyComponent={
                <EmptyState
                  icon="💬"
                  title="No comments yet"
                  description="Start the conversation!"
                />
              }
              renderItem={({ item }) => (
                <View style={styles.commentRow}>
                  <Avatar
                    name={item.authorName}
                    src={item.authorAvatar}
                    size="sm"
                  />
                  <View style={styles.commentBody}>
                    <View style={styles.commentTop}>
                      <Text
                        style={[styles.commentAuthor, { color: colors.ink }]}
                      >
                        {item.authorName}
                      </Text>
                      <Text style={[styles.commentTime, { color: colors.inkMute }]}>
                        {timeAgo(item.createdAt)}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.commentText,
                        {
                          color: colors.inkSoft,
                          backgroundColor: colors.elevated,
                          borderColor: colors.lineSoft,
                        },
                      ]}
                    >
                      {item.content}
                    </Text>
                  </View>
                </View>
              )}
            />
            {/* Pinned reply composer */}
            <View
              style={[
                styles.inputBar,
                {
                  backgroundColor: colors.glass,
                  borderTopColor: colors.lineSoft,
                },
              ]}
            >
              <Avatar
                name={me?.name ?? "You"}
                src={me?.avatarUrl ?? null}
                size="sm"
              />
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder="Add a comment..."
                placeholderTextColor={colors.inkMute}
                accessibilityLabel="Add a comment"
                style={[
                  styles.input,
                  {
                    color: colors.ink,
                    backgroundColor: colors.muted,
                  },
                ]}
                multiline
              />
              <Pressable
                onPress={handleAddComment}
                disabled={!text.trim() || sending}
                accessibilityRole="button"
                accessibilityLabel="Post comment"
                style={({ pressed }) => [
                  styles.sendButton,
                  { backgroundColor: colors.accent },
                  (!text.trim() || sending) && styles.sendDisabled,
                  pressed && { opacity: 0.9 },
                ]}
              >
                <Icon name="send" size={16} color={colors.onAccent} />
              </Pressable>
            </View>
          </>
        ) : (
          <EmptyState
            icon="📝"
            title="Post not found"
            description="This post doesn't exist."
          />
        )}
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
  commentsHeader: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  commentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  commentBody: {
    flex: 1,
  },
  commentTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  commentAuthor: {
    fontFamily: fonts.semibold,
    fontSize: 13,
  },
  commentTime: {
    fontFamily: fonts.regular,
    fontSize: 11,
  },
  commentText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    fontFamily: fonts.regular,
    fontSize: 14,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: 11,
    textAlignVertical: "center",
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  sendDisabled: {
    opacity: 0.4,
  },
});
