import { KeyRound, Mail, ShieldCheck } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Screen } from '@/src/components/Screen';
import { SectionTitle } from '@/src/components/SectionTitle';
import { colors, radius, space, type } from '@/src/theme/theme';

export default function GiveAccessScreen() {
  return (
    <Screen eyebrow="Access" title="Give property access" backHref="/cleaners" backLabel="Back to team">
      <View style={styles.section}>
        <SectionTitle>Invite property team</SectionTitle>
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="teammember@example.com"
            placeholderTextColor={colors.inkMuted}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>

      <View style={styles.section}>
        <SectionTitle>Access code</SectionTitle>
        <View style={styles.actionRow}>
          <View style={styles.actionLeft}>
            <KeyRound color={colors.teal} size={16} strokeWidth={1.75} />
            <Text style={styles.actionLabel}>Generate access code</Text>
          </View>
          <Text style={styles.actionLink}>Generate</Text>
        </View>

        <View style={styles.codeShelf}>
          <Text style={styles.codeLabel}>Generated code</Text>
          <Text style={styles.codePlaceholder}>A new one-time code will appear here after you generate it.</Text>
        </View>
      </View>

      <View style={styles.noteBlock}>
        <ShieldCheck color={colors.ochre} size={16} strokeWidth={1.75} />
        <Text style={styles.noteText}>
          Owners generate a new one-time string each time they want to grant access to a property team member.
        </Text>
      </View>

      <Pressable style={styles.sendButton}>
        <Text style={styles.sendLabel}>Send</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: space.md,
  },
  formField: {
    backgroundColor: colors.paperRaised,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.control,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    gap: 2,
  },
  fieldLabel: {
    ...type.eyebrow,
    color: colors.ink,
  },
  input: {
    minHeight: 44,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.hairline,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    backgroundColor: colors.paper,
    ...type.body,
    color: colors.inkBody,
  },
  actionRow: {
    paddingVertical: space.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  actionLabel: {
    ...type.body,
    color: colors.ink,
  },
  actionLink: {
    ...type.buttonLabel,
    color: colors.teal,
  },
  codeShelf: {
    backgroundColor: colors.paperRaised,
    borderRadius: radius.control,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    gap: 2,
  },
  codeLabel: {
    ...type.eyebrow,
    color: colors.inkMuted,
  },
  codePlaceholder: {
    ...type.bodySmallMuted,
    color: colors.inkBody,
  },
  noteBlock: {
    backgroundColor: colors.paperRaised,
    borderRadius: radius.control,
    padding: space.md,
    gap: space.sm,
  },
  noteText: {
    ...type.noteBody,
    color: colors.inkBody,
  },
  sendButton: {
    minHeight: 46,
    borderRadius: radius.control,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.lg,
  },
  sendLabel: {
    ...type.buttonLabel,
    color: colors.buttonPrimaryText,
  },
});
