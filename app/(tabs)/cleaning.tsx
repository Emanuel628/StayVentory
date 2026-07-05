import { Link, useFocusEffect } from 'expo-router';
import { CalendarCheck2, Plus } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/src/components/Screen';
import { SectionTitle } from '@/src/components/SectionTitle';
import { StatusStamp } from '@/src/components/StatusStamp';
import { listOwnerCleaningJobs } from '@/src/services/cleaning';
import { colors, iconTile, radius, space, type } from '@/src/theme/theme';

type JobRow = {
  id: string;
  scheduled_for: string;
  status: 'scheduled' | 'in_progress' | 'submitted' | 'reviewed' | 'blocked';
  owner_note: string | null;
  assigned_profile?: {
    display_name: string | null;
    email: string | null;
    username: string | null;
  } | null;
  houses: {
    id: string;
    name: string;
    address_line_1: string;
    city: string;
    state: string;
    postal_code: string;
  };
};

function formatJobDate(value: string) {
  const date = new Date(value);

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function toStampStatus(status: JobRow['status']) {
  if (status === 'submitted' || status === 'reviewed') {
    return 'ready' as const;
  }

  if (status === 'blocked') {
    return 'attention' as const;
  }

  if (status === 'in_progress') {
    return 'lowStock' as const;
  }

  return 'needsCleaning' as const;
}

export default function CleaningScreen() {
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadJobs = useCallback(async () => {
    try {
      setError('');
      setIsLoading(true);

      const { data, error: loadError } = await listOwnerCleaningJobs();

      if (loadError) {
        setError(loadError.message);
        return;
      }

      setJobs((data ?? []) as JobRow[]);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Unable to load cleaning jobs.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadJobs();
    }, [loadJobs]),
  );

  return (
    <Screen eyebrow="Cleaning" title="Turnovers and proof">
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <SectionTitle>Scheduled jobs</SectionTitle>
          <Link href="/add-cleaning-job" asChild>
            <Pressable style={styles.inlineAction}>
              <Plus color={colors.teal} size={14} strokeWidth={1.75} />
              <Text style={styles.inlineActionLabel}>Schedule job</Text>
            </Pressable>
          </Link>
        </View>

        {isLoading ? <Text style={styles.meta}>Loading cleaning jobs...</Text> : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {!isLoading && !error && !jobs.length ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No cleaning jobs scheduled yet</Text>
            <Text style={styles.meta}>Create the first turnover job and StayVentory will build the room checklist runs from that house.</Text>
            <Link href="/add-cleaning-job" asChild>
              <Pressable style={styles.inlineAction}>
                <Plus color={colors.teal} size={14} strokeWidth={1.75} />
                <Text style={styles.inlineActionLabel}>Schedule first job</Text>
              </Pressable>
            </Link>
          </View>
        ) : null}

        {jobs.map((job) => (
          <Link key={job.id} href={{ pathname: '/cleaning-jobs/[id]', params: { id: job.id } }} asChild>
            <Pressable style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconTile, { backgroundColor: colors.teal }]}>
                  <CalendarCheck2 color={colors.tealOnDark} size={iconTile.iconSize} strokeWidth={iconTile.strokeWidth} />
                </View>
                <View style={styles.rowText}>
                  <Text style={styles.rowName}>{job.houses.name}</Text>
                  <Text style={styles.rowMeta}>
                    {formatJobDate(job.scheduled_for)}
                    {job.assigned_profile?.display_name ? ` | ${job.assigned_profile.display_name}` : ' | Unassigned'}
                  </Text>
                  {job.owner_note?.trim() ? <Text style={styles.noteText}>{job.owner_note.trim()}</Text> : null}
                </View>
              </View>
              <StatusStamp status={toStampStatus(job.status)} />
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
  },
  inlineAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  inlineActionLabel: {
    ...type.buttonLabel,
    color: colors.teal,
  },
  emptyState: {
    backgroundColor: colors.paperRaised,
    borderRadius: radius.control,
    padding: space.md,
    gap: space.sm,
  },
  emptyTitle: {
    ...type.body,
    color: colors.ink,
  },
  row: {
    paddingVertical: space.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    flex: 1,
  },
  iconTile: {
    width: iconTile.size,
    height: iconTile.size,
    borderRadius: radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowText: {
    gap: 2,
    flex: 1,
  },
  rowName: {
    ...type.houseName,
    color: colors.ink,
  },
  rowMeta: {
    ...type.bodySmallMuted,
    color: colors.inkBody,
  },
  noteText: {
    ...type.noteBody,
    color: colors.inkBody,
  },
  meta: {
    ...type.bodySmallMuted,
    color: colors.inkBody,
  },
  errorText: {
    ...type.bodySmallMuted,
    color: colors.rust,
  },
});
