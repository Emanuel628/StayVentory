import { StyleSheet, Text } from 'react-native';

import { colors, type } from '@/src/theme/theme';

export function SectionTitle({ children }: { children: string }) {
  return <Text style={styles.title}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    ...type.eyebrow,
    color: colors.ink,
  },
});
