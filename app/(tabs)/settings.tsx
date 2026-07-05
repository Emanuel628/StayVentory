import { Href, Link } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/src/components/Screen';
import { SectionTitle } from '@/src/components/SectionTitle';
import { colors, space, type } from '@/src/theme/theme';

const rows: { label: string; href: Href }[] = [
  { label: 'Profile', href: '/settings' },
  { label: 'House playbook', href: '/settings' },
  { label: 'Property team access', href: '/cleaners' },
  { label: 'Notifications', href: '/settings' },
  { label: 'Design lock', href: '/settings' },
];

const previewRows: { label: string; href: Href }[] = [
  { label: 'Welcome page', href: '/welcome' },
  { label: 'Owner register', href: '/register' },
  { label: 'Login', href: '/login' },
  { label: 'Forgot password', href: '/forgot-password' },
  { label: 'Property team register', href: '/team-register' },
  { label: 'Property team workspace', href: '/team-workspace' },
  { label: 'Add property', href: '/add-property' },
  { label: 'Add room', href: '/add-room' },
  { label: 'Room icon picker', href: '/room-icon-picker' },
  { label: 'Give access', href: '/give-access' },
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
        <SectionTitle>Property team model</SectionTitle>
        <Text style={styles.helpText}>
          Owners invite property team members, limit access by property, and share one-time codes. They never see
          unassigned properties.
        </Text>
      </View>

      <View style={styles.section}>
        <SectionTitle>Preview pages</SectionTitle>
        {previewRows.map((row) => (
          <Link key={row.label} href={row.href} asChild>
            <Pressable style={styles.settingRow}>
              <Text style={styles.settingLabel}>{row.label}</Text>
              <ChevronRight color={colors.inkMuted} size={18} strokeWidth={1.75} />
            </Pressable>
          </Link>
        ))}
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
