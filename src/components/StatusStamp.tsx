import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { stamp, statusColor, statusLabel, type StatusKey, type } from '@/src/theme/theme';

type Props = {
  status: StatusKey;
};

export function StatusStamp({ status }: Props) {
  const color = statusColor[status];
  const [line1, line2] = statusLabel[status];
  const radius = stamp.size / 2;

  return (
    <View
      style={[
        styles.wrapper,
        {
          width: stamp.size,
          height: stamp.size,
          transform: [{ rotate: `${stamp.rotationDeg}deg` }],
        },
      ]}>
      <Svg width={stamp.size} height={stamp.size} style={StyleSheet.absoluteFill}>
        <Circle
          cx={radius}
          cy={radius}
          r={radius - stamp.strokeWidth}
          stroke={color}
          strokeWidth={stamp.strokeWidth}
          strokeDasharray={stamp.dashArray}
          fill="none"
        />
      </Svg>
      <View style={styles.labelBlock}>
        <Text style={[type.stampLabel, { color }]}>{line1}</Text>
        <Text style={[type.stampLabel, { color }]}>{line2}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  labelBlock: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
