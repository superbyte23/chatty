import type { ReactNode } from "react";
import Svg, { Path, Circle, Rect, G } from "react-native-svg";

export type IconName =
  | "home"
  | "compass"
  | "message"
  | "bell"
  | "user"
  | "users"
  | "settings"
  | "heart"
  | "comment"
  | "send"
  | "menu"
  | "x"
  | "image"
  | "paperclip"
  | "logout"
  | "edit"
  | "trash"
  | "chevronLeft"
  | "chevronDown"
  | "check"
  | "sparkles"
  | "arrowRight"
  | "mail"
  | "lock"
  | "gradCap"
  | "plus"
  | "search"
  | "eye"
  | "eyeOff"
  | "dots"
  | "sun"
  | "moon"
  | "hash"
  | "trending"
  | "share"
  | "bookmark"
  | "grid";

/**
 * Every icon is drawn on the same 24x24 grid with a single 1.5px stroke,
 * round caps and round joins.
 */
const icons: Record<IconName, ReactNode> = {
  home: (
    <>
      <Path d="M3 10.5 12 3l9 7.5" />
      <Path d="M5 9.5V21h14V9.5" />
      <Path d="M9 21v-6h6v6" />
    </>
  ),
  compass: (
    <>
      <Circle cx="12" cy="12" r="9" />
      <Path d="m15.5 8.5-2 5-5 2 2-5z" />
    </>
  ),
  message: <Path d="M21 12a8 8 0 0 1-8 8H4l2.4-2.9A8 8 0 1 1 21 12z" />,
  bell: (
    <>
      <Path d="M6 8a6 6 0 0 1 12 0c0 7 2.5 8.5 2.5 8.5h-17S6 15 6 8" />
      <Path d="M10 21a2 2 0 0 0 4 0" />
    </>
  ),
  user: (
    <>
      <Circle cx="12" cy="8" r="4" />
      <Path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" />
    </>
  ),
  users: (
    <>
      <Circle cx="9" cy="8" r="3.5" />
      <Path d="M2.5 20c0-3.5 3-5.5 6.5-5.5s6.5 2 6.5 5.5" />
      <Path d="M16 4.6a3.5 3.5 0 0 1 0 6.8" />
      <Path d="M17.5 14.9c2 .7 4 2.2 4 5.1" />
    </>
  ),
  settings: (
    <>
      <Circle cx="12" cy="12" r="3" />
      <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </>
  ),
  heart: (
    <Path d="M12 20.5C7 16 3.5 12.8 3.5 8.9 3.5 6.2 5.6 4 8.2 4c1.6 0 3 .8 3.8 2 .8-1.2 2.2-2 3.8-2 2.6 0 4.7 2.2 4.7 4.9 0 3.9-3.5 7.1-8.5 11.6z" />
  ),
  comment: <Path d="M21 15a2 2 0 0 1-2 2H8l-4.5 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z" />,
  send: (
    <>
      <Path d="m3 11 18-8-8 18-2.5-7.5z" />
      <Path d="M21 3 10.5 13.5" />
    </>
  ),
  menu: <Path d="M4 6h16M4 12h16M4 18h16" />,
  x: <Path d="M18 6 6 18M6 6l12 12" />,
  image: (
    <>
      <Rect x="3" y="4" width="18" height="16" rx="2" />
      <Circle cx="8.5" cy="9.5" r="1.5" />
      <Path d="m21 15-5-5-8 8" />
    </>
  ),
  paperclip: <Path d="m21 11.5-8.3 8.3a5 5 0 0 1-7.1-7.1L13 5.4a3.5 3.5 0 0 1 5 5L10.5 18a2 2 0 0 1-2.8-2.8l7.4-7.4" />,
  logout: (
    <>
      <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <Path d="m16 17 5-5-5-5" />
      <Path d="M21 12H9" />
    </>
  ),
  edit: (
    <>
      <Path d="M12 20h9" />
      <Path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
    </>
  ),
  trash: (
    <>
      <Path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <Path d="M10 11v6M14 11v6" />
    </>
  ),
  chevronLeft: <Path d="m15 18-6-6 6-6" />,
  chevronDown: <Path d="m6 9 6 6 6-6" />,
  check: <Path d="M20 6 9 17l-5-5" />,
  sparkles: (
    <>
      <Path d="M12 3l1.9 4.8L18.7 9.7l-4.8 1.9L12 16.4l-1.9-4.8L5.3 9.7l4.8-1.9z" />
      <Path d="M19 15l.9 2.3 2.3.9-2.3.9L19 21.4l-.9-2.3-2.3-.9 2.3-.9z" />
    </>
  ),
  arrowRight: <Path d="M5 12h14M12 5l7 7-7 7" />,
  mail: (
    <>
      <Rect x="3" y="5" width="18" height="14" rx="2" />
      <Path d="m3 7 9 6 9-6" />
    </>
  ),
  lock: (
    <>
      <Rect x="4" y="11" width="16" height="10" rx="2" />
      <Path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  gradCap: (
    <>
      <Path d="M22 9 12 4 2 9l10 5 10-5z" />
      <Path d="M6 11.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5" />
      <Path d="M22 9v5" />
    </>
  ),
  plus: <Path d="M12 5v14M5 12h14" />,
  search: (
    <>
      <Circle cx="11" cy="11" r="7" />
      <Path d="m21 21-4.3-4.3" />
    </>
  ),
  eye: (
    <>
      <Path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" />
      <Circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (
    <>
      <Path d="M17.9 17.9A10.7 10.7 0 0 1 12 19c-6.5 0-10-6-10-6a19.4 19.4 0 0 1 4.5-5.3" />
      <Path d="M9.9 4.2A10.3 10.3 0 0 1 12 4c6.5 0 10 6 10 6a19.6 19.6 0 0 1-2.2 3" />
      <Path d="M14.1 14.1a3 3 0 1 1-4.2-4.2" />
      <Path d="M4 4l16 16" />
    </>
  ),
  dots: (
    <>
      <Circle cx="12" cy="5" r="1.25" />
      <Circle cx="12" cy="12" r="1.25" />
      <Circle cx="12" cy="19" r="1.25" />
    </>
  ),
  sun: (
    <>
      <Circle cx="12" cy="12" r="4" />
      <Path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
    </>
  ),
  moon: <Path d="M20.5 14.6A8.6 8.6 0 0 1 9.4 3.5 8.6 8.6 0 1 0 20.5 14.6z" />,
  hash: <Path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" />,
  trending: (
    <>
      <Path d="M3 17l6-6 4 4 8-8" />
      <Path d="M15 7h6v6" />
    </>
  ),
  share: (
    <>
      <Path d="M4 12.5V19a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 20 19v-6.5" />
      <Path d="M12 15.5V3" />
      <Path d="m8 7 4-4 4 4" />
    </>
  ),
  bookmark: (
    <Path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4.2L6 21z" />
  ),
  grid: (
    <>
      <Rect x="3" y="3" width="7.5" height="7.5" rx="2" />
      <Rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
      <Rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
      <Rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
    </>
  ),
};

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  filled?: boolean;
  strokeWidth?: number;
}

export function Icon({
  name,
  size = 20,
  color = "#52525B",
  filled,
  strokeWidth = 1.5,
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? color : "none"}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <G>{icons[name]}</G>
    </Svg>
  );
}
