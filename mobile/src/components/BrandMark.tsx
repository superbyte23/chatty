import { View, StyleSheet } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/lib/theme";

interface BrandMarkProps {
  size?: number;
}

export function BrandMark({ size = 36 }: BrandMarkProps) {
  const { colors } = useTheme();

  return (
    <LinearGradient
      colors={[colors.brand, colors.brand2]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.box, { width: size, height: size, borderRadius: size * 0.32 }]}
    >
      <Svg
        width={size * 0.58}
        height={size * 0.58}
        viewBox="0 0 24 24"
        fill="none"
      >
        <Path
          d="M4 6.5h16v11H9.5L4.5 20.6V17.5H4z"
          stroke={colors.onBrand}
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
        <Circle cx="8.6" cy="11.6" r="1" fill={colors.onBrand} />
        <Circle cx="12" cy="11.6" r="1" fill={colors.onBrand} />
        <Circle cx="15.4" cy="11.6" r="1" fill={colors.onBrand} />
      </Svg>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: "center",
    justifyContent: "center",
  },
});
