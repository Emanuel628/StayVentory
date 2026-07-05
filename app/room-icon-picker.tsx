import { Link, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/src/components/Screen';
import { SectionTitle } from '@/src/components/SectionTitle';
import { roomOptions } from '@/src/data/roomOptions';
import { colors, iconTile, radius, space, type } from '@/src/theme/theme';

export default function RoomIconPickerScreen() {
  const params = useLocalSearchParams<{ selectedIcon?: string; houseId?: string }>();
  const houseId = params.houseId ?? 'linden-house';

  return (
    <Screen
      eyebrow="Room icons"
      title="Choose room icon"
      backHref={{ pathname: '/add-room', params: { houseId, selectedIcon: params.selectedIcon } }}
      backLabel="Back to room">
      <View style={styles.section}>
        <SectionTitle>Available room types</SectionTitle>
        <Text style={styles.helpText}>
          Choose the icon that best matches the room. This keeps room pages easy to scan and helps cover more than just the obvious spaces.
        </Text>
        <View style={styles.grid}>
          {roomOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = params.selectedIcon === option.id;
            return (
              <Link
                key={option.id}
                href={{ pathname: '/add-room', params: { selectedIcon: option.id, houseId } }}
                asChild>
                <Pressable
                  style={StyleSheet.flatten([
                    styles.optionCard,
                    isSelected ? styles.optionCardSelected : null,
                  ])}>
                  <View style={[styles.iconTileWrap, { backgroundColor: option.tileColor }]}>
                    <Icon color={option.iconColor} size={iconTile.iconSize} strokeWidth={iconTile.strokeWidth} />
                  </View>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  <Text style={styles.optionMeta}>{isSelected ? 'Selected' : 'Tap to use this icon'}</Text>
                </Pressable>
              </Link>
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
  optionCardSelected: {
    borderColor: colors.teal,
    borderWidth: 2,
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
  optionMeta: {
    ...type.bodySmallMuted,
    color: colors.inkBody,
  },
});
