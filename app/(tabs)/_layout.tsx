import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';

import { colors } from '@/src/theme/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: 'none',
        },
        sceneStyle: {
          backgroundColor: colors.paper,
        },
      }}>
      <Tabs.Screen
        name="houses"
        options={{
          title: 'Houses',
        }}
      />
      <Tabs.Screen
        name="cleaning"
        options={{
          title: 'Cleaning',
        }}
      />
      <Tabs.Screen
        name="issues"
        options={{
          title: 'Issues',
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: 'Notes',
        }}
      />
    </Tabs>
  );
}
