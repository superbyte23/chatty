import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/lib/theme";
import { fonts, radii } from "@/theme";

interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.wrap,
        { borderColor: colors.line, borderRadius: radii.xl },
      ]}
    >
      <View style={[styles.iconTile, { backgroundColor: colors.accentSoft }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={[styles.title, { color: colors.ink }]}>{title}</Text>
      {description ? (
        <Text style={[styles.description, { color: colors.inkMute }]}>
          {description}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 44,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  iconTile: {
    width: 56,
    height: 56,
    borderRadius: radii.xl,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  icon: {
    fontSize: 24,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    textAlign: "center",
  },
  description: {
    marginTop: 6,
    fontFamily: fonts.regular,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
  },
});
