import { StyleSheet, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

const palmColor = 'rgba(168, 83, 47, 0.22)';

export function PalmBackdrop() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice">
        <G transform="translate(-8 64)">
          <Path
            d="M48 162c22-20 47-31 76-34-24 13-42 32-56 58 21-11 43-17 68-17-27 18-46 41-57 69"
            fill="none"
            stroke={palmColor}
            strokeWidth="16"
            strokeLinecap="round"
          />
          <Path d="M61 204c11 34 13 68 6 103" fill="none" stroke={palmColor} strokeWidth="12" strokeLinecap="round" />
          <Path d="M79 150c28-3 55 4 81 21" fill="none" stroke={palmColor} strokeWidth="14" strokeLinecap="round" />
        </G>
        <G transform="translate(252 424) scale(-1 1)">
          <Path
            d="M48 162c22-20 47-31 76-34-24 13-42 32-56 58 21-11 43-17 68-17-27 18-46 41-57 69"
            fill="none"
            stroke={palmColor}
            strokeWidth="16"
            strokeLinecap="round"
          />
          <Path d="M61 204c11 34 13 68 6 103" fill="none" stroke={palmColor} strokeWidth="12" strokeLinecap="round" />
          <Path d="M79 150c28-3 55 4 81 21" fill="none" stroke={palmColor} strokeWidth="14" strokeLinecap="round" />
        </G>
      </Svg>
    </View>
  );
}
