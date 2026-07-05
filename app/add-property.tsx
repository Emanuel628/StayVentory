import { useRouter } from 'expo-router';
import { HousePlus } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Screen } from '@/src/components/Screen';
import { SectionTitle } from '@/src/components/SectionTitle';
import { useAuth } from '@/src/providers/AuthProvider';
import { createHouse } from '@/src/services/houses';
import { colors, radius, space, type } from '@/src/theme/theme';

export default function AddPropertyScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!user?.id) {
      setError('You must be signed in to create a property.');
      return;
    }

    if (!name.trim() || !addressLine1.trim() || !city.trim() || !state.trim() || !postalCode.trim()) {
      setError('Property title, address, city, state, and ZIP are required.');
      return;
    }

    try {
      setError('');
      setIsSubmitting(true);

      const { data, error: createError } = await createHouse({
        ownerUserId: user.id,
        name: name.trim(),
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2.trim() || null,
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
      });

      if (createError) {
        setError(createError.message);
        return;
      }

      router.replace({ pathname: '/houses/[id]', params: { id: data.id } });
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Unable to save property.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen eyebrow="Property" title="Add property" backHref="/houses" backLabel="Cancel">
      <View style={styles.section}>
        <SectionTitle>Property details</SectionTitle>
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Property title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter property title"
            placeholderTextColor={colors.inkMuted}
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Address line 1</Text>
          <TextInput
            style={styles.input}
            placeholder="Address line 1"
            placeholderTextColor={colors.inkMuted}
            value={addressLine1}
            onChangeText={setAddressLine1}
          />
        </View>
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Address line 2 (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Address line 2"
            placeholderTextColor={colors.inkMuted}
            value={addressLine2}
            onChangeText={setAddressLine2}
          />
        </View>
        <View style={styles.formRow}>
          <View style={[styles.formField, styles.formFieldFlex]}>
            <Text style={styles.fieldLabel}>City</Text>
            <TextInput
              style={styles.input}
              placeholder="City"
              placeholderTextColor={colors.inkMuted}
              value={city}
              onChangeText={setCity}
            />
          </View>
          <View style={[styles.formField, styles.stateField]}>
            <Text style={styles.fieldLabel}>State</Text>
            <TextInput
              style={styles.input}
              placeholder="FL"
              placeholderTextColor={colors.inkMuted}
              autoCapitalize="characters"
              value={state}
              onChangeText={setState}
            />
          </View>
          <View style={[styles.formField, styles.zipField]}>
            <Text style={styles.fieldLabel}>ZIP</Text>
            <TextInput
              style={styles.input}
              placeholder="33602"
              placeholderTextColor={colors.inkMuted}
              keyboardType="number-pad"
              inputMode="numeric"
              value={postalCode}
              onChangeText={setPostalCode}
            />
          </View>
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      <View style={styles.noteBlock}>
        <HousePlus color={colors.teal} size={18} strokeWidth={1.75} />
        <Text style={styles.noteText}>
          Save the property first. After that, use the property page to add rooms, room standards, and property team
          access.
        </Text>
      </View>

      <Pressable style={styles.saveButton} onPress={handleSave} disabled={isSubmitting}>
        <Text style={styles.saveLabel}>{isSubmitting ? 'Saving...' : 'Save'}</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: space.md,
  },
  formRow: {
    flexDirection: 'row',
    gap: space.sm,
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
  formFieldFlex: {
    flex: 1,
  },
  stateField: {
    width: 84,
  },
  zipField: {
    width: 110,
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
  errorText: {
    ...type.bodySmallMuted,
    color: colors.rust,
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
