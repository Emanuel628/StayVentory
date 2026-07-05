import { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, space, type } from '@/src/theme/theme';

type ScreenProps = {
  eyebrow: string;
  title: string;
  children: ReactNode;
};

export function Screen({ eyebrow, title, children }: ScreenProps) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={type.eyebrow}>{eyebrow}</Text>
        <Text style={type.screenGreeting}>{title}</Text>
      </View>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  content: {
    paddingHorizontal: space.xl,
    paddingTop: space.lg,
    paddingBottom: 96,
    gap: 28,
  },
  header: {
    gap: space.xs,
  },
});
