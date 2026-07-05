import { House, CalendarCheck2, TriangleAlert, NotebookPen, Settings2 } from 'lucide-react-native';
import { Tabs } from 'expo-router';

import { colors } from '@/src/theme/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.teal,
        tabBarInactiveTintColor: colors.inkMuted,
        tabBarStyle: {
          backgroundColor: colors.paper,
          borderTopColor: colors.hairline,
          height: 88,
          paddingTop: 10,
          paddingBottom: 14,
        },
        tabBarLabelStyle: {
          fontFamily: 'IBMPlexSans_500Medium',
          fontSize: 11,
        },
        sceneStyle: {
          backgroundColor: colors.paper,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Houses',
          tabBarIcon: ({ color }) => (
            <House color={color} size={20} strokeWidth={1.75} />
          ),
        }}
      />
      <Tabs.Screen
        name="cleaning"
        options={{
          title: 'Cleaning',
          tabBarIcon: ({ color }) => (
            <CalendarCheck2 color={color} size={20} strokeWidth={1.75} />
          ),
        }}
      />
      <Tabs.Screen
        name="issues"
        options={{
          title: 'Issues',
          tabBarIcon: ({ color }) => (
            <TriangleAlert color={color} size={20} strokeWidth={1.75} />
          ),
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: 'Notes',
          tabBarIcon: ({ color }) => (
            <NotebookPen color={color} size={20} strokeWidth={1.75} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <Settings2 color={color} size={20} strokeWidth={1.75} />
          ),
        }}
      />
    </Tabs>
  );
}
