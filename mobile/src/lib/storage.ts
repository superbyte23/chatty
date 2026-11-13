import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "kcc_token";

const webStore: { [key: string]: string } = {};

async function secureSet(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

async function secureGet(key: string): Promise<string | null> {
  return SecureStore.getItemAsync(key);
}

async function secureDelete(key: string) {
  await SecureStore.deleteItemAsync(key);
}

function webSet(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    webStore[key] = value;
  }
}

function webGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return webStore[key] ?? null;
  }
}

function webDelete(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    delete webStore[key];
  }
}

const isWeb = Platform.OS === "web";

export async function getStoredToken(): Promise<string | null> {
  try {
    return isWeb ? webGet(TOKEN_KEY) : await secureGet(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function setStoredToken(token: string) {
  try {
    if (isWeb) webSet(TOKEN_KEY, token);
    else await secureSet(TOKEN_KEY, token);
  } catch {
    // ignore storage errors; session just won't persist
  }
}

export async function clearStoredToken() {
  try {
    if (isWeb) webDelete(TOKEN_KEY);
    else await secureDelete(TOKEN_KEY);
  } catch {
    // ignore
  }
}

/* ---------------------------------------------------------------------------
 * Theme preference
   ------------------------------------------------------------------------- */

const THEME_KEY = "kcc_theme";

export async function getStoredTheme(): Promise<"light" | "dark" | null> {
  try {
    const value = isWeb
      ? webGet(THEME_KEY)
      : await secureGet(THEME_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

export async function setStoredTheme(mode: "light" | "dark") {
  try {
    if (isWeb) webSet(THEME_KEY, mode);
    else await secureSet(THEME_KEY, mode);
  } catch {
    // ignore storage errors; the preference just won't persist
  }
}
