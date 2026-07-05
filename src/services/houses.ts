import { getSupabaseClient } from '@/src/lib/supabase/client';

function requireSupabase() {
  const supabase = getSupabaseClient() as any;

  if (!supabase) {
    throw new Error('Supabase is not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.');
  }

  return supabase;
}

export async function listHouses() {
  const supabase = requireSupabase();

  return supabase
    .from('houses')
    .select('id, name, address_line_1, city, state, postal_code, country, created_at')
    .order('created_at', { ascending: false });
}

export async function getHouseWithRooms(houseId: string) {
  const supabase = requireSupabase();

  return supabase
    .from('houses')
    .select(
      `
        id,
        name,
        address_line_1,
        address_line_2,
        city,
        state,
        postal_code,
        country,
        created_at,
        rooms (
          id,
          house_id,
          name,
          room_type,
          icon_key,
          instructions,
          sort_order,
          created_at
        )
      `,
    )
    .eq('id', houseId)
    .single();
}

export async function createHouse(input: {
  ownerUserId: string;
  name: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
}) {
  const supabase = requireSupabase();

  return supabase
    .from('houses')
    .insert({
      owner_user_id: input.ownerUserId,
      name: input.name,
      address_line_1: input.addressLine1,
      address_line_2: input.addressLine2 ?? null,
      city: input.city,
      state: input.state,
      postal_code: input.postalCode,
      country: input.country ?? 'US',
    })
    .select()
    .single();
}
