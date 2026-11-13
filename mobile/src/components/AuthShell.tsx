import type { ReactNode } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BrandMark } from "./BrandMark";
import { useTheme } from "@/lib/theme";
import { fonts, radii, softShadow, spacing } from "@/theme";

export function AuthShell({ children }: { children: ReactNode }) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <View style={styles.brandRow}>
          <BrandMark size={44} />
          <Text style={[styles.brandName, { color: colors.ink }]}>KCC Chat</Text>
          <Text style={[styles.brandSub, { color: colors.inkMute }]}>
            Kingsborough Community College
          </Text>
        </View>
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
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.xxl,
    paddingVertical: 32,
  },
  brandRow: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  brandName: {
    marginTop: 10,
    fontFamily: fonts.semibold,
    fontSize: 22,
    letterSpacing: -0.4,
  },
  brandSub: {
    marginTop: 2,
    fontFamily: fonts.regular,
    fontSize: 12,
  },
  card: {
    borderRadius: radii.xxl,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.xxl,
  },
});
