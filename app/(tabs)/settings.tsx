import { Link, useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/src/components/Screen';
import { SectionTitle } from '@/src/components/SectionTitle';
import { useAuth } from '@/src/providers/AuthProvider';
import { deleteMyAccount, signOut } from '@/src/services/auth';
import { isSupabaseConfigured } from '@/src/lib/env';
import { colors, space, type } from '@/src/theme/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, role, refreshSession } = useAuth();

  const handleSignOut = async () => {
    let signOutFailed = false;

    if (isSupabaseConfigured) {
      try {
        await signOut();
        await refreshSession();
      } catch {
        signOutFailed = true;
      }
    }

    if (signOutFailed) {
      Alert.alert('Log out failed', 'The local session could not be cleared. Please try again.');
      return;
    }

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
            if (!isSupabaseConfigured) {
              Alert.alert(
                'Supabase not configured',
                'Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY before testing account deletion.',
              );
              return;
            }

            let errorMessage = '';

            try {
              const { error } = await deleteMyAccount();
              errorMessage = error?.message ?? '';
            } catch (error) {
              errorMessage = error instanceof Error ? error.message : 'Delete failed.';
            }

            if (errorMessage) {
              Alert.alert('Delete failed', errorMessage);
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
      </View>

      <View style={styles.section}>
        <SectionTitle>Manage</SectionTitle>
        <Link href="/cleaners" asChild>
          <Pressable style={styles.settingRow}>
            <Text style={styles.settingLabel}>Property team access</Text>
            <ChevronRight color={colors.inkMuted} size={18} strokeWidth={1.75} />
          </Pressable>
        </Link>
      </View>

      <View style={styles.section}>
        <SectionTitle>Design lock</SectionTitle>
        <Text style={styles.helpText}>
          The app stays restrained on purpose: single-column layouts, plain lists, direct labels, and minimal card use.
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
