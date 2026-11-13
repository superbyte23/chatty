import { View, Text, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Avatar } from "./Avatar";
import { Icon } from "./Icon";
import type { Profile } from "@/lib/api";
import { useTheme } from "@/lib/theme";
import { fonts, radii, softShadow, spacing } from "@/theme";

interface ProfileHeaderProps {
  profile: Profile;
  onFollow?: () => void;
  onMessage?: () => void;
  onEdit?: () => void;
  followingBusy?: boolean;
}

export function ProfileHeader({
  profile,
  onFollow,
  onMessage,
  onEdit,
  followingBusy,
}: ProfileHeaderProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: colors.elevated,
          borderColor: colors.lineSoft,
          ...softShadow(colors, "card"),
        },
      ]}
    >
      {/* Cover */}
      <LinearGradient
        colors={[colors.brand, colors.brand2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cover}
      >
        <View style={styles.coverBlob} />
      </LinearGradient>

      <View style={styles.body}>
        {/* Avatar overlapping the cover */}
        <View style={styles.avatarWrap}>
          <Avatar
            name={profile.name}
            src={profile.avatarUrl}
            size="xl"
            isOnline={profile.isOnline}
          />
        </View>

        <View style={styles.identity}>
          <Text style={[styles.name, { color: colors.ink }]} numberOfLines={1}>
            {profile.name}
          </Text>
          <Text style={[styles.meta, { color: colors.inkMute }]} numberOfLines={1}>
            {[profile.department, profile.year].filter(Boolean).join(" · ") ||
              "KCC Student"}
          </Text>
          {profile.bio ? (
            <Text style={[styles.bio, { color: colors.inkSoft }]}>
              {profile.bio}
            </Text>
          ) : null}
        </View>

        {/* Stats */}
        <View style={[styles.stats, { backgroundColor: colors.sunken }]}>
          <View style={styles.stat}>
            <Text style={[styles.statNumber, { color: colors.ink }]}>
              {profile.postCount}
            </Text>
            <Text style={[styles.statLabel, { color: colors.inkMute }]}>
              posts
            </Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statNumber, { color: colors.ink }]}>
              {profile.followerCount}
            </Text>
            <Text style={[styles.statLabel, { color: colors.inkMute }]}>
              followers
            </Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statNumber, { color: colors.ink }]}>
              {profile.followingCount}
            </Text>
            <Text style={[styles.statLabel, { color: colors.inkMute }]}>
              following
            </Text>
          </View>
        </View>

        {profile.isOwn ? (
          <Pressable
            onPress={onEdit}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.editButton,
              { backgroundColor: colors.accent },
              pressed && { opacity: 0.9 },
            ]}
          >
            <Icon name="edit" size={16} color={colors.onAccent} />
            <Text style={[styles.editText, { color: colors.onAccent }]}>
              Edit Profile
            </Text>
          </Pressable>
        ) : (
          <View style={styles.actions}>
            <Pressable
              onPress={onFollow}
              disabled={followingBusy}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.followButton,
                profile.isFollowing
                  ? { backgroundColor: colors.muted }
                  : { backgroundColor: colors.accent },
                pressed && { opacity: 0.85 },
              ]}
            >
              <Text
                style={[
                  styles.followText,
                  {
                    color: profile.isFollowing
                      ? colors.inkSoft
                      : colors.onAccent,
                  },
                ]}
              >
                {profile.isFollowing ? "Following" : "Follow"}
              </Text>
            </Pressable>
            <Pressable
              onPress={onMessage}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.messageButton,
                {
                  backgroundColor: colors.muted,
                  borderColor: colors.line,
                },
                pressed && { opacity: 0.85 },
              ]}
            >
              <Icon name="message" size={16} color={colors.inkSoft} />
              <Text style={[styles.messageText, { color: colors.inkSoft }]}>
                Message
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radii.xl,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  cover: {
    height: 108,
    overflow: "hidden",
  },
  coverBlob: {
    position: "absolute",
    top: -60,
    right: -20,
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.16)",
  },
  body: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  avatarWrap: {
    marginTop: -40,
    alignSelf: "flex-start",
    borderRadius: 999,
    backgroundColor: "transparent",
  },
  identity: {
    marginTop: spacing.md,
  },
  name: {
    fontFamily: fonts.semibold,
    fontSize: 19,
    letterSpacing: -0.3,
  },
  meta: {
    fontFamily: fonts.regular,
    fontSize: 13,
    marginTop: 2,
  },
  bio: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
  },
  stats: {
    flexDirection: "row",
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radii.lg,
  },
  stat: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontFamily: fonts.semibold,
    fontSize: 16,
  },
  statLabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    marginTop: 1,
  },
  editButton: {
    marginTop: spacing.lg,
    minHeight: 46,
    borderRadius: radii.pill,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  editText: {
    fontFamily: fonts.semibold,
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  followButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  followText: {
    fontFamily: fonts.semibold,
    fontSize: 14,
  },
  messageButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  messageText: {
    fontFamily: fonts.semibold,
    fontSize: 14,
  },
});
