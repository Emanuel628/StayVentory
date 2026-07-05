import { getSupabaseClient } from '@/src/lib/supabase/client';

function requireSupabase() {
  const supabase = getSupabaseClient() as any;

  if (!supabase) {
    throw new Error('Supabase is not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.');
  }

  return supabase;
}

export async function listOwnerIssues() {
  const supabase = requireSupabase();

  return supabase
    .from('issues')
    .select(
      `
        id,
        title,
        description,
        category,
        priority,
        status,
        created_at,
        houses (
          id,
          name
        ),
        rooms (
          id,
          name
        )
      `,
    )
    .order('created_at', { ascending: false });
}
