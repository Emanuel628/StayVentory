import { KeyRound, Mail, ShieldCheck, UserRound } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/src/components/Screen';
import { SectionTitle } from '@/src/components/SectionTitle';
import { cleanerAccess } from '@/src/data/mock';
import { colors, radius, space, type } from '@/src/theme/theme';

export default function CleanerAccessScreen() {
  return (
    <Screen eyebrow="Cleaners" title="Owner invite access">
      <View style={styles.section}>
        <SectionTitle>How it works</SectionTitle>
        <View style={styles.noteBlock}>
          <Text style={type.noteBody}>
            Cleaners make their own cleaner account. Owners invite them by email or username, assign specific
            properties, and share a one-time access code.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <SectionTitle>Assigned cleaners</SectionTitle>
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
            <View style={styles.detailRow}>
              <KeyRound color={colors.teal} size={14} strokeWidth={1.75} />
              <Text style={styles.code}>{cleaner.code}</Text>
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
  meta: {
    ...type.bodySmallMuted,
    color: colors.inkBody,
  },
  code: {
    ...type.mono,
    color: colors.teal,
  },
});
