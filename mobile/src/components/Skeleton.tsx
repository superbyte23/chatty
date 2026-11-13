import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";
import { useTheme } from "@/lib/theme";
import { radii } from "@/theme";

/**
 * Shimmering placeholder used everywhere a spinner used to be.
 */
export function Skeleton({
  style,
  radius = radii.sm,
}: {
  style?: ViewStyle | ViewStyle[];
  radius?: number;
}) {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.45,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        { backgroundColor: colors.muted, borderRadius: radius, opacity },
        style as ViewStyle,
      ]}
    />
  );
}

export function SkeletonPost() {
  return (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <Skeleton style={styles.avatar} radius={999} />
        <View style={styles.postHeaderText}>
          <Skeleton style={styles.lineSm} />
          <Skeleton style={styles.lineXs} />
        </View>
      </View>
      <Skeleton style={styles.line} />
      <Skeleton style={styles.line} />
      <Skeleton style={styles.lineShort} />
    </View>
  );
}

export function SkeletonRow() {
  return (
    <View style={styles.row}>
      <Skeleton style={styles.avatarMd} radius={999} />
      <View style={styles.rowText}>
        <Skeleton style={styles.lineSm} />
        <Skeleton style={styles.lineXs} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  post: {
    padding: 20,
    borderRadius: radii.xl,
    backgroundColor: "transparent",
    marginBottom: 16,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  postHeaderText: {
    flex: 1,
    gap: 8,
  },
  avatar: {
    width: 40,
    height: 40,
  },
  avatarMd: {
    width: 40,
    height: 40,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  rowText: {
    flex: 1,
    gap: 8,
  },
  line: {
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  lineShort: {
    height: 12,
    width: "65%",
    borderRadius: 6,
  },
  lineSm: {
    height: 12,
    width: 120,
    borderRadius: 6,
  },
  lineXs: {
    height: 10,
    width: 80,
    borderRadius: 5,
  },
});
