import { Href, Link } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/src/components/Screen';
import { SectionTitle } from '@/src/components/SectionTitle';
import { colors, space, type } from '@/src/theme/theme';

const rows: { label: string; href: Href }[] = [
  { label: 'Profile', href: '/settings' },
  { label: 'House playbook', href: '/settings' },
  { label: 'Cleaner access', href: '/cleaners' },
  { label: 'Notifications', href: '/settings' },
  { label: 'Design lock', href: '/settings' },
];

export default function SettingsScreen() {
  return (
    <Screen eyebrow="Settings" title="System controls">
      <View style={styles.section}>
        <SectionTitle>Account</SectionTitle>
        {rows.map((row) => (
          <Link key={row.label} href={row.href} asChild>
            <Pressable style={styles.settingRow}>
              <Text style={styles.settingLabel}>{row.label}</Text>
              <ChevronRight color={colors.inkMuted} size={18} strokeWidth={1.75} />
            </Pressable>
          </Link>
        ))}
      </View>

      <View style={styles.section}>
        <SectionTitle>Cleaner model</SectionTitle>
        <Text style={styles.helpText}>
          Owners invite cleaners, limit access by property, and share one-time codes. Cleaners never see unassigned
          properties.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: space.md,
  },
  settingRow: {
    paddingVertical: space.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
  },
  settingLabel: {
    ...type.body,
    color: colors.ink,
  },
  helpText: {
    ...type.noteBody,
    color: colors.inkBody,
  },
});
