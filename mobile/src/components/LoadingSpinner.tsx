import { View, StyleSheet } from "react-native";
import { Skeleton } from "./Skeleton";
import { useTheme } from "@/lib/theme";

/**
 * Skeleton loaders replace every spinner in the app.
 */
export function LoadingSpinner({ size = "small" }: { size?: "small" | "large" }) {
  const { colors } = useTheme();

  if (size === "large") {
    return (
      <View style={styles.wrap}>
        <Skeleton style={styles.large} radius={10} />
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <Skeleton style={styles.small} radius={8} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  large: {
    width: 220,
    height: 14,
    backgroundColor: "transparent",
  },
  small: {
    width: 140,
    height: 12,
    backgroundColor: "transparent",
  },
});
