import { ScrollView, StyleSheet, Text, View } from 'react-native';

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
    label: 'Property team note',
    house: 'Cedar Retreat',
    body: 'Kitchen was fully restocked. Dish soap is low and should be added to the next supply run.',
  },
];

export default function NotesScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={type.eyebrow}>Notes</Text>
        <Text style={type.screenGreeting}>Short, useful context</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Latest notes</Text>
        {notes.map((note) => (
          <View key={note.id} style={styles.noteBlock}>
            <Text style={type.eyebrow}>{note.label}</Text>
            <Text style={styles.houseName}>{note.house}</Text>
            <Text style={type.noteBody}>{note.body}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  content: {
    paddingHorizontal: space.xl,
    paddingTop: space.lg,
    paddingBottom: 96,
    gap: 28,
  },
  header: {
    gap: space.xs,
  },
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
