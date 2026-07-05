import { House, HousePlus } from 'lucide-react-native';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';

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
          height: 84,
          paddingTop: 8,
          paddingBottom: 12,
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
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <View style={styles.homeCircle}>
              <House color={color} size={20} strokeWidth={1.75} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="houses"
        options={{
          title: 'Houses',
          tabBarIcon: ({ color }) => (
            <HousePlus color={color} size={20} strokeWidth={1.75} />
          ),
        }}
      />
      <Tabs.Screen
        name="cleaning"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="issues"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  homeCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: colors.hairline,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paperRaised,
  },
});
