import { useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Camera, CircleAlert, NotebookPen, Plus } from 'lucide-react-native';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { QuantityDots } from '@/src/components/QuantityDots';
import { Screen } from '@/src/components/Screen';
import { SectionTitle } from '@/src/components/SectionTitle';
import { StatusStamp } from '@/src/components/StatusStamp';
import { getInstructionsByRoomId, getInventoryByRoomId, getIssuesByRoomId, getRoomById } from '@/src/data/mock';
import { colors, radius, space, type } from '@/src/theme/theme';

export default function RoomDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const room = getRoomById(params.id ?? '');
  const inventory = getInventoryByRoomId(room.id);
  const instructions = getInstructionsByRoomId(room.id);
  const issues = getIssuesByRoomId(room.id);

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
            <TextInput
              style={styles.input}
              placeholder="Item title"
              placeholderTextColor={colors.inkMuted}
            />
          </View>
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Description (optional)</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Optional item description"
              placeholderTextColor={colors.inkMuted}
              multiline
              textAlignVertical="top"
            />
          </View>
          <View style={styles.formGrid}>
            <View style={[styles.formField, styles.gridField]}>
              <Text style={styles.fieldLabel}>Min</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor={colors.inkMuted}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.formField, styles.gridField]}>
              <Text style={styles.fieldLabel}>Max</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor={colors.inkMuted}
                keyboardType="numeric"
              />
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
              <View style={styles.swipeCue}>
                <Text style={styles.swipeCueText}>Swipe left</Text>
                <ArrowLeft color={colors.inkMuted} size={14} strokeWidth={1.75} />
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
        <SectionTitle>Instructions</SectionTitle>
        {instructions.map((instruction) => (
          <View key={instruction.id} style={styles.simpleRow}>
            <Text style={styles.body}>{instruction.text}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <SectionTitle>Open issues</SectionTitle>
        {issues.map((issue) => (
          <View key={issue.id} style={styles.simpleRow}>
            <Text style={styles.body}>{issue.label}</Text>
          </View>
        ))}
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
    minHeight: 88,
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
  swipeCue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  swipeCueText: {
    ...type.bodySmallMuted,
    color: colors.inkMuted,
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
  simpleRow: {
    paddingVertical: space.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
});
