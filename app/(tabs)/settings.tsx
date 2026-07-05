import { Href, Link, useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/src/components/Screen';
import { SectionTitle } from '@/src/components/SectionTitle';
import { useAuth } from '@/src/providers/AuthProvider';
import { deleteMyAccount, signOut } from '@/src/services/auth';
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
  const router = useRouter();
  const { user, role } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/welcome');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete account',
      'This will permanently delete the account and its related records. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete account',
          style: 'destructive',
          onPress: async () => {
            const { error } = await deleteMyAccount();

            if (error) {
              Alert.alert('Delete failed', error.message);
              return;
            }

            router.replace('/welcome');
          },
        },
      ],
    );
  };

  return (
    <Screen eyebrow="Settings" title="System controls">
      <View style={styles.section}>
        <SectionTitle>Account</SectionTitle>
        <View style={styles.profileBlock}>
          <Text style={styles.settingLabel}>{user?.email ?? 'Signed out'}</Text>
          <Text style={styles.profileMeta}>{role ? role.toUpperCase() : 'NO ROLE'}</Text>
        </View>
        <View style={styles.actionBlock}>
          <Pressable style={styles.primaryActionButton} onPress={handleSignOut}>
            <Text style={styles.primaryActionLabel}>Log out</Text>
          </Pressable>
          <Pressable style={styles.destructiveActionButton} onPress={handleDeleteAccount}>
            <Text style={styles.destructiveActionLabel}>Delete account</Text>
          </Pressable>
        </View>
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
  profileBlock: {
    gap: space.xs,
    paddingBottom: space.sm,
  },
  profileMeta: {
    ...type.bodySmallMuted,
    color: colors.inkBody,
  },
  actionBlock: {
    gap: space.sm,
    paddingBottom: space.sm,
  },
  primaryActionButton: {
    minHeight: 46,
    borderRadius: 3,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.lg,
  },
  primaryActionLabel: {
    ...type.buttonLabel,
    color: colors.buttonPrimaryText,
  },
  destructiveActionButton: {
    minHeight: 46,
    borderRadius: 3,
    backgroundColor: colors.rust,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.lg,
  },
  destructiveActionLabel: {
    ...type.buttonLabel,
    color: colors.buttonPrimaryText,
  },
  destructiveLabel: {
    ...type.body,
    color: colors.rust,
  },
  helpText: {
    ...type.noteBody,
    color: colors.inkBody,
  },
});
