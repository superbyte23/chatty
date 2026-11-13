/**
 * KCC Chat — design tokens (single source of truth)
 * ---------------------------------------------------------------------------
 * Every colour, radius, shadow, type step and motion curve used by the app is
 * declared here. Components must never hard-code a colour.
 *
 * Palette
 *   light  surface #FAFAFA  cards #FFFFFF
 *   dark   surface #0B0B0F  cards #15151B
 *   accent deep navy #001F3F — primary actions, active states, unread only
 */

export type ThemeMode = "light" | "dark";

export interface ThemeColors {
  /* Surfaces */
  surface: string;
  elevated: string;
  sunken: string;
  muted: string;

  /* Ink */
  ink: string;
  inkSoft: string;
  inkMute: string;

  /* Lines */
  line: string;
  lineSoft: string;

  /* Accent */
  accent: string;
  accentStrong: string;
  accent2: string;
  accentSoft: string;
  onAccent: string;

  /* Brand (theme independent) */
  brand: string;
  brand2: string;
  onBrand: string;

  /* Status */
  danger: string;
  dangerSoft: string;
  onDanger: string;
  success: string;
  successSoft: string;

  /* Translucent layers (top bar, bottom nav, modals, dropdowns) */
  glass: string;
  glassStrong: string;

  /* Elevation */
  shadowColor: string;
  shadowOpacity: number;
}

export const palette: Record<ThemeMode, ThemeColors> = {
  light: {
    surface: "#FAFAFA",
    elevated: "#FFFFFF",
    sunken: "#F4F4F5",
    muted: "#EEEEF1",

    ink: "#09090B",
    inkSoft: "#52525B",
    inkMute: "#8B8B96",

    line: "rgba(9,9,11,0.09)",
    lineSoft: "rgba(9,9,11,0.05)",

    accent: "#001F3F",
    accentStrong: "#002C56",
    accent2: "#1A5FA5",
    accentSoft: "rgba(0,31,63,0.08)",
    onAccent: "#FFFFFF",

    brand: "#001F3F",
    brand2: "#1A5FA5",
    onBrand: "#FFFFFF",

    danger: "#DC2626",
    dangerSoft: "rgba(220,38,38,0.08)",
    onDanger: "#FFFFFF",
    success: "#15803D",
    successSoft: "rgba(21,128,61,0.10)",

    glass: "rgba(255,255,255,0.74)",
    glassStrong: "rgba(255,255,255,0.92)",

    shadowColor: "#09090B",
    shadowOpacity: 0.06,
  },
  dark: {
    surface: "#0B0B0F",
    elevated: "#15151B",
    sunken: "#101014",
    muted: "#1D1D24",

    ink: "#F4F4F5",
    inkSoft: "#A1A1AA",
    inkMute: "#71717A",

    line: "rgba(255,255,255,0.11)",
    lineSoft: "rgba(255,255,255,0.06)",

    accent: "#6AA6DC",
    accentStrong: "#8DBDE8",
    accent2: "#4A86C8",
    accentSoft: "rgba(106,166,220,0.16)",
    onAccent: "#00162E",

    brand: "#001F3F",
    brand2: "#1A5FA5",
    onBrand: "#FFFFFF",

    danger: "#F87171",
    dangerSoft: "rgba(248,113,113,0.12)",
    onDanger: "#FFFFFF",
    success: "#4ADE80",
    successSoft: "rgba(74,222,128,0.12)",

    glass: "rgba(21,21,27,0.72)",
    glassStrong: "rgba(21,21,27,0.92)",

    shadowColor: "#000000",
    shadowOpacity: 0.5,
  },
};

/** One geometric sans, weights 400 and 600 only. */
export const fonts = {
  regular: "Inter_400Regular",
  semibold: "Inter_600SemiBold",
} as const;

/** Type scale — four steps. */
export const type = {
  xs: { fontSize: 11, lineHeight: 16 },
  sm: { fontSize: 13, lineHeight: 19 },
  base: { fontSize: 15, lineHeight: 24 },
  lg: { fontSize: 17, lineHeight: 24 },
  xl: { fontSize: 21, lineHeight: 28 },
} as const;

export const radii = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

/** Motion: 150–250ms ease-out. */
export const motion = {
  fast: 150,
  base: 200,
  slow: 250,
} as const;

/** Soft layered elevation. */
export function softShadow(colors: ThemeColors, level: "card" | "float" | "pop") {
  const presets = {
    card: { radius: 12, offset: 4, elevation: 2 },
    float: { radius: 18, offset: 8, elevation: 6 },
    pop: { radius: 26, offset: 12, elevation: 10 },
  } as const;
  const p = presets[level];
  return {
    shadowColor: colors.shadowColor,
    shadowOpacity: colors.shadowOpacity,
    shadowRadius: p.radius,
    shadowOffset: { width: 0, height: p.offset },
    elevation: p.elevation,
  };
}

/** Minimum interactive size, per WCAG / platform guidance. */
export const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 } as const;
export const MIN_TOUCH = 44;
