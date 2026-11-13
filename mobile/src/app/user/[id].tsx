import { useCallback, useState } from "react";
import { FlatList, RefreshControl, View, StyleSheet } from "react-native";
import { useLocalSearchParams, useFocusEffect, useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { ProfileHeader } from "@/components/ProfileHeader";
import { PostCard } from "@/components/PostCard";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { api, type Profile, type Post } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { spacing } from "@/theme";

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user: me } = useAuth();
  const { colors } = useTheme();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [followingBusy, setFollowingBusy] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      const [profileData, postsData] = await Promise.all([
        api.getUser(id),
        api.getPosts(id),
      ]);
      setProfile(profileData);
      setPosts(postsData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchAll();
    }, [fetchAll])
  );

  const handleFollow = async () => {
    if (!profile || followingBusy) return;
    setFollowingBusy(true);
    try {
      const following = await api.toggleFollow(profile.id);
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              isFollowing: following,
              followerCount: following
                ? prev.followerCount + 1
                : prev.followerCount - 1,
            }
          : prev
      );
    } catch (e) {
      console.error(e);
    } finally {
      setFollowingBusy(false);
    }
  };

  const handleDeleted = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  return (
    <Screen
      back
      title={profile?.name ?? "Profile"}
      subtitle={
        [profile?.department, profile?.year].filter(Boolean).join(" · ") ||
        undefined
      }
    >
      {loading ? (
        <LoadingSpinner size="large" />
      ) : profile ? (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
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
            <ProfileHeader
              profile={profile}
              onFollow={handleFollow}
              onMessage={() => router.push(`/conversation/${profile.id}`)}
              followingBusy={followingBusy}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="📝"
              title="No posts yet"
              description="This user hasn't posted anything yet."
            />
          }
          renderItem={({ item }) => (
            <View style={styles.item}>
              <PostCard
                post={item}
                currentUserId={me?.id}
                onDeleted={handleDeleted}
              />
            </View>
          )}
        />
      ) : (
        <EmptyState
          icon="👤"
          title="User not found"
          description="This user doesn't exist."
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },
  item: {
    marginTop: spacing.lg,
  },
});
