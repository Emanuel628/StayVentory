import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Screen } from '@/src/components/Screen';
import { SectionTitle } from '@/src/components/SectionTitle';
import { listHouseAssignableMembers, createCleaningJob } from '@/src/services/cleaning';
import { listHouses } from '@/src/services/houses';
import { colors, radius, space, type } from '@/src/theme/theme';

type HouseOption = {
  id: string;
  name: string;
  address_line_1: string;
  city: string;
  state: string;
  postal_code: string;
};

type MemberOption = {
  id: string;
  member_user_id: string;
  profile?: {
    id: string;
    display_name: string | null;
    email: string | null;
    username: string | null;
    role: 'owner' | 'cleaner';
  } | null;
};

function buildScheduledFor(dateValue: string, timeValue: string) {
  const normalizedDate = dateValue.trim();
  const normalizedTime = timeValue.trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalizedDate)) {
    return null;
  }

  if (!/^\d{2}:\d{2}$/.test(normalizedTime)) {
    return null;
  }

  const scheduled = new Date(`${normalizedDate}T${normalizedTime}:00`);
  return Number.isNaN(scheduled.getTime()) ? null : scheduled.toISOString();
}

export default function AddCleaningJobScreen() {
  const params = useLocalSearchParams<{ houseId?: string }>();
  const router = useRouter();
  const preselectedHouseId = params.houseId ?? '';
  const [houses, setHouses] = useState<HouseOption[]>([]);
  const [members, setMembers] = useState<MemberOption[]>([]);
  const [selectedHouseId, setSelectedHouseId] = useState(preselectedHouseId);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [ownerNote, setOwnerNote] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadHouses = useCallback(async () => {
    try {
      setError('');
      setIsLoading(true);

      const { data, error: housesError } = await listHouses();

      if (housesError) {
        setError(housesError.message);
        return;
      }

      const nextHouses = (data ?? []) as HouseOption[];
      setHouses(nextHouses);

      if (!selectedHouseId && nextHouses[0]?.id) {
        setSelectedHouseId(nextHouses[0].id);
      }
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Unable to load houses.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedHouseId]);

  useFocusEffect(
    useCallback(() => {
      void loadHouses();
    }, [loadHouses]),
  );

  useFocusEffect(
    useCallback(() => {
      if (!selectedHouseId) {
        setMembers([]);
        setSelectedMemberId('');
        return;
      }

      let isActive = true;

      const loadMembers = async () => {
        const { data, error: membersError } = await listHouseAssignableMembers(selectedHouseId);

        if (!isActive) {
          return;
        }

        if (membersError) {
          setError(membersError.message);
          return;
        }

        const nextMembers = ((data ?? []) as MemberOption[]).filter((member) => member.profile?.role === 'cleaner');
        setMembers(nextMembers);

        if (!nextMembers.some((member) => member.member_user_id === selectedMemberId)) {
          setSelectedMemberId('');
        }
      };

      void loadMembers();

      return () => {
        isActive = false;
      };
    }, [selectedHouseId, selectedMemberId]),
  );

  const handleSave = async () => {
    if (!selectedHouseId) {
      setError('Choose a house first.');
      return;
    }

    const scheduledFor = buildScheduledFor(scheduledDate, scheduledTime);

    if (!scheduledFor) {
      setError('Use a valid date and time. Example: 2026-07-05 and 14:00.');
      return;
    }

    try {
      setError('');
      setIsSubmitting(true);

      const { data, error: createError } = await createCleaningJob({
        houseId: selectedHouseId,
        scheduledFor,
        assignedUserId: selectedMemberId || null,
        ownerNote: ownerNote.trim() || null,
      });

      if (createError || !data) {
        setError(createError?.message ?? 'Unable to create cleaning job.');
        return;
      }

      router.replace({ pathname: '/cleaning-jobs/[id]', params: { id: data.id } });
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Unable to create cleaning job.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen eyebrow="Cleaning" title="Schedule cleaning job" backHref="/cleaning" backLabel="Back to cleaning">
      <View style={styles.section}>
        <SectionTitle>House</SectionTitle>
        {isLoading ? <Text style={styles.meta}>Loading houses...</Text> : null}
        {!isLoading && !houses.length ? <Text style={styles.errorText}>Add a property before scheduling a cleaning job.</Text> : null}
        {houses.map((house) => {
          const isSelected = house.id === selectedHouseId;

          return (
            <Pressable
              key={house.id}
              style={[styles.optionRow, isSelected ? styles.optionRowSelected : null]}
              onPress={() => setSelectedHouseId(house.id)}>
              <Text style={styles.optionTitle}>{house.name}</Text>
              <Text style={styles.optionMeta}>{`${house.address_line_1}, ${house.city}, ${house.state} ${house.postal_code}`}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.section}>
        <SectionTitle>When</SectionTitle>
        <View style={styles.formRow}>
          <View style={[styles.formField, styles.formFieldFlex]}>
            <Text style={styles.fieldLabel}>Date</Text>
            <TextInput
              style={styles.input}
              placeholder="2026-07-05"
              placeholderTextColor={colors.inkMuted}
              value={scheduledDate}
              onChangeText={setScheduledDate}
            />
          </View>
          <View style={[styles.formField, styles.timeField]}>
            <Text style={styles.fieldLabel}>Time</Text>
            <TextInput
              style={styles.input}
              placeholder="14:00"
              placeholderTextColor={colors.inkMuted}
              value={scheduledTime}
              onChangeText={setScheduledTime}
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <SectionTitle>Assign property team member</SectionTitle>
        <Pressable
          style={[styles.optionRow, !selectedMemberId ? styles.optionRowSelected : null]}
          onPress={() => setSelectedMemberId('')}>
          <Text style={styles.optionTitle}>Leave unassigned</Text>
          <Text style={styles.optionMeta}>Create the job now and assign it later.</Text>
        </Pressable>
        {members.map((member) => {
          const label = member.profile?.display_name || member.profile?.email || member.profile?.username || 'Unnamed member';
          const isSelected = selectedMemberId === member.member_user_id;

          return (
            <Pressable
              key={member.id}
              style={[styles.optionRow, isSelected ? styles.optionRowSelected : null]}
              onPress={() => setSelectedMemberId(member.member_user_id)}>
              <Text style={styles.optionTitle}>{label}</Text>
              <Text style={styles.optionMeta}>{member.profile?.email || member.profile?.username || 'Property team member'}</Text>
            </Pressable>
          );
        })}
        {selectedHouseId && !members.length ? <Text style={styles.meta}>No active property team members are assigned to this house yet.</Text> : null}
      </View>

      <View style={styles.section}>
        <SectionTitle>Owner note</SectionTitle>
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Instructions for this turnover</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Add the guest-ready expectations for this specific cleaning job"
            placeholderTextColor={colors.inkMuted}
            multiline
            textAlignVertical="top"
            value={ownerNote}
            onChangeText={setOwnerNote}
          />
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      <Pressable style={styles.saveButton} onPress={handleSave} disabled={isSubmitting || !houses.length}>
        <Text style={styles.saveLabel}>{isSubmitting ? 'Scheduling...' : 'Save job'}</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: space.md,
  },
  formRow: {
    flexDirection: 'row',
    gap: space.sm,
  },
  formField: {
    backgroundColor: colors.paperRaised,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.control,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    gap: 2,
  },
  formFieldFlex: {
    flex: 1,
  },
  timeField: {
    width: 120,
  },
  fieldLabel: {
    ...type.eyebrow,
    color: colors.ink,
  },
  input: {
    minHeight: 44,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.hairline,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    backgroundColor: colors.paper,
    ...type.body,
    color: colors.inkBody,
  },
  multilineInput: {
    minHeight: 132,
  },
  optionRow: {
    paddingVertical: space.md,
    paddingHorizontal: space.md,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.control,
    gap: 2,
    backgroundColor: colors.paper,
  },
  optionRowSelected: {
    borderColor: colors.teal,
    backgroundColor: colors.paperRaised,
  },
  optionTitle: {
    ...type.body,
    color: colors.ink,
  },
  optionMeta: {
    ...type.bodySmallMuted,
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
  saveButton: {
    minHeight: 46,
    borderRadius: radius.control,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.lg,
  },
  saveLabel: {
    ...type.buttonLabel,
    color: colors.buttonPrimaryText,
  },
});
