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
import { Icon, type IconName } from "@/components/Icon";
import { EmptyState } from "@/components/EmptyState";
import { Skeleton } from "@/components/Skeleton";
import { api, type AppNotification } from "@/lib/api";
import { timeAgo } from "@/lib/format";
import { useTheme } from "@/lib/theme";
import { fonts, radii, spacing } from "@/theme";

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

function resolveLink(link: string): string | null {
  if (!link) return null;
  if (link.startsWith("/post/")) return link;
  if (link.startsWith("/profile/")) return `/user/${link.slice("/profile/".length)}`;
  if (link === "/messages") return "/messages";
  return null;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data.notifications);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [fetchNotifications])
  );

  const markAllRead = async () => {
    try {
      await api.markNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const unread = notifications.filter((n) => !n.isRead).length;

  const sections = useMemo(() => {
    const grouped = notifications.reduce<Record<string, AppNotification[]>>(
      (acc, notif) => {
        const key = groupLabel(notif.createdAt);
        (acc[key] ||= []).push(notif);
        return acc;
      },
      {}
    );
    return Object.entries(grouped).map(([title, data]) => ({ title, data }));
  }, [notifications]);

  const iconFor = (type: string): IconName => {
    if (type === "like") return "heart";
    if (type === "comment") return "comment";
    if (type === "follow") return "user";
    if (type === "message") return "message";
    return "bell";
  };

  return (
    <Screen title="Notifications" subtitle="Campus activity">
      {loading ? (
        <View style={styles.loading}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={styles.skeletonRow}>
              <Skeleton style={styles.skeletonIcon} radius={999} />
              <View style={styles.skeletonBody}>
                <Skeleton style={styles.skeletonLine} />
                <Skeleton style={styles.skeletonLineShort} />
              </View>
            </View>
          ))}
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          stickySectionHeadersEnabled={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchNotifications();
              }}
              tintColor={colors.accent}
            />
          }
          ListHeaderComponent={
            <View style={styles.summaryRow}>
              {unread > 0 ? (
                <View style={styles.summaryWrap}>
                  <View style={[styles.summaryDot, { backgroundColor: colors.accent }]} />
                  <Text style={[styles.summary, { color: colors.inkMute }]}>
                    You have {unread} unread notification{unread > 1 ? "s" : ""}
                  </Text>
                </View>
              ) : (
                <Text style={[styles.summary, { color: colors.success }]}>
                  ✓ You&apos;re all caught up
                </Text>
              )}
              {unread > 0 && (
                <Pressable
                  onPress={markAllRead}
                  hitSlop={8}
                  accessibilityRole="button"
                >
                  <Text style={[styles.markRead, { color: colors.accent }]}>
                    Mark all read
                  </Text>
                </Pressable>
              )}
            </View>
          }
          ListEmptyComponent={
            <EmptyState
              icon="🔔"
              title="No notifications"
              description="When someone likes your post, comments, or follows you, you'll see it here."
            />
          }
          renderSectionHeader={({ section }) => (
            <Text style={[styles.groupLabel, { color: colors.inkMute }]}>
              {section.title}
            </Text>
          )}
          renderItem={({ item }) => {
            const href = resolveLink(item.link);
            const Wrapper = href ? Pressable : View;
            const wrapperProps = href
              ? { onPress: () => router.push(href as never) }
              : {};
            return (
              <Wrapper
                {...wrapperProps}
                style={({ pressed }: any) => [
                  styles.card,
                  {
                    backgroundColor: item.isRead
                      ? colors.elevated
                      : colors.accentSoft,
                    borderColor: colors.lineSoft,
                  },
                  pressed && { opacity: 0.85 },
                ]}
              >
                <View style={[styles.iconBox, { backgroundColor: colors.muted }]}>
                  <Icon name={iconFor(item.type)} size={18} color={colors.accent} />
                </View>
                <View style={styles.cardBody}>
                  <Text
                    style={[
                      styles.message,
                      {
                        color: item.isRead ? colors.inkSoft : colors.ink,
                        fontFamily: item.isRead
                          ? fonts.regular
                          : fonts.semibold,
                      },
                    ]}
                  >
                    {item.message}
                  </Text>
                  <Text style={[styles.time, { color: colors.inkMute }]}>
                    {timeAgo(item.createdAt)}
                  </Text>
                </View>
                {!item.isRead && (
                  <View style={[styles.unreadDot, { backgroundColor: colors.accent }]} />
                )}
              </Wrapper>
            );
          }}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl + 48,
    flexGrow: 1,
  },
  loading: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  summaryWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  summary: {
    fontFamily: fonts.regular,
    fontSize: 13,
  },
  summaryDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  markRead: {
    fontFamily: fonts.semibold,
    fontSize: 12,
  },
  groupLabel: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    paddingHorizontal: spacing.xs,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    borderRadius: radii.xl,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
  time: {
    fontFamily: fonts.regular,
    fontSize: 12,
    marginTop: 4,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginTop: 6,
  },
  skeletonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  skeletonIcon: {
    width: 36,
    height: 36,
  },
  skeletonBody: {
    flex: 1,
    gap: 8,
  },
  skeletonLine: {
    height: 12,
    width: "80%",
    borderRadius: 6,
  },
  skeletonLineShort: {
    height: 10,
    width: 40,
    borderRadius: 5,
  },
});
