import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/lib/theme";
import { fonts } from "@/theme";

const sizes = {
  sm: 32,
  md: 40,
  lg: 48,
  xl: 80,
} as const;

const fontSize: Record<keyof typeof sizes, number> = {
  sm: 11,
  md: 13,
  lg: 15,
  xl: 26,
};

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: keyof typeof sizes;
  isOnline?: boolean | null;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Avatar({ name, src, size = "md", isOnline }: AvatarProps) {
  const { colors } = useTheme();
  const dim = sizes[size];
  const ring = size === "xl" ? 4 : 2;
  const gap = size === "xl" ? 4 : 2;

  return (
    <View style={{ width: dim + ring * 2, height: dim + ring * 2 }}>
      {/* Gradient ring */}
      <LinearGradient
        colors={[colors.accent, colors.accent2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={[
          styles.core,
          {
            width: dim,
            height: dim,
            borderRadius: dim,
            margin: ring,
            backgroundColor: colors.elevated,
            padding: gap,
          },
        ]}
      >
        {src ? (
          <Image
            source={{ uri: src }}
            style={{ width: dim - gap * 2, height: dim - gap * 2, borderRadius: dim }}
            contentFit="cover"
            transition={150}
          />
        ) : (
          <LinearGradient
            colors={[colors.accent, colors.accent2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.gradient,
              {
                width: dim - gap * 2,
                height: dim - gap * 2,
                borderRadius: dim,
              },
            ]}
          >
            <Text
              style={[
                styles.initials,
                {
                  fontSize: fontSize[size],
                  color: colors.onAccent,
                },
              ]}
            >
              {getInitials(name)}
            </Text>
          </LinearGradient>
        )}
      </View>

      {isOnline !== undefined && isOnline !== null && (
        <View
          style={[
            styles.dot,
            {
              width: Math.max(10, dim / 4),
              height: Math.max(10, dim / 4),
              borderRadius: 999,
              borderColor: colors.elevated,
              backgroundColor: isOnline ? colors.success : colors.inkMute,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  core: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  gradient: {
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontFamily: fonts.semibold,
  },
  dot: {
    position: "absolute",
    right: 0,
    bottom: 0,
    borderWidth: 2,
  },
});
