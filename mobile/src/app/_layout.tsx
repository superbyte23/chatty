import { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import {
  Inter_400Regular,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { AuthProvider, useAuth } from "@/lib/auth";
import { NotificationsProvider } from "@/lib/notifications";
import { ThemeProvider, useTheme } from "@/lib/theme";
import { LoadingSpinner } from "@/components/LoadingSpinner";

function AuthGuard() {
  const { status } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    const inAuthGroup = segments[0] === "(auth)";

    if (!inAuthGroup && status === "unauthenticated") {
      router.replace("/login");
    } else if (inAuthGroup && status === "authenticated") {
      router.replace("/");
    }
  }, [status, segments, router]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

function ThemedApp() {
  const { mode, colors } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: colors.surface }]}>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <AuthGuard />
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <LoadingSpinner size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <NotificationsProvider>
            <ThemedApp />
          </NotificationsProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAFAFA",
  },
});
