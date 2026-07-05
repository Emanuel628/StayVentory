import { Link, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Plus, ShieldCheck } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ListRowLink } from '@/src/components/ListRowLink';
import { Screen } from '@/src/components/Screen';
import { SectionTitle } from '@/src/components/SectionTitle';
import { getFallbackRoomOption, getRoomOptionById, getRoomOptionByType } from '@/src/data/roomOptions';
import { getHouseWithRooms } from '@/src/services/houses';
import { colors, radius, space, type } from '@/src/theme/theme';

type HouseRecord = {
  id: string;
  name: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};

type RoomRecord = {
  id: string;
  house_id: string;
  name: string;
  room_type: string;
  icon_key: string | null;
  instructions: string | null;
  sort_order: number;
  created_at: string;
};

export default function HouseDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const houseId = params.id ?? '';
  const [house, setHouse] = useState<HouseRecord | null>(null);
  const [rooms, setRooms] = useState<RoomRecord[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadHouse = useCallback(async () => {
    if (!houseId) {
      setError('House not found.');
      setIsLoading(false);
      return;
    }

    try {
      setError('');
      setIsLoading(true);

      const { data, error: loadError } = await getHouseWithRooms(houseId);

      if (loadError) {
        setError(loadError.message);
        return;
      }

      setHouse(data as HouseRecord);
      setRooms(
        ((data.rooms ?? []) as RoomRecord[])
          .slice()
          .sort((a: RoomRecord, b: RoomRecord) => a.sort_order - b.sort_order || a.name.localeCompare(b.name)),
      );
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Unable to load house.');
    } finally {
      setIsLoading(false);
    }
  }, [houseId]);

  useFocusEffect(
    useCallback(() => {
      void loadHouse();
    }, [loadHouse]),
  );

  const address = house
    ? [house.address_line_1, house.address_line_2, `${house.city}, ${house.state} ${house.postal_code}`]
        .filter(Boolean)
        .join('\n')
    : '';

  return (
    <Screen eyebrow="House" title={house?.name ?? 'House'} backHref="/houses" backLabel="Back to houses">
      <View style={styles.section}>
        <SectionTitle>Property overview</SectionTitle>
        {isLoading ? <Text style={styles.meta}>Loading property...</Text> : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {house ? <Text style={styles.meta}>{address}</Text> : null}
        <Text style={styles.meta}>Property team access, instructions, and room readiness live here.</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.rowBetween}>
          <SectionTitle>Rooms</SectionTitle>
          <Link href={{ pathname: '/add-room', params: { houseId } }} asChild>
            <Pressable style={styles.inlineAction}>
              <Plus color={colors.teal} size={14} strokeWidth={1.75} />
              <Text style={styles.inlineActionLabel}>Add room</Text>
            </Pressable>
          </Link>
        </View>
        {!isLoading && !error && !rooms.length ? <Text style={styles.meta}>No rooms added yet.</Text> : null}
        {rooms.map((room) => {
          const roomOption = getRoomOptionById(room.icon_key) ?? getRoomOptionByType(room.room_type) ?? getFallbackRoomOption();

          return (
            <ListRowLink
              key={room.id}
              href={{ pathname: '/rooms/[id]', params: { id: room.id } }}
              icon={roomOption.icon}
              iconBackground={roomOption.tileColor}
              iconColor={roomOption.iconColor}
              name={room.name}
              meta={room.instructions?.trim() ? room.instructions.trim() : roomOption.label}
            />
          );
        })}
      </View>

      <View style={styles.section}>
        <View style={styles.rowBetween}>
          <SectionTitle>Turnovers</SectionTitle>
          <Link href={{ pathname: '/add-cleaning-job', params: { houseId } }} asChild>
            <Pressable style={styles.inlineAction}>
              <Plus color={colors.teal} size={14} strokeWidth={1.75} />
              <Text style={styles.inlineActionLabel}>Schedule job</Text>
            </Pressable>
          </Link>
        </View>
        <Text style={styles.meta}>Create a cleaning job for this property to generate the live room checklist runs.</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.rowBetween}>
          <SectionTitle>Property team access</SectionTitle>
          <Link href="/cleaners" asChild>
            <Pressable style={styles.linkRow}>
              <ShieldCheck color={colors.teal} size={16} strokeWidth={1.75} />
              <Text style={styles.linkText}>Manage access</Text>
            </Pressable>
          </Link>
        </View>
        <View style={styles.noteBlock}>
          <Text style={type.eyebrow}>Assigned access</Text>
          <Text style={type.noteBody}>
            Owners invite property team members, choose the properties they can update, and share a one-time access code.
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
  meta: {
    ...type.bodySmallMuted,
    color: colors.inkBody,
  },
  errorText: {
    ...type.bodySmallMuted,
    color: colors.rust,
  },
  rowBetween: {
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
  noteBlock: {
    backgroundColor: colors.paperRaised,
    borderRadius: radius.control,
    padding: space.md,
    gap: space.xs,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  linkText: {
    ...type.buttonLabel,
    color: colors.teal,
  },
  body: {
    ...type.body,
    color: colors.ink,
  },
});
