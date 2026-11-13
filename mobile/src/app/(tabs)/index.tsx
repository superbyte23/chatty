import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, View, StyleSheet } from "react-native";
import { useFocusEffect } from "expo-router";
import { Screen } from "@/components/Screen";
import { IconButton } from "@/components/Screen";
import { CreatePost } from "@/components/CreatePost";
import { PostCard } from "@/components/PostCard";
import { EmptyState } from "@/components/EmptyState";
import { SkeletonPost } from "@/components/Skeleton";
import { Icon } from "@/components/Icon";
import { api, type Post } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useComposer } from "@/lib/composer";
import { useRouter } from "expo-router";
import { useTheme } from "@/lib/theme";
import { spacing } from "@/theme";

export default function FeedScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { registerPostHandler } = useComposer();
  const { colors } = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      const data = await api.getPosts();
      setPosts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [fetchPosts])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  const handleCreated = (post: Post) => {
    setPosts((prev) => [post, ...prev]);
  };

  const handleDeleted = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  // Posts created from the composer modal land at the top of the feed.
  useEffect(() => {
    registerPostHandler((post) => {
      setPosts((prev) => [post as Post, ...prev]);
    });
    return () => registerPostHandler(null);
  }, [registerPostHandler]);

  return (
    <Screen
      title="Feed"
      subtitle={user ? `Welcome back, ${user.name.split(" ")[0]}` : undefined}
      right={
        <IconButton onPress={() => router.push("/settings")}>
          <Icon name="settings" size={20} color={colors.inkSoft} />
        </IconButton>
      }
    >
      {loading ? (
        <View style={styles.content}>
          <SkeletonPost />
          <SkeletonPost />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.accent}
            />
          }
          ListHeaderComponent={
            user ? (
              <View style={styles.composer}>
                <CreatePost
                  currentUserId={user.id}
                  currentUserName={user.name}
                  currentUserAvatar={user.avatarUrl}
                  onCreated={handleCreated}
                />
              </View>
            ) : null
          }
          ListEmptyComponent={
            <EmptyState
              icon="📝"
              title="No posts yet"
              description="Be the first to share something with the KCC community!"
            />
          }
          renderItem={({ item }) => (
            <View style={styles.item}>
              <PostCard
                post={item}
                currentUserId={user?.id}
                onDeleted={handleDeleted}
              />
            </View>
          )}
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
  composer: {
    marginBottom: spacing.lg,
  },
  item: {
    marginBottom: spacing.lg,
  },
});
