import { getSupabaseClient } from '@/src/lib/supabase/client';

function requireSupabase() {
  const supabase = getSupabaseClient() as any;

  if (!supabase) {
    throw new Error('Supabase is not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.');
  }

  return supabase;
}

export async function createRoom(input: {
  houseId: string;
  name: string;
  roomType: string;
  iconKey?: string | null;
  instructions?: string | null;
  sortOrder?: number;
}) {
  const supabase = requireSupabase();

  return supabase
    .from('rooms')
    .insert({
      house_id: input.houseId,
      name: input.name,
      room_type: input.roomType,
      icon_key: input.iconKey ?? null,
      instructions: input.instructions ?? null,
      sort_order: input.sortOrder ?? 0,
    })
    .select()
    .single();
}

export async function getRoom(roomId: string) {
  const supabase = requireSupabase();

  return supabase
    .from('rooms')
    .select(
      `
        id,
        house_id,
        name,
        room_type,
        icon_key,
        instructions,
        sort_order,
        created_at,
        houses (
          id,
          name,
          address_line_1,
          city,
          state,
          postal_code
        )
      `,
    )
    .eq('id', roomId)
    .single();
}
