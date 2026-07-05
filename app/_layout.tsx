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
import { useEffect } from 'react';
import 'react-native-reanimated';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

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
  const loaded = frauncesLoaded && sansLoaded && monoLoaded;
  const error = frauncesError ?? sansError ?? monoError;

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
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
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
