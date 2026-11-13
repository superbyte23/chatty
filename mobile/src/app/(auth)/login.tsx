import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Link } from "expo-router";
import { AuthShell } from "@/components/AuthShell";
import { Input } from "@/components/Input";
import { Icon } from "@/components/Icon";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { fonts, radii, spacing } from "@/theme";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const doSignIn = async (emailToUse: string, passwordToUse: string) => {
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      await signIn(emailToUse.trim().toLowerCase(), passwordToUse);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not reach KCC Chat. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <AuthShell>
        <Text style={[styles.title, { color: colors.ink }]}>Welcome back</Text>
        <Text style={[styles.subtitle, { color: colors.inkMute }]}>
          Sign in to KCC Chat to continue.
        </Text>

        <View style={styles.form}>
          {error ? (
            <View style={[styles.errorBanner, { backgroundColor: colors.dangerSoft }]}>
              <Text style={[styles.errorText, { color: colors.danger }]}>
                {error}
              </Text>
            </View>
          ) : null}

          <Input
            label="Email"
            icon="mail"
            value={email}
            onChangeText={setEmail}
            placeholder="you@kcc.edu"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Input
            label="Password"
            icon="lock"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry={!showPassword}
            right={
              <Pressable
                onPress={() => setShowPassword((v) => !v)}
                accessibilityRole="button"
                accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                hitSlop={8}
              >
                <Icon
                  name={showPassword ? "eyeOff" : "eye"}
                  size={16}
                  color={colors.inkMute}
                />
              </Pressable>
            }
          />

          <Pressable
            onPress={() => doSignIn(email, password)}
            disabled={loading || !email.trim() || !password}
            accessibilityRole="button"
            accessibilityLabel="Sign in"
            style={({ pressed }) => [
              styles.signInButton,
              { backgroundColor: colors.accent },
              (loading || !email.trim() || !password) && styles.disabled,
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text style={[styles.signInText, { color: colors.onAccent }]}>
              {loading ? "Signing in..." : "Sign In"}
            </Text>
          </Pressable>
        </View>

        <View style={[styles.demoRow, { backgroundColor: colors.accentSoft }]}>
          <View style={styles.demoTextWrap}>
            <Icon name="sparkles" size={16} color={colors.accent} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.demoTitle, { color: colors.accent }]}>
                Explore the demo
              </Text>
              <Text style={[styles.demoSub, { color: colors.inkSoft }]}>
                Sign in as Alex to see the live KCC community.
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => doSignIn("alex@kcc.edu", "password123")}
            disabled={loading}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.demoButton,
              { backgroundColor: colors.elevated, borderColor: colors.line },
              pressed && { opacity: 0.8 },
            ]}
          >
            <Text style={[styles.demoButtonText, { color: colors.inkSoft }]}>
              Use demo
            </Text>
          </Pressable>
        </View>

        <Text style={[styles.footer, { color: colors.inkMute }]}>
          Don&apos;t have an account?{" "}
          <Link href="/register" style={[styles.link, { color: colors.accent }]}>
            Sign Up
          </Link>
        </Text>
      </AuthShell>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.semibold,
    fontSize: 22,
    letterSpacing: -0.4,
  },
  subtitle: {
    marginTop: 4,
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  form: {
    marginTop: spacing.xl,
  },
  errorBanner: {
    borderRadius: radii.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  errorText: {
    fontFamily: fonts.regular,
    fontSize: 13,
  },
  signInButton: {
    marginTop: spacing.sm,
    minHeight: 50,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  signInText: {
    fontFamily: fonts.semibold,
    fontSize: 15,
  },
  disabled: {
    opacity: 0.45,
  },
  demoRow: {
    marginTop: spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderRadius: radii.xl,
    padding: spacing.lg,
  },
  demoTextWrap: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    flex: 1,
  },
  demoTitle: {
    fontFamily: fonts.semibold,
    fontSize: 12,
  },
  demoSub: {
    fontFamily: fonts.regular,
    fontSize: 11,
    marginTop: 2,
  },
  demoButton: {
    borderRadius: radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  demoButtonText: {
    fontFamily: fonts.semibold,
    fontSize: 12,
  },
  footer: {
    marginTop: spacing.xl,
    textAlign: "center",
    fontFamily: fonts.regular,
    fontSize: 13,
  },
  link: {
    fontFamily: fonts.semibold,
  },
});
