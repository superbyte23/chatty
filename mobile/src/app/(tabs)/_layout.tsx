import { useCallback } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Tabs, type BottomTabBarProps } from "expo-router/js-tabs";
import { useFocusEffect } from "expo-router";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon, type IconName } from "@/components/Icon";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { ComposerProvider, useComposer } from "@/lib/composer";
import { useNotifications } from "@/lib/notifications";
import { useTheme } from "@/lib/theme";
import { fonts, radii, softShadow, spacing } from "@/theme";

const routeIcons: Record<string, IconName> = {
  index: "home",
  explore: "compass",
  messages: "message",
  notifications: "bell",
  profile: "user",
};

function FloatingTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { colors } = useTheme();
  const { openComposer } = useComposer();
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 12);

  // Alerts now live in the top bar, so they are not part of the pill.
  const routes = state.routes.filter((route) => route.name !== "notifications");

  const renderTab = (route: (typeof routes)[number]) => {
    const focused = state.routes[state.index]?.key === route.key;
    const options = descriptors[route.key]?.options;
    const title =
      typeof options?.title === "string" ? options.title : route.name;
    const icon = routeIcons[route.name] ?? "home";

    const onPress = () => {
      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });
      if (!focused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    return (
      <Pressable
        key={route.key}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityState={focused ? { selected: true } : {}}
        accessibilityLabel={title}
        style={({ pressed }) => [
          styles.tab,
          focused && { backgroundColor: colors.accentSoft },
          pressed && !focused && { backgroundColor: colors.muted },
        ]}
      >
        <Icon
          name={icon}
          size={22}
          color={focused ? colors.accent : colors.inkMute}
        />
        <Text
          style={[
            styles.tabLabel,
            { color: focused ? colors.accent : colors.inkMute },
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={[styles.wrap, { paddingBottom: bottomPad, paddingHorizontal: 16 }]}>
      <View
        style={[
          styles.pill,
          {
            backgroundColor: colors.glass,
            borderColor: colors.line,
            ...softShadow(colors, "float"),
          },
        ]}
      >
        <BlurView
          intensity={40}
          tint="default"
          blurMethod="dimezisBlurView"
          style={StyleSheet.absoluteFill}
        />

        {renderTab(routes[0])}
        {renderTab(routes[1])}

        {/* Centered, elevated create button */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Create post"
          onPress={openComposer}
          style={({ pressed }) => [
            styles.create,
            {
              backgroundColor: colors.accent,
              borderColor: colors.surface,
              ...softShadow(colors, "float"),
            },
            pressed && { opacity: 0.9 },
          ]}
        >
          <Icon name="plus" size={26} color={colors.onAccent} />
        </Pressable>

        {renderTab(routes[2])}
        {renderTab(routes[3])}
      </View>
    </View>
  );
}

export default function TabLayout() {
  const { setUnread } = useNotifications();
  const { user } = useAuth();

  useFocusEffect(
    useCallback(() => {
      let active = true;
      api
        .getNotifications()
        .then((data) => {
          if (active) setUnread(data.unreadCount);
        })
        .catch(() => {});
      return () => {
        active = false;
      };
    }, [setUnread])
  );

  return (
    <ComposerProvider user={user}>
      <Tabs
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <FloatingTabBar {...props} />}
      >
        <Tabs.Screen name="index" options={{ title: "Feed" }} />
        <Tabs.Screen name="explore" options={{ title: "Explore" }} />
        <Tabs.Screen name="messages" options={{ title: "Messages" }} />
        {/* Alerts live in the top bar, so the tab is hidden but the route stays. */}
        <Tabs.Screen
          name="notifications"
          options={{ title: "Alerts", href: null }}
        />
        <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      </Tabs>
    </ComposerProvider>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    paddingTop: 44,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "stretch",
    borderRadius: radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 6,
    paddingVertical: 6,
    overflow: "visible",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingVertical: 6,
    borderRadius: radii.pill,
  },
  tabLabel: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    letterSpacing: -0.1,
  },
  create: {
    width: 56,
    height: 56,
    borderRadius: 999,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -38,
    zIndex: 10,
  },
});
