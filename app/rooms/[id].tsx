import { useLocalSearchParams } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Screen } from '@/src/components/Screen';
import { SectionTitle } from '@/src/components/SectionTitle';
import { StatusStamp } from '@/src/components/StatusStamp';
import {
  type InventoryRow,
  getInventoryByRoomId,
  getRoomById,
} from '@/src/data/mock';
import { colors, radius, space, type } from '@/src/theme/theme';

function toIntegerText(value: string) {
  return value.replace(/\D/g, '');
}

export default function RoomDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const room = getRoomById(params.id ?? '');
  const [inventory, setInventory] = useState<InventoryRow[]>(() => getInventoryByRoomId(room.id));
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [minText, setMinText] = useState('');
  const [maxText, setMaxText] = useState('');

  useEffect(() => {
    setInventory(getInventoryByRoomId(room.id));
    setIsAddingItem(false);
    setTitle('');
    setDescription('');
    setMinText('');
    setMaxText('');
  }, [room.id]);

  const saveItem = () => {
    const nextTitle = title.trim();
    const minRequired = Number.parseInt(minText || '0', 10);
    const maxPar = Number.parseInt(maxText || '0', 10);

    if (!nextTitle || minRequired <= 0 || maxPar <= 0) {
      return;
    }

    setInventory((current) => [
      ...current,
      {
        id: `${room.id}-${Date.now()}`,
        roomId: room.id,
        name: nextTitle,
        description: description.trim() || undefined,
        current: minRequired,
        minRequired,
        maxPar,
        storage: '',
      },
    ]);
    setTitle('');
    setDescription('');
    setMinText('');
    setMaxText('');
    setIsAddingItem(false);
  };

  return (
    <Screen
      eyebrow="Room"
      title={room.name}
      backHref={{ pathname: '/houses/[id]', params: { id: room.houseId } }}
      backLabel="Back to house">
      <View style={styles.heroRow}>
        <View style={styles.heroText}>
          <Text style={styles.meta}>{room.meta}</Text>
          <Text style={styles.meta}>Each room is its own page with item-by-item inventory for the owner.</Text>
        </View>
        <StatusStamp status={room.status} />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <SectionTitle>Inventory</SectionTitle>
          <Pressable style={styles.inlineAction} onPress={() => setIsAddingItem(true)}>
            <Plus color={colors.teal} size={14} strokeWidth={1.75} />
            <Text style={styles.inlineActionLabel}>Add item</Text>
          </Pressable>
        </View>
        {isAddingItem ? (
          <View style={styles.formBlock}>
            <Text style={styles.formTitle}>Add item to this room</Text>
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Item title"
                placeholderTextColor={colors.inkMuted}
                value={title}
                onChangeText={setTitle}
              />
            </View>
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Item instructions (optional)</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                placeholder="Add item-specific setup or restock instructions"
                placeholderTextColor={colors.inkMuted}
                multiline
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
              />
            </View>
            <View style={styles.formGrid}>
              <View style={[styles.formField, styles.gridField]}>
                <Text style={styles.fieldLabel}>Min</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor={colors.inkMuted}
                  keyboardType="number-pad"
                  inputMode="numeric"
                  value={minText}
                  onChangeText={(value) => setMinText(toIntegerText(value))}
                />
              </View>
              <View style={[styles.formField, styles.gridField]}>
                <Text style={styles.fieldLabel}>Max</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor={colors.inkMuted}
                  keyboardType="number-pad"
                  inputMode="numeric"
                  value={maxText}
                  onChangeText={(value) => setMaxText(toIntegerText(value))}
                />
              </View>
            </View>
            <View style={styles.formActions}>
              <Pressable style={styles.secondaryButton} onPress={() => setIsAddingItem(false)}>
                <Text style={styles.secondaryButtonLabel}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.primaryButton} onPress={saveItem}>
                <Text style={styles.primaryButtonLabel}>Save item</Text>
              </Pressable>
            </View>
          </View>
        ) : null}
        {inventory.length ? (
          <>
            {inventory.map((item) => (
              <View key={item.id} style={styles.inventoryRow}>
                <View style={styles.inventoryText}>
                  <Text style={styles.body}>{item.name}</Text>
                  {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
                  {item.storage ? <Text style={styles.meta}>{item.storage}</Text> : null}
                  <Text style={styles.meta}>
                    Min {item.minRequired} | Max {item.maxPar}
                  </Text>
                </View>
                <View style={styles.inventoryRight}>
                  <Text style={styles.inventoryCount}>
                    {item.current}/{item.minRequired}
                  </Text>
                </View>
              </View>
            ))}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.body}>No items added to this room yet.</Text>
            <Text style={styles.meta}>Tap + Add item to build this room inventory.</Text>
          </View>
        )}
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
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: space.sm,
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
  emptyState: {
    backgroundColor: colors.paperRaised,
    borderRadius: radius.control,
    padding: space.md,
    gap: space.xs,
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
    justifyContent: 'center',
  },
  inventoryCount: {
    ...type.body,
    color: colors.ink,
  },
  description: {
    ...type.noteBody,
    color: colors.inkBody,
  },
  body: {
    ...type.body,
    color: colors.ink,
  },
  meta: {
    ...type.bodySmallMuted,
    color: colors.inkBody,
  },
  secondaryButton: {
    minHeight: 40,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.hairline,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.md,
    backgroundColor: colors.paper,
  },
  secondaryButtonLabel: {
    ...type.buttonLabel,
    color: colors.ink,
  },
  primaryButton: {
    minHeight: 40,
    borderRadius: radius.control,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.md,
    backgroundColor: colors.teal,
  },
  primaryButtonLabel: {
    ...type.buttonLabel,
    color: colors.buttonPrimaryText,
  },
});
