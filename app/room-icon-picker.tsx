import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/src/components/Screen';
import { SectionTitle } from '@/src/components/SectionTitle';
import { roomOptions } from '@/src/data/roomOptions';
import { colors, iconTile, radius, space, type } from '@/src/theme/theme';

export default function RoomIconPickerScreen() {
  return (
    <Screen eyebrow="Room icons" title="Choose room SVG">
      <View style={styles.section}>
        <SectionTitle>Available room types</SectionTitle>
        <Text style={styles.helpText}>
          Choose the icon that best matches the room. This keeps room pages easy to scan and helps cover more than just the obvious spaces.
        </Text>
        <View style={styles.grid}>
          {roomOptions.map((option) => {
            const Icon = option.icon;
            return (
              <View key={option.id} style={styles.optionCard}>
                <View style={styles.iconTileWrap}>
                  <Icon color={colors.tealOnDark} size={iconTile.iconSize} strokeWidth={iconTile.strokeWidth} />
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
