import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  TextInput,
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { Avatar } from "@/components/Avatar";
import { EmptyState } from "@/components/EmptyState";
import { Skeleton } from "@/components/Skeleton";
import { Icon } from "@/components/Icon";
import { api, type PublicUser } from "@/lib/api";
import { useTheme } from "@/lib/theme";
import { fonts, radii, softShadow, spacing } from "@/theme";

const topics = [
  "Computer Science",
  "Biology",
  "Business Administration",
  "Music",
  "Art & Design",
  "Psychology",
  "Engineering",
  "Nursing",
];

export default function ExploreScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = useCallback(async (search?: string) => {
    try {
      const data = await api.getUsers(search);
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(query.trim() || undefined);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, fetchUsers]);

  useFocusEffect(
    useCallback(() => {
      fetchUsers(query.trim() || undefined);
    }, [fetchUsers])
  );

  const handleFollow = async (userId: string) => {
    try {
      const following = await api.toggleFollow(userId);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                isFollowing: following,
                followerCount: following
                  ? u.followerCount + 1
                  : u.followerCount - 1,
              }
            : u
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Screen title="Explore" subtitle="Find classmates and friends">
      {/* Pill search */}
      <View style={[styles.searchWrap, { backgroundColor: colors.muted }]}>
        <Icon name="search" size={16} color={colors.inkMute} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search by name, department, or email..."
          placeholderTextColor={colors.inkMute}
          accessibilityLabel="Search people"
          style={[styles.searchInput, { color: colors.ink }]}
          autoCorrect={false}
        />
      </View>

      {/* Topic chips */}
      <View style={styles.topics}>
        {topics.map((topic) => {
          const active = query === topic;
          return (
            <Pressable
              key={topic}
              onPress={() => setQuery(active ? "" : topic)}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.topic,
                {
                  backgroundColor: active ? colors.accent : colors.muted,
                },
                pressed && !active && { opacity: 0.7 },
              ]}
            >
              <Icon
                name="hash"
                size={13}
                color={active ? colors.onAccent : colors.inkMute}
              />
              <Text
                style={[
                  styles.topicText,
                  { color: active ? colors.onAccent : colors.inkSoft },
                ]}
              >
                {topic}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {loading ? (
        <View style={styles.content}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={[
                styles.card,
                {
                  backgroundColor: colors.elevated,
                  borderColor: colors.lineSoft,
                  ...softShadow(colors, "card"),
                },
              ]}
            >
              <View style={styles.cardTop}>
                <Skeleton style={styles.avatarLg} radius={999} />
                <View style={styles.cardInfo}>
                  <Skeleton style={styles.lineMd} />
                  <Skeleton style={styles.lineSm} />
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchUsers(query.trim() || undefined);
              }}
              tintColor={colors.accent}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="🔍"
              title="No users found"
              description={
                query
                  ? `No results for "${query}". Try a different search.`
                  : "No other users have joined yet."
              }
            />
          }
          renderItem={({ item }) => (
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
              <View style={styles.cardTop}>
                <Avatar
                  name={item.name}
                  src={item.avatarUrl}
                  size="lg"
                  isOnline={item.isOnline}
                />
                <View style={styles.cardInfo}>
                  <Pressable
                    onPress={() => router.push(`/user/${item.id}`)}
                    accessibilityRole="button"
                  >
                    <Text
                      style={[styles.name, { color: colors.ink }]}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                  </Pressable>
                  <Text
                    style={[styles.meta, { color: colors.inkMute }]}
                    numberOfLines={1}
                  >
                    {[item.department, item.year].filter(Boolean).join(" · ")}
                  </Text>
                  {item.bio ? (
                    <Text
                      style={[styles.bio, { color: colors.inkSoft }]}
                      numberOfLines={2}
                    >
                      {item.bio}
                    </Text>
                  ) : null}
                </View>
              </View>

              <View style={[styles.cardBottom, { borderTopColor: colors.lineSoft }]}>
                <View style={styles.stats}>
                  <Text style={[styles.statText, { color: colors.inkMute }]}>
                    <Text style={[styles.statNumber, { color: colors.ink }]}>
                      {item.postCount}
                    </Text>{" "}
                    posts
                  </Text>
                  <Text style={[styles.statText, { color: colors.inkMute }]}>
                    <Text style={[styles.statNumber, { color: colors.ink }]}>
                      {item.followerCount}
                    </Text>{" "}
                    followers
                  </Text>
                </View>
                <Pressable
                  onPress={() => handleFollow(item.id)}
                  accessibilityRole="button"
                  style={({ pressed }) => [
                    styles.followButton,
                    item.isFollowing
                      ? { backgroundColor: colors.muted }
                      : { backgroundColor: colors.accent },
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Text
                    style={[
                      styles.followText,
                      {
                        color: item.isFollowing
                          ? colors.inkSoft
                          : colors.onAccent,
                      },
                    ]}
                  >
                    {item.isFollowing ? "Following" : "Follow"}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.lg,
    minHeight: 48,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  topics: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  topic: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    minHeight: 44,
    justifyContent: "center",
    borderRadius: radii.pill,
  },
  topicText: {
    fontFamily: fonts.semibold,
    fontSize: 12,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl + 48,
    flexGrow: 1,
  },
  card: {
    borderRadius: radii.xl,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  cardInfo: {
    flex: 1,
    gap: 8,
  },
  name: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    letterSpacing: -0.2,
  },
  meta: {
    fontFamily: fonts.regular,
    fontSize: 12,
  },
  bio: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 17,
  },
  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  stats: {
    flexDirection: "row",
    gap: spacing.lg,
  },
  statText: {
    fontFamily: fonts.regular,
    fontSize: 12,
  },
  statNumber: {
    fontFamily: fonts.semibold,
  },
  followButton: {
    paddingHorizontal: spacing.lg,
    minHeight: 36,
    justifyContent: "center",
    borderRadius: radii.pill,
  },
  followText: {
    fontFamily: fonts.semibold,
    fontSize: 12,
  },
  avatarLg: {
    width: 48,
    height: 48,
  },
  lineMd: {
    height: 12,
    width: 120,
    borderRadius: 6,
  },
  lineSm: {
    height: 10,
    width: 80,
    borderRadius: 5,
  },
});
