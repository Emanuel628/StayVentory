import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, radius, space, type } from '@/src/theme/theme';

type AuthFieldProps = {
  label: string;
  value: string;
  onChangeText?: (value: string) => void;
  placeholder?: string;
  hint?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  keyboardType?: KeyboardTypeOptions;
  inputMode?: 'text' | 'email' | 'numeric' | 'decimal' | 'search' | 'tel' | 'url';
  editable?: boolean;
};

export function AuthField({
  label,
  value,
  onChangeText,
  placeholder,
  hint,
  secureTextEntry,
  autoCapitalize = 'none',
  autoCorrect = false,
  keyboardType,
  inputMode,
  editable = true,
}: AuthFieldProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.inkMuted}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        keyboardType={keyboardType}
        inputMode={inputMode}
        editable={editable}
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
