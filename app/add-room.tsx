import { Link, useLocalSearchParams } from 'expo-router';
import { ChevronRight, ImagePlus } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Screen } from '@/src/components/Screen';
import { SectionTitle } from '@/src/components/SectionTitle';
import { roomOptions } from '@/src/data/roomOptions';
import { colors, radius, space, type } from '@/src/theme/theme';

export default function AddRoomScreen() {
  const params = useLocalSearchParams<{ selectedIcon?: string }>();
  const selectedRoomOption = roomOptions.find((option) => option.id === params.selectedIcon) ?? null;
  const SelectedIcon = selectedRoomOption?.icon;

  return (
    <Screen eyebrow="Room" title="Add room" backHref={{ pathname: '/houses/[id]', params: { id: 'linden-house' } }} backLabel="Back to house">
      <View style={styles.section}>
        <SectionTitle>Room details</SectionTitle>
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Title</Text>
          <TextInput style={styles.input} placeholder="Enter room title" placeholderTextColor={colors.inkMuted} />
        </View>
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Instructions</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Add full room instructions for cleaning, setup, and expectations"
            placeholderTextColor={colors.inkMuted}
            multiline
            textAlignVertical="top"
          />
        </View>
      </View>

      <View style={styles.section}>
        <SectionTitle>Room icon</SectionTitle>
        <Link
          href={{
            pathname: '/room-icon-picker',
            params: selectedRoomOption ? { selectedIcon: selectedRoomOption.id } : undefined,
          }}
          asChild>
          <Pressable style={styles.inlineRow}>
            <View style={styles.inlineLeft}>
              {SelectedIcon ? (
                <View
                  style={[
                    styles.selectedIconTile,
                    { backgroundColor: selectedRoomOption?.tileColor },
                  ]}>
                  <SelectedIcon color={selectedRoomOption?.iconColor} size={18} strokeWidth={1.75} />
                </View>
              ) : (
                <ImagePlus color={colors.teal} size={16} strokeWidth={1.75} />
              )}
              <View style={styles.inlineTextWrap}>
                <Text style={styles.inlineText}>{selectedRoomOption ? selectedRoomOption.label : 'Choose room icon'}</Text>
                <Text style={styles.inlineMeta}>
                  {selectedRoomOption ? 'Selected room icon' : 'Pick the icon that matches this room'}
                </Text>
              </View>
            </View>
            <ChevronRight color={colors.inkMuted} size={16} strokeWidth={1.75} />
          </Pressable>
        </Link>
      </View>

      <Pressable style={styles.saveButton}>
        <Text style={styles.saveLabel}>Save room</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: space.md,
  },
  formField: {
    backgroundColor: colors.paperRaised,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.control,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    gap: 2,
  },
  fieldLabel: {
    ...type.eyebrow,
    color: colors.ink,
  },
  input: {
    minHeight: 44,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.hairline,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    backgroundColor: colors.paper,
    ...type.body,
    color: colors.inkBody,
  },
  multilineInput: {
    minHeight: 132,
  },
  inlineRow: {
    paddingVertical: space.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
  },
  inlineLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    flex: 1,
  },
  inlineTextWrap: {
    gap: 2,
    flex: 1,
  },
  inlineText: {
    ...type.body,
    color: colors.ink,
  },
  inlineMeta: {
    ...type.bodySmallMuted,
    color: colors.inkBody,
  },
  selectedIconTile: {
    width: 34,
    height: 34,
    borderRadius: radius.tile,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  saveButton: {
    minHeight: 46,
    borderRadius: radius.control,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.lg,
  },
  saveLabel: {
    ...type.buttonLabel,
    color: colors.buttonPrimaryText,
  },
});
