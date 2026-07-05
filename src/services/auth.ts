import * as Linking from 'expo-linking';
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

export async function ensureMyProfile(input: {
  role: AppRole;
  email?: string | null;
  displayName?: string | null;
  username?: string | null;
}) {
  const supabase = requireSupabase() as any;

  return supabase.rpc('ensure_my_profile', {
    profile_role: input.role,
    profile_email: input.email ?? null,
    profile_display_name: input.displayName ?? null,
    profile_username: input.username ?? null,
  });
}

export async function emailExistsForSignup(email: string) {
  const supabase = requireSupabase() as any;
  return supabase.rpc('email_exists_for_signup', { target_email: email });
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
  return supabase.auth.signOut({ scope: 'local' });
}

export async function requestPasswordReset(email: string) {
  const supabase = requireSupabase();
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: Linking.createURL('/login'),
  });
}

export async function signInWithOAuth(provider: Provider) {
  const supabase = requireSupabase();
  return supabase.auth.signInWithOAuth({ provider });
}

export async function deleteMyAccount() {
  const supabase = requireSupabase();
  return supabase.rpc('delete_my_account');
}
