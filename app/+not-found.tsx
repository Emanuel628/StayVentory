import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { colors, space, type } from '@/src/theme/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not found', headerShown: false }} />
      <View style={styles.container}>
        <Text style={type.eyebrow}>Navigation</Text>
        <Text style={styles.title}>This screen does not exist.</Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Return to houses</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: space.xl,
    gap: space.sm,
  },
  title: {
    ...type.screenGreeting,
  },
  link: {
    paddingVertical: space.sm,
  },
  linkText: {
    ...type.buttonLabel,
    color: colors.teal,
  },
});
