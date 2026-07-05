import { StyleSheet, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

const palmColor = 'rgba(168, 83, 47, 0.2)';

function PalmCluster({ transform, scale = 1, rotation = 0 }: { transform: string; scale?: number; rotation?: number }) {
  return (
    <G transform={`${transform} rotate(${rotation}) scale(${scale})`}>
      <Path
        d="M48 162c22-20 47-31 76-34-24 13-42 32-56 58 21-11 43-17 68-17-27 18-46 41-57 69"
        fill="none"
        stroke={palmColor}
        strokeWidth="16"
        strokeLinecap="round"
      />
      <Path
        d="M61 204c11 34 13 68 6 103"
        fill="none"
        stroke={palmColor}
        strokeWidth="12"
        strokeLinecap="round"
      />
      <Path
        d="M79 150c28-3 55 4 81 21"
        fill="none"
        stroke={palmColor}
        strokeWidth="14"
        strokeLinecap="round"
      />
    </G>
  );
}

export function PalmBackdrop() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" viewBox="0 0 390 1200" preserveAspectRatio="xMidYMid slice">
        <PalmCluster transform="translate(-20 40)" scale={1.1} rotation={-8} />
        <PalmCluster transform="translate(260 120) scale(-0.9 0.9)" rotation={10} />
        <PalmCluster transform="translate(230 420)" scale={0.75} rotation={-18} />
        <PalmCluster transform="translate(-30 520)" scale={0.95} rotation={12} />
        <PalmCluster transform="translate(280 760) scale(-1.2 1.2)" rotation={-6} />
        <PalmCluster transform="translate(20 900)" scale={0.7} rotation={16} />
      </Svg>
    </View>
  );
}
