import { getSupabaseClient } from '@/src/lib/supabase/client';

function requireSupabase() {
  const supabase = getSupabaseClient() as any;

  if (!supabase) {
    throw new Error('Supabase is not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.');
  }

  return supabase;
}

export async function listOwnerNotes() {
  const supabase = requireSupabase();

  return supabase
    .from('notes')
    .select(
      `
        id,
        body,
        audience,
        note_type,
        created_at,
        houses (
          id,
          name
        ),
        rooms (
          id,
          name
        ),
        profiles!notes_author_user_id_fkey (
          id,
          display_name,
          email
        )
      `,
    )
    .order('created_at', { ascending: false });
}
