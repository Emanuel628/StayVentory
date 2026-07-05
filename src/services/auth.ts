import type { Provider } from '@supabase/supabase-js';

import { getSupabaseClient } from '@/src/lib/supabase/client';
import type { Database } from '@/src/lib/supabase/database.types';

type AppRole = Database['public']['Enums']['app_role'];

function requireSupabase() {
  const supabase = getSupabaseClient();

  if (!supabase) {
    throw new Error('Supabase is not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.');
  }

  return supabase;
}

export async function signInWithPassword(email: string, password: string) {
  const supabase = requireSupabase();
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithPassword(input: {
  email: string;
  password: string;
  displayName: string;
  role: AppRole;
  username?: string;
}) {
  const supabase = requireSupabase();

  return supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        display_name: input.displayName,
        role: input.role,
        username: input.username ?? null,
      },
    },
  });
}

export async function signOut() {
  const supabase = requireSupabase();
  return supabase.auth.signOut();
}

export async function requestPasswordReset(email: string) {
  const supabase = requireSupabase();
  return supabase.auth.resetPasswordForEmail(email);
}

export async function signInWithOAuth(provider: Provider) {
  const supabase = requireSupabase();
  return supabase.auth.signInWithOAuth({ provider });
}
