import { Link } from 'expo-router';
import { ChevronRight, KeyRound, Mail, ShieldCheck, UserRound } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/src/components/Screen';
import { SectionTitle } from '@/src/components/SectionTitle';
import { cleanerAccess } from '@/src/data/mock';
import { colors, radius, space, type } from '@/src/theme/theme';

export function CleanerAccessScreen() {
  return (
    <Screen eyebrow="Property Team" title="Owner invite access">
      <View style={styles.section}>
        <SectionTitle>How it works</SectionTitle>
        <View style={styles.noteBlock}>
          <Text style={type.noteBody}>
            Property team members make their own account. Owners invite them by email or username, assign specific
            properties, and generate a one-time access code when they want to grant access.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <SectionTitle>Assigned property team</SectionTitle>
        {cleanerAccess.map((cleaner) => (
          <View key={cleaner.id} style={styles.cleanerBlock}>
            <Text style={styles.name}>{cleaner.name}</Text>
            <View style={styles.detailRow}>
              <Mail color={colors.inkMuted} size={14} strokeWidth={1.75} />
              <Text style={styles.meta}>{cleaner.email}</Text>
            </View>
            <View style={styles.detailRow}>
              <UserRound color={colors.inkMuted} size={14} strokeWidth={1.75} />
              <Text style={styles.meta}>{cleaner.username}</Text>
            </View>
            <Link href="/give-access" asChild>
              <Pressable style={styles.linkRow}>
                <View style={styles.detailRow}>
                  <KeyRound color={colors.teal} size={14} strokeWidth={1.75} />
                  <Text style={styles.linkText}>Generate access code</Text>
                </View>
                <ChevronRight color={colors.inkMuted} size={16} strokeWidth={1.75} />
              </Pressable>
            </Link>
            <View style={styles.codeShelf}>
              <Text style={styles.codeLabel}>Active one-time code</Text>
              <Text style={styles.codePlaceholder}>No active code yet.</Text>
            </View>
            <View style={styles.detailRow}>
              <ShieldCheck color={colors.ochre} size={14} strokeWidth={1.75} />
              <Text style={styles.meta}>{cleaner.properties.join(', ')}</Text>
            </View>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: space.md,
  },
  noteBlock: {
    backgroundColor: colors.paperRaised,
    borderRadius: radius.control,
    padding: space.md,
  },
  cleanerBlock: {
    paddingVertical: space.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
    gap: space.xs,
  },
  name: {
    ...type.houseName,
    color: colors.ink,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  linkRow: {
    paddingVertical: space.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
  },
  linkText: {
    ...type.buttonLabel,
    color: colors.teal,
  },
  meta: {
    ...type.bodySmallMuted,
    color: colors.inkBody,
  },
  codeShelf: {
    backgroundColor: colors.paperRaised,
    borderRadius: radius.control,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
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
});
