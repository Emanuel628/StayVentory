import { Fraunces_600SemiBold, useFonts as useFrauncesFonts } from '@expo-google-fonts/fraunces';
import {
  IBMPlexMono_500Medium,
  useFonts as useMonoFonts,
} from '@expo-google-fonts/ibm-plex-mono';
import {
  IBMPlexSans_400Regular,
  IBMPlexSans_500Medium,
  useFonts as useSansFonts,
} from '@expo-google-fonts/ibm-plex-sans';
import { Stack, usePathname, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Platform, StyleSheet, View } from 'react-native';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { AppFooter } from '@/src/components/AppFooter';
import { AuthProvider, useAuth } from '@/src/providers/AuthProvider';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

if (Platform.OS !== 'web') {
  SplashScreen.preventAutoHideAsync();
}

export default function RootLayout() {
  const [frauncesLoaded, frauncesError] = useFrauncesFonts({
    Fraunces_600SemiBold,
  });
  const [sansLoaded, sansError] = useSansFonts({
    IBMPlexSans_400Regular,
    IBMPlexSans_500Medium,
  });
  const [monoLoaded, monoError] = useMonoFonts({
    IBMPlexMono_500Medium,
  });
  const loaded = Platform.OS === 'web' || (frauncesLoaded && sansLoaded && monoLoaded);
  const error = frauncesError ?? sansError ?? monoError;

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (Platform.OS !== 'web' && loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

function AppShell() {
  const router = useRouter();
  const pathname = usePathname();
  const { status, isConfigured, role, user } = useAuth();
  const publicPaths = new Set(['/welcome', '/login', '/register', '/forgot-password', '/team-register']);
  const resolvedRole = role ?? (user?.user_metadata.role as 'owner' | 'cleaner' | undefined) ?? null;
  const isPublicPath = publicPaths.has(pathname);
  const isOwnerSession = status === 'authenticated' && resolvedRole !== 'cleaner';
  const showOwnerPreviewFooter = status === 'unconfigured';
  const showFooter =
    (isOwnerSession || showOwnerPreviewFooter) &&
    !isPublicPath &&
    pathname !== '/+not-found' &&
    pathname !== '/team-workspace';

  useEffect(() => {
    if (!isConfigured || status === 'loading') {
      return;
    }

    if (status === 'signed_out' && !isPublicPath) {
      router.replace('/welcome');
      return;
    }

    if (status !== 'authenticated') {
      return;
    }

    if (resolvedRole === 'cleaner') {
      if (pathname !== '/team-workspace') {
        router.replace('/team-workspace');
      }

      return;
    }

    if (isPublicPath || pathname === '/team-workspace') {
      router.replace('/');
    }
  }, [isConfigured, isPublicPath, pathname, resolvedRole, router, status]);

  if (isConfigured && status === 'loading') {
    return null;
  }

  return (
    <View style={styles.shell}>
      <View style={styles.stackWrap}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="welcome" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="forgot-password" />
          <Stack.Screen name="team-register" />
          <Stack.Screen name="team-workspace" />
          <Stack.Screen name="add-property" />
          <Stack.Screen name="add-cleaning-job" />
          <Stack.Screen name="add-room" />
          <Stack.Screen name="cleaning-jobs/[id]" />
          <Stack.Screen name="room-icon-picker" />
          <Stack.Screen name="give-access" />
          <Stack.Screen name="houses/[id]" />
          <Stack.Screen name="rooms/[id]" />
          <Stack.Screen name="cleaners" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </View>
      {showFooter ? <AppFooter /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  stackWrap: {
    flex: 1,
  },
});
