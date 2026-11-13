import { Platform } from "react-native";

const DEFAULT_HOST =
  Platform.OS === "android" ? "10.0.2.2:3000" : "localhost:3000";

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? `http://${DEFAULT_HOST}`;
