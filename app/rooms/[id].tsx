import { useLocalSearchParams } from 'expo-router';
import { Camera, CircleAlert, MapPin, NotebookPen } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { QuantityDots } from '@/src/components/QuantityDots';
import { Screen } from '@/src/components/Screen';
import { SectionTitle } from '@/src/components/SectionTitle';
import { StatusStamp } from '@/src/components/StatusStamp';
import { getInventoryByRoomId, getRoomById, ownerContact } from '@/src/data/mock';
import { colors, radius, space, type } from '@/src/theme/theme';

export default function RoomDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const room = getRoomById(params.id ?? '');
  const inventory = getInventoryByRoomId(room.id);

  return (
    <Screen eyebrow="Room" title={room.name}>
      <View style={styles.heroRow}>
        <View style={styles.heroText}>
          <Text style={styles.meta}>{room.meta}</Text>
          <Text style={styles.meta}>Each room is its own page with inventory, notes, proof, and issue updates.</Text>
        </View>
        <StatusStamp status={room.status} />
      </View>

      <View style={styles.section}>
        <SectionTitle>Inventory</SectionTitle>
        {inventory.map((item) => (
          <View key={item.id} style={styles.inventoryRow}>
            <View style={styles.inventoryText}>
              <Text style={styles.body}>{item.name}</Text>
              <Text style={styles.meta}>{item.storage}</Text>
            </View>
            <QuantityDots current={item.current} required={item.required} />
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <SectionTitle>Property team actions</SectionTitle>
        <View style={styles.noteBlock}>
          <View style={styles.noteRow}>
            <NotebookPen color={colors.teal} size={16} strokeWidth={1.75} />
            <Text style={styles.body}>Add a note for the owner specific to this Airbnb.</Text>
          </View>
          <View style={styles.noteRow}>
            <Camera color={colors.ochre} size={16} strokeWidth={1.75} />
            <Text style={styles.body}>Upload or replace photos and videos before final submission.</Text>
          </View>
          <View style={styles.noteRow}>
            <CircleAlert color={colors.rust} size={16} strokeWidth={1.75} />
            <Text style={styles.body}>Report missing, damaged, or replacement-needed items.</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <SectionTitle>Owner contact</SectionTitle>
        <View style={styles.contactBlock}>
          <Text style={styles.body}>{ownerContact.name}</Text>
          <Text style={styles.meta}>{ownerContact.phone}</Text>
          <Text style={styles.meta}>{ownerContact.email}</Text>
          <View style={styles.contactNote}>
            <MapPin color={colors.inkMuted} size={14} strokeWidth={1.75} />
            <Text style={styles.meta}>Visible only to assigned property team members.</Text>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: space.md,
  },
  heroText: {
    flex: 1,
    gap: space.xs,
  },
  section: {
    gap: space.md,
  },
  inventoryRow: {
    paddingVertical: space.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
  },
  inventoryText: {
    gap: 2,
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
  noteBlock: {
    backgroundColor: colors.paperRaised,
    borderRadius: radius.control,
    padding: space.md,
    gap: space.md,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.sm,
  },
  contactBlock: {
    paddingVertical: space.md,
    gap: space.xs,
  },
  contactNote: {
    paddingTop: space.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
});
