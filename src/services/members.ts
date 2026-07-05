import { getSupabaseClient } from '@/src/lib/supabase/client';

function requireSupabase() {
  const supabase = getSupabaseClient() as any;

  if (!supabase) {
    throw new Error('Supabase is not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.');
  }

  return supabase;
}

export async function listOwnerHouseMembers() {
  const supabase = requireSupabase();

  return supabase
    .from('house_members')
    .select(
      `
        id,
        house_id,
        member_user_id,
        status,
        can_manage_access,
        invite_code,
        created_at,
        houses (
          id,
          name
        ),
        profile:profiles!house_members_member_user_id_fkey (
          id,
          display_name,
          email,
          username,
          role
        )
      `,
    )
    .order('created_at', { ascending: false });
}
