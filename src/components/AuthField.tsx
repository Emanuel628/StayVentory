import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, radius, space, type } from '@/src/theme/theme';

type AuthFieldProps = {
  label: string;
  value: string;
  hint?: string;
};

export function AuthField({ label, value, hint }: AuthFieldProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={value}
        placeholderTextColor={colors.inkMuted}
      />
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: space.xs,
  },
  label: {
    ...type.eyebrow,
    color: colors.ink,
  },
  input: {
    minHeight: 46,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.hairline,
    paddingHorizontal: space.md,
    backgroundColor: colors.paper,
    ...type.body,
    color: colors.inkBody,
  },
  hint: {
    ...type.bodySmallMuted,
    color: colors.inkBody,
  },
});
