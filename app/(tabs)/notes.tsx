import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/src/components/Screen';
import { colors, radius, space, type } from '@/src/theme/theme';

const notes = [
  {
    id: '1',
    label: 'Owner note',
    house: 'The Linden House',
    body: 'Extra paper towels are in the laundry closet on the top shelf.',
  },
  {
    id: '2',
    label: 'Team update',
    house: 'Cedar Retreat',
    body: 'Kitchen was fully restocked. Dish soap is low and should be added to the next supply run.',
  },
];

export default function NotesScreen() {
  return (
    <Screen eyebrow="Notes" title="Owner notes and team updates">
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Latest updates</Text>
        {notes.map((note) => (
          <View key={note.id} style={styles.noteBlock}>
            <Text style={type.eyebrow}>{note.label}</Text>
            <Text style={styles.houseName}>{note.house}</Text>
            <Text style={type.noteBody}>{note.body}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: space.md,
  },
  sectionTitle: {
    ...type.eyebrow,
    color: colors.ink,
  },
  noteBlock: {
    backgroundColor: colors.paperRaised,
    borderRadius: radius.control,
    padding: space.md,
    gap: space.xs,
  },
  houseName: {
    ...type.houseName,
    color: colors.ink,
  },
});
