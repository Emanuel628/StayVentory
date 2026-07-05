import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/src/components/Screen';
import { SectionTitle } from '@/src/components/SectionTitle';
import { roomOptions } from '@/src/data/roomOptions';
import { colors, iconTile, radius, space, type } from '@/src/theme/theme';

const iconPalettes = [
  { tile: colors.teal, icon: colors.tealOnDark },
  { tile: colors.ochre, icon: colors.ochreOnDark },
  { tile: colors.rust, icon: colors.rustOnDark },
  { tile: '#6C7A5A', icon: '#EEF2E7' },
  { tile: '#8B5E3C', icon: '#F6E8DC' },
  { tile: '#4E6A74', icon: '#E3EEF2' },
  { tile: '#7D6A91', icon: '#EEE8F4' },
  { tile: '#A05D5D', icon: '#F7E7E7' },
];

export default function RoomIconPickerScreen() {
  return (
    <Screen eyebrow="Room icons" title="Choose room icon" backHref="/add-room" backLabel="Back to room">
      <View style={styles.section}>
        <SectionTitle>Available room types</SectionTitle>
        <Text style={styles.helpText}>
          Choose the icon that best matches the room. This keeps room pages easy to scan and helps cover more than just the obvious spaces.
        </Text>
        <View style={styles.grid}>
          {roomOptions.map((option, index) => {
            const Icon = option.icon;
            const palette = iconPalettes[index % iconPalettes.length];
            return (
              <View key={option.id} style={styles.optionCard}>
                <View style={[styles.iconTileWrap, { backgroundColor: palette.tile }]}>
                  <Icon color={palette.icon} size={iconTile.iconSize} strokeWidth={iconTile.strokeWidth} />
                </View>
                <Text style={styles.optionLabel}>{option.label}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: space.md,
  },
  helpText: {
    ...type.noteBody,
    color: colors.inkBody,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
  },
  optionCard: {
    width: '47%',
    backgroundColor: colors.paperRaised,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.control,
    padding: space.md,
    gap: space.sm,
  },
  iconTileWrap: {
    width: iconTile.size,
    height: iconTile.size,
    borderRadius: radius.tile,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabel: {
    ...type.body,
    color: colors.ink,
  },
});
