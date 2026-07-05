import { CalendarCheck2, HousePlus, NotebookPen, Settings2, ShieldCheck, TriangleAlert } from 'lucide-react-native';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

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
          height: 92,
          paddingTop: 10,
          paddingBottom: 12,
        },
        tabBarLabelStyle: {
          fontFamily: 'IBMPlexSans_500Medium',
          fontSize: 10,
        },
        sceneStyle: {
          backgroundColor: colors.paper,
        },
      }}>
      <Tabs.Screen
        name="houses"
        options={{
          title: 'Houses',
          tabBarIcon: ({ color }) => <HousePlus color={color} size={18} strokeWidth={1.75} />,
        }}
      />
      <Tabs.Screen
        name="cleaning"
        options={{
          title: 'Cleaning',
          tabBarIcon: ({ color }) => <CalendarCheck2 color={color} size={18} strokeWidth={1.75} />,
        }}
      />
      <Tabs.Screen
        name="issues"
        options={{
          title: 'Issues',
          tabBarIcon: ({ color }) => <TriangleAlert color={color} size={18} strokeWidth={1.75} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <View style={styles.homeCircle}>
              <Svg width={18} height={18} viewBox="0 0 18 18">
                <Rect x="3" y="3" width="12" height="12" rx="1.5" fill={color} />
              </Svg>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: 'Notes',
          tabBarIcon: ({ color }) => <NotebookPen color={color} size={18} strokeWidth={1.75} />,
        }}
      />
      <Tabs.Screen
        name="cleaners"
        options={{
          title: 'Cleaners',
          tabBarIcon: ({ color }) => <ShieldCheck color={color} size={18} strokeWidth={1.75} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Settings2 color={color} size={18} strokeWidth={1.75} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  homeCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.teal,
    marginTop: -4,
  },
});
