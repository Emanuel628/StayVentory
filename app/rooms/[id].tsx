import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Home } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/src/components/Screen';
import { SectionTitle } from '@/src/components/SectionTitle';
import { getFallbackRoomOption, getRoomOptionById, getRoomOptionByType } from '@/src/data/roomOptions';
import { getRoom } from '@/src/services/rooms';
import { colors, space, type } from '@/src/theme/theme';

export default function RoomDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const roomId = params.id ?? '';
  const [room, setRoom] = useState<{
    id: string;
    house_id: string;
    name: string;
    room_type: string;
    icon_key: string | null;
    instructions: string | null;
    sort_order: number;
    houses:
      | {
          id: string;
          name: string;
          address_line_1: string;
          city: string;
          state: string;
          postal_code: string;
        }
      | {
          id: string;
          name: string;
          address_line_1: string;
          city: string;
          state: string;
          postal_code: string;
        }[]
      | null;
  } | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRoom = async () => {
      if (!roomId) {
        setError('Room not found.');
        setIsLoading(false);
        return;
      }

      try {
        setError('');
        setIsLoading(true);

        const { data, error: loadError } = await getRoom(roomId);

        if (loadError) {
          setError(loadError.message);
          return;
        }

        setRoom(data);
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : 'Unable to load room.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadRoom();
  }, [roomId]);

  const house = Array.isArray(room?.houses) ? room.houses[0] : room?.houses ?? null;
  const roomOption = getRoomOptionById(room?.icon_key) ?? getRoomOptionByType(room?.room_type) ?? getFallbackRoomOption();
  const RoomIcon = roomOption.icon;

  return (
    <Screen
      eyebrow="Room"
      title={room?.name ?? 'Room'}
      backHref={house ? { pathname: '/houses/[id]', params: { id: house.id } } : '/houses'}
      backLabel="Back to house">
      <View style={styles.heroRow}>
        <View style={styles.heroIconTile}>
          <RoomIcon color={roomOption.iconColor} size={20} strokeWidth={1.75} />
        </View>
        <View style={styles.heroText}>
          {isLoading ? <Text style={styles.meta}>Loading room...</Text> : null}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {house ? <Text style={styles.meta}>{house.name}</Text> : null}
          {room ? <Text style={styles.meta}>{roomOption.label}</Text> : null}
        </View>
      </View>

      <View style={styles.section}>
        <SectionTitle>Room instructions</SectionTitle>
        <View style={styles.infoBlock}>
          <Text style={styles.body}>
            {room?.instructions?.trim() || 'No room instructions added yet.'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <SectionTitle>Inventory</SectionTitle>
        <View style={styles.infoBlock}>
          <Text style={styles.body}>Inventory wiring is the next live slice for this room.</Text>
          <Text style={styles.meta}>
            The room record is live now. Next we attach tracked items, minimum quantities, and ready-state rules.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <SectionTitle>Guest-ready standard</SectionTitle>
        <View style={styles.infoBlock}>
          <Text style={styles.body}>Checklist standards and proof requirements come next on top of this live room record.</Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  heroIconTile: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paperRaised,
    flexShrink: 0,
  },
  heroText: {
    flex: 1,
    gap: space.xs,
  },
  section: {
    gap: space.md,
  },
  infoBlock: {
    backgroundColor: colors.paperRaised,
    borderRadius: 3,
    padding: space.md,
    gap: space.xs,
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
