import { Pressable } from "react-native";
import { Icon } from "./Icon";
import { useTheme } from "@/lib/theme";

export function ThemeToggle() {
  const { mode, toggleMode, colors } = useTheme();

  return (
    <Pressable
      onPress={toggleMode}
      accessibilityRole="button"
      accessibilityLabel="Toggle dark mode"
      hitSlop={8}
      style={({ pressed }) => [
        {
          width: 44,
          height: 44,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 999,
          opacity: pressed ? 0.6 : 1,
        },
      ]}
    >
      <Icon
        name={mode === "dark" ? "moon" : "sun"}
        size={20}
        color={mode === "dark" ? colors.ink : colors.inkSoft}
      />
    </Pressable>
  );
}
