import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { Icon } from "@/components/Icon";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SelectField } from "@/components/Input";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { api, type SessionUser } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { confirmAsync } from "@/lib/ui";
import { useTheme } from "@/lib/theme";
import { fonts, radii, softShadow, spacing } from "@/theme";

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

export default function SettingsScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { colors } = useTheme();

  const [form, setForm] = useState({
    name: "",
    bio: "",
    department: "",
    year: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || "",
      bio: user.bio || "",
      department: user.department || "",
      year: user.year || "",
    });
    setLoading(false);
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSaved(false);
    try {
      await api.updateProfile(user.id, {
        name: form.name,
        bio: form.bio,
        department: form.department,
        year: form.year,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    const ok = await confirmAsync("Sign out?", "You'll need to sign back in.");
    if (!ok) return;
    await signOut();
    router.replace("/login");
  };

  if (loading)
    return (
      <Screen back title="Settings" subtitle="Account & profile">
        <LoadingSpinner size="large" />
      </Screen>
    );

  return (
    <Screen back title="Settings" subtitle={user ? `${user.email}` : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Profile */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.elevated,
              borderColor: colors.lineSoft,
              ...softShadow(colors, "card"),
            },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.ink }]}>Profile</Text>
          <Text style={[styles.cardSub, { color: colors.inkMute }]}>
            Update your public profile information.
          </Text>

          {saved && (
            <View style={[styles.savedBanner, { backgroundColor: colors.successSoft }]}>
              <Icon name="check" size={16} color={colors.success} />
              <Text style={[styles.savedText, { color: colors.success }]}>
                Profile updated successfully!
              </Text>
            </View>
          )}

          <Text style={[styles.label, { color: colors.inkSoft }]}>Full Name</Text>
          <TextInput
            value={form.name}
            onChangeText={(v) => setForm({ ...form, name: v })}
            placeholder="Your name"
            placeholderTextColor={colors.inkMute}
            accessibilityLabel="Full name"
            style={[
              styles.input,
              {
                color: colors.ink,
                backgroundColor: colors.muted,
              },
            ]}
          />

          <Text style={[styles.label, { color: colors.inkSoft }]}>Bio</Text>
          <TextInput
            value={form.bio}
            onChangeText={(v) => setForm({ ...form, bio: v })}
            placeholder="Tell us about yourself..."
            placeholderTextColor={colors.inkMute}
            accessibilityLabel="Bio"
            style={[
              styles.input,
              styles.bioInput,
              {
                color: colors.ink,
                backgroundColor: colors.muted,
              },
            ]}
            multiline
          />

          <SelectField
            label="Department"
            value={form.department}
            onChange={(v) => setForm({ ...form, department: v })}
            options={departments}
          />

          <SelectField
            label="Year"
            value={form.year}
            onChange={(v) => setForm({ ...form, year: v })}
            options={years}
          />

          <Pressable
            onPress={handleSave}
            disabled={saving}
            accessibilityRole="button"
            accessibilityLabel="Save changes"
            style={({ pressed }) => [
              styles.saveButton,
              { backgroundColor: colors.accent },
              saving && { opacity: 0.6 },
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text style={[styles.saveText, { color: colors.onAccent }]}>
              {saving ? "Saving..." : "Save Changes"}
            </Text>
          </Pressable>
        </View>

        {/* Appearance */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.elevated,
              borderColor: colors.lineSoft,
              ...softShadow(colors, "card"),
            },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.ink }]}>
            Appearance
          </Text>
          <Text style={[styles.cardSub, { color: colors.inkMute }]}>
            Choose how KCC Chat looks on this device.
          </Text>
          <View style={[styles.appearanceRow, { backgroundColor: colors.muted }]}>
            <View style={styles.appearanceText}>
              <Text style={[styles.appearanceTitle, { color: colors.ink }]}>
                Dark mode
              </Text>
              <Text style={[styles.appearanceSub, { color: colors.inkMute }]}>
                Follows your system by default.
              </Text>
            </View>
            <ThemeToggle />
          </View>
        </View>

        {/* Account */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.elevated,
              borderColor: colors.lineSoft,
              ...softShadow(colors, "card"),
            },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.ink }]}>Account</Text>
          <Pressable
            onPress={handleLogout}
            accessibilityRole="button"
            accessibilityLabel="Sign out"
            style={({ pressed }) => [
              styles.logoutButton,
              { backgroundColor: colors.dangerSoft },
              pressed && { opacity: 0.75 },
            ]}
          >
            <Icon name="logout" size={16} color={colors.danger} />
            <Text style={[styles.logoutText, { color: colors.danger }]}>
              Sign out of your account
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  card: {
    borderRadius: radii.xl,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  cardTitle: {
    fontFamily: fonts.semibold,
    fontSize: 17,
  },
  cardSub: {
    fontFamily: fonts.regular,
    fontSize: 13,
    marginTop: 2,
    marginBottom: spacing.lg,
  },
  savedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  savedText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
  },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    letterSpacing: 0.2,
    marginBottom: 6,
  },
  input: {
    borderRadius: radii.pill,
    paddingHorizontal: 16,
    minHeight: 48,
    fontFamily: fonts.regular,
    fontSize: 14,
    marginBottom: spacing.lg,
  },
  bioInput: {
    minHeight: 88,
    paddingTop: 14,
    borderRadius: radii.lg,
    textAlignVertical: "top",
  },
  saveButton: {
    minHeight: 48,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.xs,
  },
  saveText: {
    fontFamily: fonts.semibold,
    fontSize: 14,
  },
  appearanceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: radii.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  appearanceText: {
    flex: 1,
  },
  appearanceTitle: {
    fontFamily: fonts.semibold,
    fontSize: 14,
  },
  appearanceSub: {
    fontFamily: fonts.regular,
    fontSize: 12,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: radii.lg,
    padding: spacing.lg,
    minHeight: 48,
  },
  logoutText: {
    fontFamily: fonts.semibold,
    fontSize: 14,
  },
});
