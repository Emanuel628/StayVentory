import { Link, useFocusEffect } from 'expo-router';
import { ChevronRight, KeyRound, Mail, ShieldCheck, UserRound } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/src/components/Screen';
import { SectionTitle } from '@/src/components/SectionTitle';
import { listOwnerHouseMembers } from '@/src/services/members';
import { colors, radius, space, type } from '@/src/theme/theme';

type MemberRow = {
  id: string;
  invite_code: string | null;
  houses: {
    id: string;
    name: string;
  } | null;
  profile: {
    id: string;
    display_name: string | null;
    email: string | null;
    username: string | null;
    role: 'owner' | 'cleaner';
  } | null;
};

export function CleanerAccessScreen() {
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadMembers = useCallback(async () => {
    try {
      setError('');
      setIsLoading(true);

      const { data, error: loadError } = await listOwnerHouseMembers();

      if (loadError) {
        setError(loadError.message);
        return;
      }

      setMembers(((data ?? []) as MemberRow[]).filter((member) => member.profile?.role === 'cleaner'));
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Unable to load property team access.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadMembers();
    }, [loadMembers]),
  );

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
        <View style={styles.sectionHeader}>
          <SectionTitle>Assigned property team</SectionTitle>
          <Link href="/give-access" asChild>
            <Pressable style={styles.inviteLink}>
              <KeyRound color={colors.teal} size={14} strokeWidth={1.75} />
              <Text style={styles.linkText}>Give access</Text>
            </Pressable>
          </Link>
        </View>

        {isLoading ? <Text style={styles.meta}>Loading team access...</Text> : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {!isLoading && !error && !members.length ? (
          <View style={styles.emptyState}>
            <Text style={styles.name}>No property team members yet</Text>
            <Text style={styles.meta}>Invite your first team member once you are ready to grant access to a property.</Text>
          </View>
        ) : null}

        {members.map((member) => (
          <View key={member.id} style={styles.cleanerBlock}>
            <Text style={styles.name}>{member.profile?.display_name || member.profile?.email || member.profile?.username || 'Unnamed member'}</Text>
            {member.profile?.email ? (
              <View style={styles.detailRow}>
                <Mail color={colors.inkMuted} size={14} strokeWidth={1.75} />
                <Text style={styles.meta}>{member.profile.email}</Text>
              </View>
            ) : null}
            {member.profile?.username ? (
              <View style={styles.detailRow}>
                <UserRound color={colors.inkMuted} size={14} strokeWidth={1.75} />
                <Text style={styles.meta}>{member.profile.username}</Text>
              </View>
            ) : null}
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
              <Text style={styles.codePlaceholder}>{member.invite_code || 'No active code yet.'}</Text>
            </View>
            <View style={styles.detailRow}>
              <ShieldCheck color={colors.ochre} size={14} strokeWidth={1.75} />
              <Text style={styles.meta}>{member.houses?.name ?? 'No property assigned'}</Text>
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
  },
  noteBlock: {
    backgroundColor: colors.paperRaised,
    borderRadius: radius.control,
    padding: space.md,
  },
  emptyState: {
    backgroundColor: colors.paperRaised,
    borderRadius: radius.control,
    padding: space.md,
    gap: space.sm,
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
  inviteLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  linkText: {
    ...type.buttonLabel,
    color: colors.teal,
  },
  meta: {
    ...type.bodySmallMuted,
    color: colors.inkBody,
  },
  errorText: {
    ...type.bodySmallMuted,
    color: colors.rust,
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
