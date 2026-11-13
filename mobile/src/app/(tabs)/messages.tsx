import { useCallback, useMemo, useState } from "react";
import {
  SectionList,
  RefreshControl,
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { Avatar } from "@/components/Avatar";
import { EmptyState } from "@/components/EmptyState";
import { SkeletonRow } from "@/components/Skeleton";
import { api, type Conversation } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { timeAgo } from "@/lib/format";
import { useTheme } from "@/lib/theme";
import { fonts, spacing } from "@/theme";

function groupLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();
  const startOfYesterday = startOfToday - 86_400_000;
  const time = date.getTime();
  if (time >= startOfToday) return "Today";
  if (time >= startOfYesterday) return "Yesterday";
  return "Earlier";
}

export default function MessagesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { colors } = useTheme();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchConversations = useCallback(async () => {
    try {
      const data = await api.getConversations();
      setConversations(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchConversations();
    }, [fetchConversations])
  );

  const sections = useMemo(() => {
    const grouped = conversations.reduce<Record<string, Conversation[]>>(
      (acc, conv) => {
        const key = groupLabel(conv.createdAt);
        (acc[key] ||= []).push(conv);
        return acc;
      },
      {}
    );
    return Object.entries(grouped).map(([title, data]) => ({ title, data }));
  }, [conversations]);

  return (
    <Screen title="Messages" subtitle="Your conversations">
      {loading ? (
        <View style={styles.loading}>
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.otherUserId}
          contentContainerStyle={styles.content}
          stickySectionHeadersEnabled={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchConversations();
              }}
              tintColor={colors.accent}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="💬"
              title="No messages yet"
              description="Start a conversation with someone from the Explore page!"
            />
          }
          renderSectionHeader={({ section }) => (
            <Text style={[styles.groupLabel, { color: colors.inkMute }]}>
              {section.title}
            </Text>
          )}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/conversation/${item.otherUserId}`)}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.row,
                item.unreadCount > 0
                  ? { backgroundColor: colors.accentSoft }
                  : pressed
                    ? { backgroundColor: colors.muted }
                    : null,
              ]}
            >
              <Avatar
                name={item.otherUserName}
                src={item.otherUserAvatar}
                size="md"
                isOnline={item.otherUserOnline}
              />
              <View style={styles.rowBody}>
                <View style={styles.rowTop}>
                  <Text
                    style={[
                      styles.name,
                      {
                        color:
                          item.unreadCount > 0 ? colors.ink : colors.inkSoft,
                        fontFamily:
                          item.unreadCount > 0
                            ? fonts.semibold
                            : fonts.regular,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {item.otherUserName}
                  </Text>
                  <Text style={[styles.time, { color: colors.inkMute }]}>
                    {timeAgo(item.createdAt, false)}
                  </Text>
                </View>
                <View style={styles.rowBottom}>
                  <Text
                    style={[
                      styles.preview,
                      {
                        color:
                          item.unreadCount > 0 ? colors.inkSoft : colors.inkMute,
                        fontFamily:
                          item.unreadCount > 0
                            ? fonts.semibold
                            : fonts.regular,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {item.senderId === user?.id ? "You: " : ""}
                    {item.content}
                  </Text>
                  {item.unreadCount > 0 && (
                    <View style={styles.unreadWrap}>
                      <View
                        style={[styles.dot, { backgroundColor: colors.accent }]}
                      />
                      <View
                        style={[styles.badge, { backgroundColor: colors.accent }]}
                      >
                        <Text
                          style={[styles.badgeText, { color: colors.onAccent }]}
                        >
                          {item.unreadCount > 9 ? "9+" : item.unreadCount}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </Pressable>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingBottom: spacing.xxl + 48,
  },
  loading: {
    paddingTop: spacing.md,
  },
  groupLabel: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xs,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  rowBody: {
    flex: 1,
  },
  rowTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    flex: 1,
    fontSize: 14,
  },
  time: {
    fontFamily: fonts.regular,
    fontSize: 11,
    marginLeft: spacing.sm,
  },
  rowBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  preview: {
    flex: 1,
    fontSize: 12,
  },
  unreadWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginLeft: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    fontFamily: fonts.semibold,
    fontSize: 11,
  },
});
