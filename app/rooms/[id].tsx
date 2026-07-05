import { useLocalSearchParams } from 'expo-router';
import { Camera, CircleAlert, MapPin, NotebookPen, PencilLine, Plus, Trash2 } from 'lucide-react-native';
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
        <View style={styles.sectionHeader}>
          <SectionTitle>Inventory</SectionTitle>
          <View style={styles.inlineAction}>
            <Plus color={colors.teal} size={14} strokeWidth={1.75} />
            <Text style={styles.inlineActionLabel}>Add item</Text>
          </View>
        </View>
        <View style={styles.formBlock}>
          <Text style={styles.formTitle}>Add item to this room</Text>
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Title</Text>
            <Text style={styles.fieldValue}>Toilet brush</Text>
          </View>
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Description (optional)</Text>
            <Text style={styles.fieldValue}>Guest bathroom cleaning tool stored beside the toilet.</Text>
          </View>
          <View style={styles.formGrid}>
            <View style={[styles.formField, styles.gridField]}>
              <Text style={styles.fieldLabel}>Min</Text>
              <Text style={styles.fieldValue}>1</Text>
            </View>
            <View style={[styles.formField, styles.gridField]}>
              <Text style={styles.fieldLabel}>Max</Text>
              <Text style={styles.fieldValue}>2</Text>
            </View>
          </View>
        </View>
        <Text style={styles.swipeHint}>Swipe left on an item to edit or delete.</Text>
        {inventory.map((item) => (
          <View key={item.id} style={styles.inventoryRow}>
            <View style={styles.inventoryText}>
              <Text style={styles.body}>{item.name}</Text>
              {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
              <Text style={styles.meta}>{item.storage}</Text>
              <Text style={styles.meta}>
                Min {item.minRequired} | Max {item.maxPar}
              </Text>
            </View>
            <View style={styles.inventoryRight}>
              <QuantityDots current={item.current} required={item.minRequired} />
              <View style={styles.swipeActions}>
                <View style={styles.actionChip}>
                  <PencilLine color={colors.teal} size={13} strokeWidth={1.75} />
                  <Text style={styles.actionText}>Edit</Text>
                </View>
                <View style={styles.actionChip}>
                  <Trash2 color={colors.rust} size={13} strokeWidth={1.75} />
                  <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
                </View>
              </View>
            </View>
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
  formBlock: {
    backgroundColor: colors.paperRaised,
    borderRadius: radius.control,
    padding: space.md,
    gap: space.sm,
  },
  formTitle: {
    ...type.body,
    color: colors.ink,
  },
  formField: {
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.control,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    gap: 2,
  },
  formGrid: {
    flexDirection: 'row',
    gap: space.sm,
  },
  gridField: {
    flex: 1,
  },
  fieldLabel: {
    ...type.eyebrow,
    color: colors.ink,
  },
  fieldValue: {
    ...type.body,
    color: colors.inkBody,
  },
  swipeHint: {
    ...type.bodySmallMuted,
    color: colors.inkBody,
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
  inventoryRight: {
    alignItems: 'flex-end',
    gap: space.sm,
  },
  description: {
    ...type.noteBody,
    color: colors.inkBody,
  },
  swipeActions: {
    flexDirection: 'row',
    gap: space.xs,
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.control,
    paddingHorizontal: space.sm,
    paddingVertical: 6,
    backgroundColor: colors.paper,
  },
  actionText: {
    ...type.bodySmallMuted,
    color: colors.teal,
  },
  deleteText: {
    color: colors.rust,
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
