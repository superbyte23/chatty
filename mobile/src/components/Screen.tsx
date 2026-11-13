import type { ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { Link, useRouter } from "expo-router";
import { BrandMark } from "./BrandMark";
import { Icon } from "./Icon";
import { ThemeToggle } from "./ThemeToggle";
import { useNotifications } from "@/lib/notifications";
import { useTheme } from "@/lib/theme";
import { fonts, radii, spacing } from "@/theme";

interface ScreenProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  right?: ReactNode;
  onBack?: () => void;
  back?: boolean;
}

export function Screen({
  children,
  title,
  subtitle,
  right,
  onBack,
  back,
}: ScreenProps) {
  const router = useRouter();
  const { colors, mode } = useTheme();
  const { unread } = useNotifications();

  return (
    <SafeAreaView edges={["top"]} style={[styles.safe, { backgroundColor: colors.surface }]}>
      {/* Translucent, blurred top bar */}
      <View style={[styles.headerWrap, { backgroundColor: colors.glass }]}>
        <BlurView
          intensity={40}
          tint="default"
          blurMethod="dimezisBlurView"
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.header, { borderBottomColor: colors.lineSoft }]}>
          {back ? (
            <Pressable
              onPress={onBack ?? (() => router.back())}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={8}
              style={({ pressed }) => [
                styles.iconBtn,
                { backgroundColor: colors.muted },
                pressed && { opacity: 0.6 },
              ]}
            >
              <Icon name="chevronLeft" size={20} color={colors.inkSoft} />
            </Pressable>
          ) : (
            <BrandMark size={32} />
          )}
          <View style={styles.titles}>
            <Text style={[styles.title, { color: colors.ink }]} numberOfLines={1}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={[styles.subtitle, { color: colors.inkMute }]} numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </View>

          {/* Alerts entry point */}
          <Link href="/notifications" asChild>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                unread > 0 ? `Alerts, ${unread} unread` : "Alerts"
              }
              hitSlop={8}
              style={({ pressed }) => [
                styles.iconBtn,
                { backgroundColor: colors.muted },
                pressed && { opacity: 0.6 },
              ]}
            >
              <Icon name="bell" size={20} color={colors.inkSoft} />
              {unread > 0 && (
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: colors.accent, borderColor: colors.surface },
                  ]}
                />
              )}
            </Pressable>
          </Link>

          {right}
          <ThemeToggle />
        </View>
      </View>
      {children}
    </SafeAreaView>
  );
}

export function IconButton({
  onPress,
  children,
  style,
}: {
  onPress: () => void;
  children: ReactNode;
  style?: ViewStyle;
}) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      hitSlop={8}
      style={({ pressed }) => [
        styles.iconBtn,
        { backgroundColor: colors.muted },
        style,
        pressed && { opacity: 0.6 },
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  headerWrap: {
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    height: 60,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 9,
    width: 10,
    height: 10,
    borderRadius: 999,
    borderWidth: 2,
  },
  titles: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 17,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 12,
    marginTop: 1,
  },
});
