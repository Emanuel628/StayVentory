import { Link, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/src/components/Screen';
import { SectionTitle } from '@/src/components/SectionTitle';
import { StatusStamp } from '@/src/components/StatusStamp';
import { getFallbackRoomOption, getRoomOptionById, getRoomOptionByType } from '@/src/data/roomOptions';
import { useAuth } from '@/src/providers/AuthProvider';
import { getCleaningJobDetail, updateChecklistRunItem } from '@/src/services/cleaning';
import { colors, iconTile, radius, space, type } from '@/src/theme/theme';

type JobDetail = {
  id: string;
  status: 'scheduled' | 'in_progress' | 'submitted' | 'reviewed' | 'blocked';
  scheduled_for: string;
  owner_note: string | null;
  cleaner_note: string | null;
  houses: {
    id: string;
    name: string;
    address_line_1: string;
    address_line_2: string | null;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  assigned_profile?: {
    display_name: string | null;
    email: string | null;
    username: string | null;
    phone: string | null;
  } | null;
  owner_profile?: {
    display_name: string | null;
    email: string | null;
    username: string | null;
    phone: string | null;
  } | null;
  runs: Array<{
    id: string;
    status: 'pending' | 'in_progress' | 'completed' | 'blocked';
    room_id: string;
    room: {
      id: string;
      house_id: string;
      name: string;
      room_type: string;
      icon_key: string | null;
      instructions: string | null;
      sort_order: number;
    } | null;
    items: Array<{
      id: string;
      response_status: 'pending' | 'cleaned' | 'restocked' | 'needs_attention' | 'item_missing' | 'damage_found' | null;
      photo_required: boolean;
      note: string | null;
      photo_count: number;
      template_item?: {
        id: string;
        label: string;
        sort_order: number;
        required_photo: boolean;
      } | null;
    }>;
  }>;
};

const responseOptions = [
  { value: 'cleaned', label: 'Cleaned' },
  { value: 'restocked', label: 'Restocked' },
  { value: 'needs_attention', label: 'Needs attention' },
  { value: 'item_missing', label: 'Item missing' },
  { value: 'damage_found', label: 'Damage found' },
] as const;

function formatJobDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

function toJobStampStatus(status: JobDetail['status']) {
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

function toRunBadgeLabel(status: JobDetail['runs'][number]['status']) {
  if (status === 'completed') {
    return 'Ready';
  }

  if (status === 'blocked') {
    return 'Blocked';
  }

  if (status === 'in_progress') {
    return 'In progress';
  }

  return 'Open';
}

export default function CleaningJobDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const { role } = useAuth();
  const cleaningJobId = params.id ?? '';
  const [job, setJob] = useState<JobDetail | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [savingItemId, setSavingItemId] = useState('');

  const loadJob = useCallback(async () => {
    if (!cleaningJobId) {
      setError('Cleaning job not found.');
      setIsLoading(false);
      return;
    }

    try {
      setError('');
      setIsLoading(true);

      const { data, error: loadError } = await getCleaningJobDetail(cleaningJobId);

      if (loadError) {
        setError(loadError.message);
        return;
      }

      setJob(data as JobDetail);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Unable to load cleaning job.');
    } finally {
      setIsLoading(false);
    }
  }, [cleaningJobId]);

  useFocusEffect(
    useCallback(() => {
      void loadJob();
    }, [loadJob]),
  );

  const handleUpdateItem = async (runItemId: string, nextStatus: (typeof responseOptions)[number]['value']) => {
    try {
      setSavingItemId(runItemId);
      setError('');

      const { error: updateError } = await updateChecklistRunItem({
        runItemId,
        responseStatus: nextStatus,
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      await loadJob();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Unable to update checklist item.');
    } finally {
      setSavingItemId('');
    }
  };

  const houseAddress = job
    ? [job.houses.address_line_1, job.houses.address_line_2, `${job.houses.city}, ${job.houses.state} ${job.houses.postal_code}`]
        .filter(Boolean)
        .join('\n')
    : '';
  const backHref = role === 'cleaner' ? '/team-workspace' : '/cleaning';
  const assignedLabel =
    job?.assigned_profile?.display_name || job?.assigned_profile?.email || job?.assigned_profile?.username || 'Unassigned';
  const ownerContactLabel =
    job?.owner_profile?.display_name || job?.owner_profile?.email || job?.owner_profile?.username || 'Owner';
  const canUpdate = role === 'cleaner';

  return (
    <Screen eyebrow="Cleaning job" title={job?.houses.name ?? 'Cleaning job'} backHref={backHref} backLabel="Back">
      {isLoading ? <Text style={styles.meta}>Loading cleaning job...</Text> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {job ? (
        <>
          <View style={styles.hero}>
            <View style={styles.heroTop}>
              <View style={styles.heroText}>
                <Text style={styles.heroTitle}>{formatJobDate(job.scheduled_for)}</Text>
                <Text style={styles.heroMeta}>{houseAddress}</Text>
                <Text style={styles.heroMeta}>Assigned to: {assignedLabel}</Text>
              </View>
              <StatusStamp status={toJobStampStatus(job.status)} />
            </View>
            {job.owner_note?.trim() ? (
              <View style={styles.noteBlock}>
                <Text style={styles.noteLabel}>Owner note</Text>
                <Text style={styles.noteText}>{job.owner_note.trim()}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.section}>
            <SectionTitle>Owner contact</SectionTitle>
            <Text style={styles.meta}>{ownerContactLabel}</Text>
            {job.owner_profile?.phone ? <Text style={styles.meta}>{job.owner_profile.phone}</Text> : null}
            {job.owner_profile?.email ? <Text style={styles.meta}>{job.owner_profile.email}</Text> : null}
          </View>

          <View style={styles.section}>
            <SectionTitle>Room checklist runs</SectionTitle>
            {job.runs.map((run) => {
              const roomOption =
                getRoomOptionById(run.room?.icon_key) ??
                getRoomOptionByType(run.room?.room_type ?? '') ??
                getFallbackRoomOption();
              const RoomIcon = roomOption.icon;

              return (
                <View key={run.id} style={styles.runBlock}>
                  <View style={styles.runHeader}>
                    <View style={styles.runHeaderLeft}>
                      <View style={[styles.iconTile, { backgroundColor: roomOption.tileColor }]}>
                        <RoomIcon color={roomOption.iconColor} size={iconTile.iconSize} strokeWidth={iconTile.strokeWidth} />
                      </View>
                      <View style={styles.runHeaderText}>
                        <Text style={styles.runTitle}>{run.room?.name ?? 'Room'}</Text>
                        <Text style={styles.runMeta}>{toRunBadgeLabel(run.status)}</Text>
                      </View>
                    </View>
                    {run.room?.id ? (
                      <Link href={{ pathname: '/rooms/[id]', params: { id: run.room.id } }} asChild>
                        <Pressable>
                          <Text style={styles.roomLink}>Open room</Text>
                        </Pressable>
                      </Link>
                    ) : null}
                  </View>

                  {run.room?.instructions?.trim() ? <Text style={styles.instructionsText}>{run.room.instructions.trim()}</Text> : null}

                  {!run.items.length ? <Text style={styles.meta}>No room standard items have been added yet for this room.</Text> : null}

                  {run.items.map((item) => (
                    <View key={item.id} style={styles.itemRow}>
                      <View style={styles.itemHeader}>
                        <Text style={styles.itemLabel}>{item.template_item?.label ?? 'Checklist item'}</Text>
                        <Text style={styles.itemStatus}>
                          {item.response_status && item.response_status !== 'pending'
                            ? item.response_status.replaceAll('_', ' ')
                            : 'Open'}
                        </Text>
                      </View>
                      {item.photo_required ? <Text style={styles.itemMeta}>Proof photo required for this checklist item.</Text> : null}
                      {canUpdate ? (
                        <View style={styles.optionWrap}>
                          {responseOptions.map((option) => {
                            const isSelected = item.response_status === option.value;

                            return (
                              <Pressable
                                key={option.value}
                                style={[styles.statusOption, isSelected ? styles.statusOptionSelected : null]}
                                onPress={() => handleUpdateItem(item.id, option.value)}
                                disabled={savingItemId === item.id}>
                                <Text style={[styles.statusOptionLabel, isSelected ? styles.statusOptionLabelSelected : null]}>
                                  {savingItemId === item.id && isSelected ? 'Saving...' : option.label}
                                </Text>
                              </Pressable>
                            );
                          })}
                        </View>
                      ) : null}
                    </View>
                  ))}
                </View>
              );
            })}
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
    padding: space.md,
    gap: space.md,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: space.md,
  },
  heroText: {
    gap: 2,
    flex: 1,
  },
  heroTitle: {
    ...type.houseName,
    color: colors.ink,
  },
  heroMeta: {
    ...type.bodySmallMuted,
    color: colors.inkBody,
  },
  noteBlock: {
    gap: 2,
  },
  noteLabel: {
    ...type.eyebrow,
    color: colors.ink,
  },
  noteText: {
    ...type.noteBody,
    color: colors.inkBody,
  },
  section: {
    gap: space.md,
  },
  meta: {
    ...type.bodySmallMuted,
    color: colors.inkBody,
  },
  errorText: {
    ...type.bodySmallMuted,
    color: colors.rust,
  },
  runBlock: {
    paddingBottom: space.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
    gap: space.md,
  },
  runHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
  },
  runHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    flex: 1,
  },
  runHeaderText: {
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
  runTitle: {
    ...type.houseName,
    color: colors.ink,
  },
  runMeta: {
    ...type.bodySmallMuted,
    color: colors.inkBody,
  },
  roomLink: {
    ...type.buttonLabel,
    color: colors.teal,
  },
  instructionsText: {
    ...type.noteBody,
    color: colors.inkBody,
  },
  itemRow: {
    gap: space.sm,
    paddingTop: space.sm,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: space.md,
  },
  itemLabel: {
    ...type.body,
    color: colors.ink,
    flex: 1,
  },
  itemStatus: {
    ...type.bodySmallMuted,
    color: colors.inkBody,
    textTransform: 'capitalize',
  },
  itemMeta: {
    ...type.bodySmallMuted,
    color: colors.ochre,
  },
  optionWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
  },
  statusOption: {
    minHeight: 34,
    paddingHorizontal: space.md,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusOptionSelected: {
    backgroundColor: colors.teal,
    borderColor: colors.teal,
  },
  statusOptionLabel: {
    ...type.bodySmallMuted,
    color: colors.ink,
  },
  statusOptionLabelSelected: {
    color: colors.buttonPrimaryText,
  },
});
