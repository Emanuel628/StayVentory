import { type PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';

import { isSupabaseConfigured } from '@/src/lib/env';
import { getSupabaseClient } from '@/src/lib/supabase/client';
import type { Database } from '@/src/lib/supabase/database.types';
import { ensureMyProfile } from '@/src/services/auth';

type AppRole = Database['public']['Enums']['app_role'];

type AuthStatus = 'loading' | 'authenticated' | 'signed_out' | 'unconfigured';

type AuthContextValue = {
  status: AuthStatus;
  isConfigured: boolean;
  session: Session | null;
  user: User | null;
  role: AppRole | null;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function readRole(userId: string): Promise<AppRole | null> {
  const supabase = getSupabaseClient() as any;

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    return null;
  }

  return (data?.role as AppRole | undefined) ?? null;
}

async function ensureProfileFromSessionUser(user: User) {
  const metadataRole = user.user_metadata.role as AppRole | undefined;

  if (!metadataRole) {
    return null;
  }

  await ensureMyProfile({
    role: metadataRole,
    email: user.email ?? null,
    displayName: (user.user_metadata.display_name as string | undefined) ?? (user.user_metadata.full_name as string | undefined) ?? null,
    username: (user.user_metadata.username as string | undefined) ?? null,
  });

  return readRole(user.id);
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<AuthStatus>(isSupabaseConfigured ? 'loading' : 'unconfigured');
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);

  useEffect(() => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      setStatus('unconfigured');
      return;
    }

    let isMounted = true;

    const bootstrap = async () => {
      const [{ data: authData }, profileRole] = await Promise.all([
        supabase.auth.getSession(),
        (async () => {
          const currentSession = (await supabase.auth.getSession()).data.session;
          return currentSession?.user ? ensureProfileFromSessionUser(currentSession.user) : null;
        })(),
      ]);

      if (!isMounted) {
        return;
      }

      setSession(authData.session);
      setRole(profileRole);
      setStatus(authData.session ? 'authenticated' : 'signed_out');
    };

    void bootstrap();

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setStatus(nextSession ? 'authenticated' : 'signed_out');

      if (nextSession?.user.id) {
        void ensureProfileFromSessionUser(nextSession.user).then((nextRole) => {
          if (isMounted) {
            setRole(nextRole);
          }
        });
      } else {
        setRole(null);
      }
    });

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      isConfigured: isSupabaseConfigured,
      session,
      user: session?.user ?? null,
      role,
      refreshSession: async () => {
        const supabase = getSupabaseClient();

        if (!supabase) {
          setStatus('unconfigured');
          return;
        }

        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setStatus(data.session ? 'authenticated' : 'signed_out');
        setRole(data.session?.user ? await ensureProfileFromSessionUser(data.session.user) : null);
      },
    }),
    [role, session, status],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}
