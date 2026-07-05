import { Link, useFocusEffect } from 'expo-router';
import { CalendarCheck2, House } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/src/components/Screen';
import { SectionTitle } from '@/src/components/SectionTitle';
import { StatusStamp } from '@/src/components/StatusStamp';
import { useAuth } from '@/src/providers/AuthProvider';
import { listAssignedCleaningJobs } from '@/src/services/cleaning';
import { colors, iconTile, radius, space, type } from '@/src/theme/theme';

type AssignedJob = {
  id: string;
  scheduled_for: string;
  status: 'scheduled' | 'in_progress' | 'submitted' | 'reviewed' | 'blocked';
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
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

function toStampStatus(status: AssignedJob['status']) {
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

export function TeamWorkspaceScreen() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<AssignedJob[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadJobs = useCallback(async () => {
    if (!user?.id) {
      setJobs([]);
      setIsLoading(false);
      return;
    }

    try {
      setError('');
      setIsLoading(true);

      const { data, error: loadError } = await listAssignedCleaningJobs(user.id);

      if (loadError) {
        setError(loadError.message);
        return;
      }

      setJobs((data ?? []) as AssignedJob[]);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Unable to load assigned jobs.');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      void loadJobs();
    }, [loadJobs]),
  );

  const assignedHouses = Array.from(
    new Map(
      jobs.map((job) => [
        job.houses.id,
        {
          id: job.houses.id,
          name: job.houses.name,
          address: `${job.houses.address_line_1}, ${job.houses.city}, ${job.houses.state} ${job.houses.postal_code}`,
        },
      ]),
    ).values(),
  );

  return (
    <Screen eyebrow="Property Team" title="Assigned work" showSettingsLink={false}>
      <View style={styles.section}>
        <SectionTitle>What needs your attention</SectionTitle>
        {isLoading ? <Text style={styles.meta}>Loading assigned jobs...</Text> : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {!isLoading && !error && !jobs.length ? <Text style={styles.meta}>No cleaning jobs are assigned to you yet.</Text> : null}
        {jobs.map((job) => (
          <Link key={job.id} href={{ pathname: '/cleaning-jobs/[id]', params: { id: job.id } }} asChild>
            <Pressable style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconTile, { backgroundColor: colors.teal }]}>
                  <CalendarCheck2 color={colors.tealOnDark} size={iconTile.iconSize} strokeWidth={iconTile.strokeWidth} />
                </View>
                <View style={styles.rowText}>
                  <Text style={styles.rowName}>{job.houses.name}</Text>
                  <Text style={styles.rowMeta}>{`${formatJobDate(job.scheduled_for)} | ${job.houses.address_line_1}`}</Text>
                </View>
              </View>
              <StatusStamp status={toStampStatus(job.status)} />
            </Pressable>
          </Link>
        ))}
      </View>

      <View style={styles.section}>
        <SectionTitle>Assigned houses</SectionTitle>
        {assignedHouses.map((house) => (
          <View key={house.id} style={styles.inlineRow}>
            <View style={styles.inlineLeft}>
              <View style={[styles.iconTile, { backgroundColor: colors.teal }]}>
                <House color={colors.tealOnDark} size={iconTile.iconSize} strokeWidth={iconTile.strokeWidth} />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowName}>{house.name}</Text>
                <Text style={styles.rowMeta}>{house.address}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <SectionTitle>How this workspace works</SectionTitle>
        <View style={styles.noteBlock}>
          <Text style={styles.body}>
            Open any assigned job to see the house address, owner contact, room-by-room instructions, and the live
            checklist items that need to be updated.
          </Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: space.md,
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
  iconTile: {
    width: iconTile.size,
    height: iconTile.size,
    borderRadius: radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  inlineRow: {
    paddingVertical: space.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
  },
  inlineLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    flex: 1,
  },
  noteBlock: {
    backgroundColor: colors.paperRaised,
    borderRadius: radius.control,
    padding: space.md,
  },
  body: {
    ...type.body,
    color: colors.ink,
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
