import { Link, useFocusEffect } from 'expo-router';
import { CalendarCheck2, ChevronRight, CircleAlert, House, Plus, Wrench } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/src/components/Screen';
import { SectionTitle } from '@/src/components/SectionTitle';
import { StatusStamp } from '@/src/components/StatusStamp';
import { listOwnerCleaningJobs } from '@/src/services/cleaning';
import { listHouses } from '@/src/services/houses';
import { listOwnerIssues } from '@/src/services/issues';
import { colors, iconTile, radius, space, type } from '@/src/theme/theme';

type HouseRow = {
  id: string;
  name: string;
  address_line_1: string;
  city: string;
  state: string;
  postal_code: string;
};

type JobRow = {
  id: string;
  scheduled_for: string;
  status: 'scheduled' | 'in_progress' | 'submitted' | 'reviewed' | 'blocked';
  houses: {
    id: string;
    name: string;
  };
};

type IssueRow = {
  id: string;
  title: string;
  category: 'repair' | 'maintenance' | 'replace';
  status: 'open' | 'reviewing' | 'resolved';
  houses: {
    id: string;
    name: string;
  } | null;
  rooms: {
    id: string;
    name: string;
  } | null;
};

function formatJobDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
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

export default function HomeScreen() {
  const [houses, setHouses] = useState<HouseRow[]>([]);
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [issues, setIssues] = useState<IssueRow[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    try {
      setError('');
      setIsLoading(true);

      const [{ data: housesData, error: housesError }, { data: jobsData, error: jobsError }, { data: issuesData, error: issuesError }] =
        await Promise.all([listHouses(), listOwnerCleaningJobs(), listOwnerIssues()]);

      const nextError = housesError || jobsError || issuesError;

      if (nextError) {
        setError(nextError.message);
        return;
      }

      setHouses((housesData ?? []) as HouseRow[]);
      setJobs((jobsData ?? []) as JobRow[]);
      setIssues(((issuesData ?? []) as IssueRow[]).filter((issue) => issue.status !== 'resolved'));
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Unable to load the home dashboard.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadDashboard();
    }, [loadDashboard]),
  );

  const hasHouses = houses.length > 0;
  const dueJobs = jobs.filter((job) => job.status === 'scheduled' || job.status === 'in_progress' || job.status === 'blocked');

  return (
    <Screen eyebrow="Home" title="Owner command center">
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>What needs attention now</Text>
        <Text style={styles.heroBody}>
          This screen only shows live StayVentory data. New accounts start empty and build up as you add houses, rooms,
          jobs, notes, and issues.
        </Text>
        <View style={styles.metricRow}>
          <View style={styles.metricCell}>
            <Text style={styles.metricValue}>{houses.length}</Text>
            <Text style={styles.metricLabel}>houses</Text>
          </View>
          <View style={styles.metricCell}>
            <Text style={styles.metricValue}>{dueJobs.length}</Text>
            <Text style={styles.metricLabel}>open jobs</Text>
          </View>
          <View style={styles.metricCell}>
            <Text style={styles.metricValue}>{issues.length}</Text>
            <Text style={styles.metricLabel}>open issues</Text>
          </View>
        </View>
      </View>

      {isLoading ? <Text style={styles.meta}>Loading dashboard...</Text> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {!isLoading && !error && !hasHouses ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Add your first property to begin</Text>
          <Text style={styles.emptyBody}>
            Once you create a house, this command center will start showing rooms, turnovers, issues, and owner review
            work.
          </Text>
          <Link href="/add-property" asChild>
            <Pressable style={styles.inlineAction}>
              <Plus color={colors.teal} size={14} strokeWidth={1.75} />
              <Text style={styles.inlineActionLabel}>Add property</Text>
            </Pressable>
          </Link>
        </View>
      ) : null}

      {hasHouses ? (
        <>
          <View style={styles.section}>
            <SectionTitle>Next turnovers</SectionTitle>
            {!dueJobs.length ? <Text style={styles.meta}>No cleaning jobs scheduled yet.</Text> : null}
            {dueJobs.slice(0, 4).map((job) => (
              <Link key={job.id} href={{ pathname: '/cleaning-jobs/[id]', params: { id: job.id } }} asChild>
                <Pressable style={styles.row}>
                  <View style={styles.rowLeft}>
                    <View style={[styles.iconTile, { backgroundColor: colors.teal }]}>
                      <CalendarCheck2 color={colors.tealOnDark} size={iconTile.iconSize} strokeWidth={iconTile.strokeWidth} />
                    </View>
                    <View style={styles.rowText}>
                      <Text style={styles.rowName}>{job.houses.name}</Text>
                      <Text style={styles.rowMeta}>{formatJobDate(job.scheduled_for)}</Text>
                    </View>
                  </View>
                  <StatusStamp status={toStampStatus(job.status)} />
                </Pressable>
              </Link>
            ))}
          </View>

          <View style={styles.section}>
            <SectionTitle>Open issues</SectionTitle>
            {!issues.length ? <Text style={styles.meta}>No repair, maintenance, or replacement issues are open.</Text> : null}
            {issues.slice(0, 4).map((issue) => (
              <Link key={issue.id} href="/issues" asChild>
                <Pressable style={styles.inlineRow}>
                  <View style={styles.inlineLeft}>
                    <Wrench color={colors.rust} size={16} strokeWidth={1.75} />
                    <View style={styles.rowText}>
                      <Text style={styles.body}>{issue.title}</Text>
                      <Text style={styles.rowMeta}>
                        {(issue.houses?.name ?? 'House') + (issue.rooms?.name ? ` | ${issue.rooms.name}` : '')}
                      </Text>
                    </View>
                  </View>
                  <ChevronRight color={colors.inkMuted} size={16} strokeWidth={1.75} />
                </Pressable>
              </Link>
            ))}
          </View>

          <View style={styles.section}>
            <SectionTitle>Your houses</SectionTitle>
            {houses.slice(0, 4).map((house) => (
              <Link key={house.id} href={{ pathname: '/houses/[id]', params: { id: house.id } }} asChild>
                <Pressable style={styles.inlineRow}>
                  <View style={styles.inlineLeft}>
                    <House color={colors.teal} size={16} strokeWidth={1.75} />
                    <View style={styles.rowText}>
                      <Text style={styles.body}>{house.name}</Text>
                      <Text style={styles.rowMeta}>{`${house.address_line_1}, ${house.city}, ${house.state} ${house.postal_code}`}</Text>
                    </View>
                  </View>
                  <ChevronRight color={colors.inkMuted} size={16} strokeWidth={1.75} />
                </Pressable>
              </Link>
            ))}
          </View>
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.paperRaised,
    borderRadius: radius.control,
    padding: space.lg,
    gap: space.md,
  },
  heroTitle: {
    ...type.houseName,
    color: colors.ink,
  },
  heroBody: {
    ...type.noteBody,
    color: colors.inkBody,
  },
  metricRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    paddingTop: space.md,
    gap: space.md,
  },
  metricCell: {
    flex: 1,
    gap: 2,
  },
  metricValue: {
    ...type.screenGreeting,
    fontSize: 24,
  },
  metricLabel: {
    ...type.bodySmallMuted,
    color: colors.inkBody,
  },
  section: {
    gap: space.md,
  },
  emptyState: {
    backgroundColor: colors.paperRaised,
    borderRadius: radius.control,
    padding: space.lg,
    gap: space.sm,
  },
  emptyTitle: {
    ...type.houseName,
    color: colors.ink,
  },
  emptyBody: {
    ...type.noteBody,
    color: colors.inkBody,
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
  iconTile: {
    width: iconTile.size,
    height: iconTile.size,
    borderRadius: radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowName: {
    ...type.houseName,
    color: colors.ink,
  },
  rowMeta: {
    ...type.bodySmallMuted,
    color: colors.inkBody,
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
