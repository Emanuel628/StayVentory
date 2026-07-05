import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, dot, type } from '@/src/theme/theme';

type Props = {
  current: number;
  required: number;
};

export function QuantityDots({ current, required }: Props) {
  const isBelowMinimum = current < required;
  const fillColor = isBelowMinimum ? colors.rust : colors.teal;

  return (
    <View style={styles.row}>
      <View style={styles.dots}>
        {Array.from({ length: required }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: i < current ? fillColor : colors.dotEmpty,
              },
            ]}
          />
        ))}
      </View>
      <Text style={[type.mono, { color: fillColor }]}>
        {current}/{required}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dots: {
    flexDirection: 'row',
    gap: dot.gap,
  },
  dot: {
    width: dot.size,
    height: dot.size,
    borderRadius: dot.size / 2,
  },
});
