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
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Platform } from 'react-native';
import { useEffect } from 'react';
import 'react-native-reanimated';

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
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="team-register" />
      <Stack.Screen name="team-workspace" />
      <Stack.Screen name="add-property" />
      <Stack.Screen name="add-room" />
      <Stack.Screen name="room-icon-picker" />
      <Stack.Screen name="give-access" />
      <Stack.Screen name="houses/[id]" />
      <Stack.Screen name="rooms/[id]" />
      <Stack.Screen name="cleaners" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
