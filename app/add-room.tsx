import { Link } from 'expo-router';
import { ChevronRight, ImagePlus } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Screen } from '@/src/components/Screen';
import { SectionTitle } from '@/src/components/SectionTitle';
import { colors, radius, space, type } from '@/src/theme/theme';

export default function AddRoomScreen() {
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
        <Link href="/room-icon-picker" asChild>
          <Pressable style={styles.inlineRow}>
            <View style={styles.inlineLeft}>
              <ImagePlus color={colors.teal} size={16} strokeWidth={1.75} />
              <Text style={styles.inlineText}>Choose room icon</Text>
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
  inlineText: {
    ...type.body,
    color: colors.ink,
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
