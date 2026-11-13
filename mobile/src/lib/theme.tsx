import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useColorScheme } from "react-native";
import { palette, type ThemeColors, type ThemeMode } from "@/theme";
import { getStoredTheme, setStoredTheme } from "./storage";

interface ThemeContextValue {
  mode: ThemeMode;
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: "light",
  colors: palette.light,
  setMode: () => {},
  toggleMode: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>("light");

  useEffect(() => {
    let active = true;
    getStoredTheme().then((stored) => {
      if (!active) return;
      setModeState(stored ?? (systemScheme === "dark" ? "dark" : "light"));
    });
    return () => {
      active = false;
    };
  }, [systemScheme]);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    void setStoredTheme(next);
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      void setStoredTheme(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ mode, colors: palette[mode], setMode, toggleMode }),
    [mode, setMode, toggleMode]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
