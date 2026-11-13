import { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Screen } from "@/components/Screen";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Icon } from "@/components/Icon";
import { api, type ChatMessage, type ThreadData } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { timeAgo } from "@/lib/format";
import { useTheme } from "@/lib/theme";
import { fonts, radii, spacing } from "@/theme";

export default function ConversationScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { user: me } = useAuth();
  const { colors } = useTheme();
  const scrollRef = useRef<ScrollView>(null);

  const [thread, setThread] = useState<ThreadData | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const fetchThread = useCallback(async () => {
    try {
      const data = await api.getThread(userId);
      setThread(data);
      setMessages(data.messages);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const handleFocus = useCallback(() => {
    fetchThread();
  }, [fetchThread]);

  const handleSend = async () => {
    if (!text.trim() || sending || !me) return;
    setSending(true);
    const content = text.trim();
    setText("");
    try {
      const msg = await api.sendMessage(userId, content);
      setMessages((prev) => [
        ...prev,
        { ...msg, senderName: "You", senderAvatar: null },
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const otherUser = thread?.user ?? null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Screen
        back
        title={otherUser?.name ?? "Chat"}
        subtitle={
          otherUser ? (otherUser.isOnline ? "Online" : "Offline") : undefined
        }
      >
        {loading ? (
          <LoadingSpinner size="large" />
        ) : (
          <>
            <ScrollView
              ref={scrollRef}
              style={[styles.messagesArea, { backgroundColor: colors.sunken }]}
              contentContainerStyle={styles.messagesContent}
              onContentSizeChange={() =>
                scrollRef.current?.scrollToEnd({ animated: true })
              }
              onLayout={() => scrollRef.current?.scrollToEnd({ animated: false })}
            >
              {messages.length === 0 ? (
                <Text style={[styles.emptyText, { color: colors.inkMute }]}>
                  Say hello to {otherUser?.name ?? "them"}!
                </Text>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.senderId === me?.id;
                  return (
                    <View
                      key={msg.id}
                      style={[styles.bubbleRow, isOwn && styles.bubbleRowOwn]}
                    >
                      <View
                        style={[
                          styles.bubble,
                          isOwn
                            ? { backgroundColor: colors.accent }
                            : {
                                backgroundColor: colors.elevated,
                                borderColor: colors.lineSoft,
                              },
                        ]}
                      >
                        <Text
                          style={[
                            styles.bubbleText,
                            { color: isOwn ? colors.onAccent : colors.inkSoft },
                          ]}
                        >
                          {msg.content}
                        </Text>
                        <Text
                          style={[
                            styles.bubbleTime,
                            {
                              color: isOwn
                                ? "rgba(255,255,255,0.7)"
                                : colors.inkMute,
                            },
                          ]}
                        >
                          {timeAgo(msg.createdAt)}
                        </Text>
                      </View>
                    </View>
                  );
                })
              )}
            </ScrollView>

            <View
              style={[
                styles.inputBar,
                {
                  backgroundColor: colors.glass,
                  borderTopColor: colors.lineSoft,
                },
              ]}
            >
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder="Type a message..."
                placeholderTextColor={colors.inkMute}
                accessibilityLabel="Type a message"
                style={[
                  styles.input,
                  {
                    color: colors.ink,
                    backgroundColor: colors.muted,
                  },
                ]}
                multiline
                onSubmitEditing={handleSend}
                onFocus={handleFocus}
              />
              <Pressable
                onPress={handleSend}
                disabled={!text.trim() || sending}
                accessibilityRole="button"
                accessibilityLabel="Send message"
                style={({ pressed }) => [
                  styles.sendButton,
                  { backgroundColor: colors.accent },
                  (!text.trim() || sending) && styles.sendDisabled,
                  pressed && { opacity: 0.9 },
                ]}
              >
                <Icon name="send" size={18} color={colors.onAccent} />
              </Pressable>
            </View>
          </>
        )}
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  messagesArea: {
    flex: 1,
  },
  messagesContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  emptyText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    textAlign: "center",
  },
  bubbleRow: {
    alignItems: "flex-start",
    marginBottom: 10,
  },
  bubbleRowOwn: {
    alignItems: "flex-end",
  },
  bubble: {
    maxWidth: "78%",
    borderRadius: radii.xl,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
  },
  bubbleText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTime: {
    fontFamily: fonts.regular,
    fontSize: 11,
    marginTop: 4,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.sm,
    padding: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    fontFamily: fonts.regular,
    fontSize: 14,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    textAlignVertical: "center",
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  sendDisabled: {
    opacity: 0.4,
  },
});
