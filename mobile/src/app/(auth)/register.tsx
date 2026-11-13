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
import { Input, SelectField } from "@/components/Input";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { fonts, radii, spacing } from "@/theme";

const departments = [
  "Computer Science",
  "Biology",
  "Business Administration",
  "Mathematics",
  "Music",
  "English",
  "Art & Design",
  "Psychology",
  "Engineering",
  "Chemistry",
  "Physics",
  "History",
  "Nursing",
  "Communications",
];

const years = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"];

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const { colors } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in your name, email, and password.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await signUp({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        department,
        year,
      });
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Something went wrong. Please try again."
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
        <Text style={[styles.title, { color: colors.ink }]}>Join KCC Chat</Text>
        <Text style={[styles.subtitle, { color: colors.inkMute }]}>
          Create your student account in under a minute.
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
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="Alex Johnson"
            autoCapitalize="words"
          />

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

          <SelectField
            label="Department"
            value={department}
            onChange={setDepartment}
            options={departments}
          />

          <SelectField
            label="Year"
            value={year}
            onChange={setYear}
            options={years}
          />

          <Input
            label="Password"
            icon="lock"
            value={password}
            onChangeText={setPassword}
            placeholder="At least 6 characters"
            secureTextEntry
          />

          <Input
            label="Confirm Password"
            icon="lock"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Repeat password"
            secureTextEntry
          />

          <Pressable
            onPress={handleSubmit}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Create account"
            style={({ pressed }) => [
              styles.createButton,
              { backgroundColor: colors.accent },
              loading && styles.disabled,
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text style={[styles.createText, { color: colors.onAccent }]}>
              {loading ? "Creating Account..." : "Create Account"}
            </Text>
          </Pressable>
        </View>

        <Text style={[styles.footer, { color: colors.inkMute }]}>
          Already have an account?{" "}
          <Link href="/login" style={[styles.link, { color: colors.accent }]}>
            Sign In
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
  createButton: {
    marginTop: spacing.sm,
    minHeight: 50,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  createText: {
    fontFamily: fonts.semibold,
    fontSize: 15,
  },
  disabled: {
    opacity: 0.45,
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
