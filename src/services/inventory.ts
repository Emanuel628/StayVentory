import type { Database } from '@/src/lib/supabase/database.types';
import { getSupabaseClient } from '@/src/lib/supabase/client';

type InventoryStatus = Database['public']['Enums']['inventory_status'];

function requireSupabase() {
  const supabase = getSupabaseClient() as any;

  if (!supabase) {
    throw new Error('Supabase is not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.');
  }

  return supabase;
}

function getInventoryStatus(currentQuantity: number, minimumQuantity: number): InventoryStatus {
  if (currentQuantity < minimumQuantity) {
    return 'low_stock';
  }

  return 'ready';
}

export async function listRoomInventory(roomId: string) {
  const supabase = requireSupabase();

  return supabase
    .from('room_inventory_items')
    .select(
      `
        id,
        room_id,
        inventory_item_id,
        description,
        minimum_quantity,
        maximum_quantity,
        current_quantity,
        status,
        display_order,
        required_for_ready,
        storage_location_note,
        created_at,
        updated_at,
        inventory_items (
          id,
          name,
          unit_type,
          tracks_quantity
        )
      `,
    )
    .eq('room_id', roomId)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true });
}

export async function createRoomInventoryItem(input: {
  roomId: string;
  name: string;
  description?: string | null;
  minimumQuantity: number;
  maximumQuantity: number;
}) {
  const supabase = requireSupabase();

  const { data: inventoryItem, error: inventoryItemError } = await supabase
    .from('inventory_items')
    .insert({
      name: input.name,
      unit_type: 'count',
      tracks_quantity: true,
    })
    .select('id, name, unit_type, tracks_quantity')
    .single();

  if (inventoryItemError) {
    return { data: null, error: inventoryItemError };
  }

  const currentQuantity = input.maximumQuantity;
  const status = getInventoryStatus(currentQuantity, input.minimumQuantity);

  const { data, error } = await supabase
    .from('room_inventory_items')
    .insert({
      room_id: input.roomId,
      inventory_item_id: inventoryItem.id,
      description: input.description ?? null,
      minimum_quantity: input.minimumQuantity,
      maximum_quantity: input.maximumQuantity,
      current_quantity: currentQuantity,
      status,
      display_order: 0,
      required_for_ready: true,
    })
    .select(
      `
        id,
        room_id,
        inventory_item_id,
        description,
        minimum_quantity,
        maximum_quantity,
        current_quantity,
        status,
        display_order,
        required_for_ready,
        storage_location_note,
        created_at,
        updated_at,
        inventory_items (
          id,
          name,
          unit_type,
          tracks_quantity
        )
      `,
    )
    .single();

  return { data, error };
}
