import { useCallback, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { ProfileHeader } from "@/components/ProfileHeader";
import { PostCard } from "@/components/PostCard";
import { Avatar } from "@/components/Avatar";
import { EmptyState } from "@/components/EmptyState";
import { Skeleton, SkeletonPost } from "@/components/Skeleton";
import { api, type Profile, type Post, type FollowListItem } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { fonts, radii, spacing } from "@/theme";

type Tab = "posts" | "followers" | "following";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const { colors } = useTheme();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [followers, setFollowers] = useState<FollowListItem[]>([]);
  const [following, setFollowing] = useState<FollowListItem[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("posts");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = useCallback(async () => {
    if (!user) return;
    try {
      const [profileData, postsData] = await Promise.all([
        api.getUser(user.id),
        api.getPosts(user.id),
      ]);
      setProfile(profileData);
      setPosts(postsData);
      refreshUser();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, refreshUser]);

  useFocusEffect(
    useCallback(() => {
      if (user) fetchAll();
    }, [fetchAll, user])
  );

  const fetchFollowList = async (tab: Tab) => {
    if (!profile) return;
    try {
      if (tab === "followers") {
        setFollowers(await api.getFollowList(profile.id, "followers"));
      } else {
        setFollowing(await api.getFollowList(profile.id, "following"));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab !== "posts") fetchFollowList(tab);
  };

  const handleDeleted = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const listItems =
    activeTab === "posts"
      ? posts
      : activeTab === "followers"
        ? followers
        : following;

  return (
    <Screen title="My Profile" subtitle={user ? user.name : undefined}>
      {loading ? (
        <View style={styles.content}>
          <Skeleton style={styles.headerSkeleton} radius={radii.xl} />
          <SkeletonPost />
        </View>
      ) : profile ? (
        <FlatList
          data={listItems as unknown[]}
          keyExtractor={(item) => (item as { id: string }).id}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchAll();
              }}
              tintColor={colors.accent}
            />
          }
          ListHeaderComponent={
            <>
              <ProfileHeader
                profile={profile}
                onEdit={() => router.push("/settings")}
              />
              {/* Refined tab bar */}
              <View style={[styles.segmented, { backgroundColor: colors.muted }]}>
                {(
                  [
                    ["posts", "Posts"],
                    ["followers", "Followers"],
                    ["following", "Following"],
                  ] as [Tab, string][]
                ).map(([tab, label]) => {
                  const active = activeTab === tab;
                  return (
                    <Pressable
                      key={tab}
                      onPress={() => handleTabChange(tab)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: active }}
                      style={({ pressed }) => [
                        styles.segment,
                        active && {
                          backgroundColor: colors.elevated,
                          borderColor: colors.lineSoft,
                        },
                        pressed && !active && { opacity: 0.7 },
                      ]}
                    >
                      <Text
                        style={[
                          styles.segmentText,
                          { color: active ? colors.ink : colors.inkMute },
                        ]}
                      >
                        {label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          }
          ListEmptyComponent={
            activeTab === "posts" ? (
              <EmptyState
                icon="📝"
                title="No posts yet"
                description={
                  profile.isOwn
                    ? "Share your first post with the community!"
                    : "This user hasn't posted yet."
                }
              />
            ) : activeTab === "followers" ? (
              <EmptyState
                icon="👥"
                title="No followers yet"
                description="When someone follows you, they'll appear here."
              />
            ) : (
              <EmptyState
                icon="👥"
                title="Not following anyone yet"
                description="Explore and follow other students!"
              />
            )
          }
          renderItem={({ item }) => {
            if (activeTab === "posts") {
              return (
                <View style={styles.postItem}>
                  <PostCard
                    post={item as Post}
                    currentUserId={profile.id}
                    onDeleted={handleDeleted}
                  />
                </View>
              );
            }
            const u = item as FollowListItem;
            return (
              <Pressable
                onPress={() => router.push(`/user/${u.id}`)}
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.followRow,
                  {
                    backgroundColor: colors.elevated,
                    borderColor: colors.lineSoft,
                  },
                  pressed && { backgroundColor: colors.muted },
                ]}
              >
                <Avatar
                  name={u.name}
                  src={u.avatarUrl}
                  size="md"
                  isOnline={u.isOnline}
                />
                <View style={styles.followInfo}>
                  <Text style={[styles.followName, { color: colors.ink }]}>
                    {u.name}
                  </Text>
                  {u.department ? (
                    <Text style={[styles.followMeta, { color: colors.inkMute }]}>
                      {u.department}
                    </Text>
                  ) : null}
                </View>
              </Pressable>
            );
          }}
        />
      ) : (
        <EmptyState
          icon="👤"
          title="Profile not found"
          description="This user doesn't exist."
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
  headerSkeleton: {
    height: 240,
    marginBottom: spacing.lg,
  },
  segmented: {
    flexDirection: "row",
    borderRadius: radii.pill,
    padding: 4,
    marginTop: spacing.lg,
    gap: 4,
  },
  segment: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 9,
    borderRadius: radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "transparent",
  },
  segmentText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
  },
  postItem: {
    marginBottom: spacing.lg,
    marginTop: spacing.lg,
  },
  followRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderRadius: radii.xl,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.lg,
    marginTop: spacing.sm,
  },
  followInfo: {
    flex: 1,
  },
  followName: {
    fontFamily: fonts.semibold,
    fontSize: 14,
  },
  followMeta: {
    fontFamily: fonts.regular,
    fontSize: 12,
    marginTop: 1,
  },
});
