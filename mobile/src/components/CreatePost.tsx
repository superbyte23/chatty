import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Keyboard,
} from "react-native";
import { Avatar } from "./Avatar";
import { api, type Post } from "@/lib/api";
import { useTheme } from "@/lib/theme";
import { fonts, radii, softShadow, spacing } from "@/theme";

interface CreatePostProps {
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar: string | null;
  onCreated: (post: Post) => void;
}

export function CreatePost({
  currentUserId,
  currentUserName,
  currentUserAvatar,
  onCreated,
}: CreatePostProps) {
  const { colors } = useTheme();
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  const handlePost = async () => {
    if (!content.trim() || sending) return;
    setSending(true);
    try {
      const post = await api.createPost(content.trim());
      onCreated(post);
      setContent("");
      Keyboard.dismiss();
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

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
      <View style={styles.row}>
        <Avatar name={currentUserName} src={currentUserAvatar} size="md" />
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="Share something with the KCC community..."
          placeholderTextColor={colors.inkMute}
          multiline
          accessibilityLabel="Write a post"
          style={[styles.input, { color: colors.ink }]}
        />
      </View>
      <View style={[styles.footer, { borderTopColor: colors.lineSoft }]}>
        <Text style={[styles.hint, { color: colors.inkMute }]}>
          {2000 - content.length} characters left
        </Text>
        <Pressable
          onPress={handlePost}
          disabled={!content.trim() || sending}
          accessibilityRole="button"
          accessibilityLabel="Publish post"
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: colors.accent },
            (!content.trim() || sending) && styles.buttonDisabled,
            pressed && { opacity: 0.9 },
          ]}
        >
          <Text style={[styles.buttonText, { color: colors.onAccent }]}>
            {sending ? "Posting..." : "Post"}
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
    padding: spacing.lg,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  input: {
    flex: 1,
    minHeight: 44,
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    paddingTop: 10,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  hint: {
    fontFamily: fonts.regular,
    fontSize: 12,
  },
  button: {
    paddingHorizontal: spacing.xl,
    minHeight: 40,
    justifyContent: "center",
    borderRadius: radii.pill,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
  },
});
