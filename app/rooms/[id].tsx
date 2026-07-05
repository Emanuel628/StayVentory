import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Screen } from '@/src/components/Screen';
import { SectionTitle } from '@/src/components/SectionTitle';
import { getFallbackRoomOption, getRoomOptionById, getRoomOptionByType } from '@/src/data/roomOptions';
import { createRoomInventoryItem, listRoomInventory } from '@/src/services/inventory';
import { getRoom } from '@/src/services/rooms';
import { colors, radius, space, type } from '@/src/theme/theme';

type HouseRecord = {
  id: string;
  name: string;
  address_line_1: string;
  city: string;
  state: string;
  postal_code: string;
};

type RoomRecord = {
  id: string;
  house_id: string;
  name: string;
  room_type: string;
  icon_key: string | null;
  instructions: string | null;
  sort_order: number;
  houses: HouseRecord | HouseRecord[] | null;
};

type RoomInventoryRecord = {
  id: string;
  room_id: string;
  inventory_item_id: string;
  description: string | null;
  minimum_quantity: number;
  maximum_quantity: number;
  current_quantity: number | null;
  status: string;
  display_order: number;
  required_for_ready: boolean;
  storage_location_note: string | null;
  inventory_items:
    | {
        id: string;
        name: string;
        unit_type: string;
        tracks_quantity: boolean;
      }
    | {
        id: string;
        name: string;
        unit_type: string;
        tracks_quantity: boolean;
      }[]
    | null;
};

function toIntegerText(value: string) {
  return value.replace(/\D/g, '');
}

export default function RoomDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const roomId = params.id ?? '';
  const [room, setRoom] = useState<RoomRecord | null>(null);
  const [inventory, setInventory] = useState<RoomInventoryRecord[]>([]);
  const [error, setError] = useState('');
  const [inventoryError, setInventoryError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [minText, setMinText] = useState('');
  const [maxText, setMaxText] = useState('');
  const [isSavingItem, setIsSavingItem] = useState(false);

  const loadRoomDetail = useCallback(async () => {
    if (!roomId) {
      setError('Room not found.');
      setIsLoading(false);
      return;
    }

    try {
      setError('');
      setInventoryError('');
      setIsLoading(true);

      const [{ data: roomData, error: roomError }, { data: inventoryData, error: inventoryLoadError }] = await Promise.all([
        getRoom(roomId),
        listRoomInventory(roomId),
      ]);

      if (roomError) {
        setError(roomError.message);
        return;
      }

      if (inventoryLoadError) {
        setInventoryError(inventoryLoadError.message);
      }

      setRoom(roomData as RoomRecord);
      setInventory((inventoryData ?? []) as RoomInventoryRecord[]);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Unable to load room.');
    } finally {
      setIsLoading(false);
    }
  }, [roomId]);

  useFocusEffect(
    useCallback(() => {
      void loadRoomDetail();
    }, [loadRoomDetail]),
  );

  const handleSaveItem = async () => {
    const nextTitle = title.trim();
    const minimumQuantity = Number.parseInt(minText || '0', 10);
    const maximumQuantity = Number.parseInt(maxText || '0', 10);

    if (!room?.id) {
      setInventoryError('Room must exist before items can be added.');
      return;
    }

    if (!nextTitle || minimumQuantity <= 0 || maximumQuantity <= 0) {
      setInventoryError('Title, min, and max are required.');
      return;
    }

    if (maximumQuantity < minimumQuantity) {
      setInventoryError('Max must be greater than or equal to min.');
      return;
    }

    try {
      setInventoryError('');
      setIsSavingItem(true);

      const { data, error: createError } = await createRoomInventoryItem({
        roomId: room.id,
        name: nextTitle,
        description: description.trim() || null,
        minimumQuantity,
        maximumQuantity,
      });

      if (createError) {
        setInventoryError(createError.message);
        return;
      }

      setInventory((current) => [...current, data as RoomInventoryRecord]);
      setTitle('');
      setDescription('');
      setMinText('');
      setMaxText('');
      setIsAddingItem(false);
    } catch (nextError) {
      setInventoryError(nextError instanceof Error ? nextError.message : 'Unable to save inventory item.');
    } finally {
      setIsSavingItem(false);
    }
  };

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
        <View style={[styles.heroIconTile, { backgroundColor: roomOption.tileColor }]}>
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
          <Text style={styles.body}>{room?.instructions?.trim() || 'No room instructions added yet.'}</Text>
        </View>
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
              <Text style={styles.fieldLabel}>Item description (optional)</Text>
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
              <Pressable style={styles.primaryButton} onPress={handleSaveItem} disabled={isSavingItem}>
                <Text style={styles.primaryButtonLabel}>{isSavingItem ? 'Saving item...' : 'Save item'}</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        {inventoryError ? <Text style={styles.errorText}>{inventoryError}</Text> : null}

        {!isLoading && !error && !inventory.length ? (
          <View style={styles.infoBlock}>
            <Text style={styles.body}>No items added to this room yet.</Text>
            <Text style={styles.meta}>Tap + Add item to build this room inventory.</Text>
          </View>
        ) : null}

        {inventory.map((item) => {
          const inventoryItem = Array.isArray(item.inventory_items) ? item.inventory_items[0] : item.inventory_items;

          return (
            <View key={item.id} style={styles.inventoryRow}>
              <View style={styles.inventoryText}>
                <Text style={styles.body}>{inventoryItem?.name ?? 'Inventory item'}</Text>
                {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
                <Text style={styles.meta}>
                  Min {item.minimum_quantity} | Max {item.maximum_quantity}
                </Text>
              </View>
              <View style={styles.inventoryRight}>
                <Text style={styles.inventoryCount}>
                  {(item.current_quantity ?? 0)}/{item.maximum_quantity}
                </Text>
              </View>
            </View>
          );
        })}
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
    flexShrink: 0,
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
  infoBlock: {
    backgroundColor: colors.paperRaised,
    borderRadius: 3,
    padding: space.md,
    gap: space.xs,
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
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: space.sm,
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
  errorText: {
    ...type.bodySmallMuted,
    color: colors.rust,
  },
});
