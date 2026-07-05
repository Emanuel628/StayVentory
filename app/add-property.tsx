import { Link } from 'expo-router';
import { HousePlus, Plus, ShieldCheck } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Screen } from '@/src/components/Screen';
import { SectionTitle } from '@/src/components/SectionTitle';
import { colors, radius, space, type } from '@/src/theme/theme';

export default function AddPropertyScreen() {
  return (
    <Screen eyebrow="Property" title="Add property">
      <View style={styles.section}>
        <SectionTitle>Property details</SectionTitle>
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Property title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter property title"
            placeholderTextColor={colors.inkMuted}
          />
        </View>
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Address line 1"
            placeholderTextColor={colors.inkMuted}
          />
          <TextInput
            style={styles.input}
            placeholder="Address line 2"
            placeholderTextColor={colors.inkMuted}
          />
          <TextInput
            style={styles.input}
            placeholder="City, State ZIP"
            placeholderTextColor={colors.inkMuted}
          />
        </View>
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Description (optional)</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Add a short property note"
            placeholderTextColor={colors.inkMuted}
            multiline
            textAlignVertical="top"
          />
        </View>
      </View>

      <View style={styles.section}>
        <SectionTitle>Access and setup</SectionTitle>
        <Link href="/give-access" asChild>
          <Pressable style={styles.inlineRow}>
            <View style={styles.inlineLeft}>
              <ShieldCheck color={colors.teal} size={16} strokeWidth={1.75} />
              <Text style={styles.inlineText}>Give access to property team</Text>
            </View>
            <Text style={styles.inlineAction}>Open</Text>
          </Pressable>
        </Link>

        <View style={styles.inlineRow}>
          <View style={styles.inlineLeft}>
            <Plus color={colors.teal} size={16} strokeWidth={1.75} />
            <Text style={styles.inlineText}>Add room</Text>
          </View>
          <Text style={styles.inlineAction}>Open</Text>
        </View>
      </View>

      <View style={styles.noteBlock}>
        <HousePlus color={colors.teal} size={18} strokeWidth={1.75} />
        <Text style={styles.noteText}>Owners start by adding the property, then build rooms one by one and set room-specific inventory inside each room page.</Text>
      </View>
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
    minHeight: 88,
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
  inlineAction: {
    ...type.buttonLabel,
    color: colors.teal,
  },
  noteBlock: {
    backgroundColor: colors.paperRaised,
    borderRadius: radius.control,
    padding: space.md,
    gap: space.sm,
  },
  noteText: {
    ...type.noteBody,
    color: colors.inkBody,
  },
});
