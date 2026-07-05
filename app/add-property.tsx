import { Link } from 'expo-router';
import { HousePlus, Plus, ShieldCheck } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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
          <Text style={styles.fieldValue}>The Linden House</Text>
        </View>
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Address</Text>
          <Text style={styles.fieldValue}>1132 Linden Ave</Text>
          <Text style={styles.fieldValue}>Tampa, FL 33602</Text>
          <Text style={styles.fieldValue}>United States</Text>
        </View>
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Description (optional)</Text>
          <Text style={styles.fieldValue}>Three-bedroom short-term rental with a guest-ready supply standard for each room.</Text>
        </View>
      </View>

      <View style={styles.section}>
        <SectionTitle>Access and setup</SectionTitle>
        <Link href="/cleaners" asChild>
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
  fieldValue: {
    ...type.body,
    color: colors.inkBody,
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
