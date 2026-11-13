import type { ReactNode } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  type TextInputProps,
} from "react-native";
import { Icon, type IconName } from "./Icon";
import { useTheme } from "@/lib/theme";
import { fonts, radii } from "@/theme";

interface InputProps extends TextInputProps {
  label?: string;
  icon?: IconName;
  right?: ReactNode;
}

export function Input({ label, icon, right, style, ...props }: InputProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.wrap}>
      {label ? (
        <Text style={[styles.label, { color: colors.inkSoft }]}>{label}</Text>
      ) : null}
      <View style={[styles.row, { backgroundColor: colors.muted }]}>
        {icon ? (
          <Icon name={icon} size={16} color={colors.inkMute} />
        ) : null}
        <TextInput
          {...props}
          placeholderTextColor={colors.inkMute}
          style={[styles.input, { color: colors.ink }, style]}
        />
        {right}
      </View>
    </View>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: colors.inkSoft }]}>{label}</Text>
      <View style={[styles.row, { backgroundColor: colors.muted }]}>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder="Select..."
          placeholderTextColor={colors.inkMute}
          style={[styles.input, { color: colors.ink }]}
          autoCorrect={false}
          autoCapitalize="words"
        />
      </View>
      <View style={styles.chips}>
        {options.map((opt) => {
          const selected = opt === value;
          return (
            <Text
              key={opt}
              onPress={() => onChange(selected ? "" : opt)}
              accessibilityRole="button"
              style={[
                styles.chip,
                {
                  backgroundColor: selected ? colors.accent : colors.muted,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: selected ? colors.onAccent : colors.inkSoft },
                ]}
              >
                {opt}
              </Text>
            </Text>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 16,
  },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: radii.pill,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 44,
    textAlignVertical: "center",
    borderRadius: radii.pill,
    overflow: "hidden",
  },
  chipText: {
    fontFamily: fonts.semibold,
    fontSize: 12,
  },
});
