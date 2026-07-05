import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/src/components/Screen';
import { listOwnerNotes } from '@/src/services/notes';
import { colors, radius, space, type } from '@/src/theme/theme';

type NoteRow = {
  id: string;
  body: string;
  audience: 'owner' | 'cleaner' | 'shared';
  note_type: 'general' | 'instruction' | 'turnover' | 'issue';
  created_at: string;
  houses: {
    id: string;
    name: string;
  } | null;
  rooms: {
    id: string;
    name: string;
  } | null;
  profiles: {
    id: string;
    display_name: string | null;
    email: string | null;
  } | null;
};

function formatNoteDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

export default function NotesScreen() {
  const [notes, setNotes] = useState<NoteRow[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadNotes = useCallback(async () => {
    try {
      setError('');
      setIsLoading(true);

      const { data, error: loadError } = await listOwnerNotes();

      if (loadError) {
        setError(loadError.message);
        return;
      }

      setNotes((data ?? []) as NoteRow[]);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Unable to load notes.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadNotes();
    }, [loadNotes]),
  );

  return (
    <Screen eyebrow="Notes" title="Owner notes and team updates">
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Latest updates</Text>
        {isLoading ? <Text style={styles.meta}>Loading notes...</Text> : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {!isLoading && !error && !notes.length ? (
          <View style={styles.noteBlock}>
            <Text style={styles.houseName}>No notes yet</Text>
            <Text style={styles.noteBody}>Owner instructions and property-team updates will appear here once notes are added to houses, rooms, jobs, or issues.</Text>
          </View>
        ) : null}
        {notes.map((note) => (
          <View key={note.id} style={styles.noteBlock}>
            <Text style={type.eyebrow}>{`${note.note_type} | ${note.audience}`}</Text>
            <Text style={styles.houseName}>
              {(note.houses?.name ?? 'General note') + (note.rooms?.name ? ` | ${note.rooms.name}` : '')}
            </Text>
            <Text style={styles.meta}>
              {(note.profiles?.display_name || note.profiles?.email || 'Unknown author') + ` | ${formatNoteDate(note.created_at)}`}
            </Text>
            <Text style={styles.noteBody}>{note.body}</Text>
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
  noteBody: {
    ...type.noteBody,
    color: colors.inkBody,
  },
  meta: {
    ...type.bodySmallMuted,
    color: colors.inkBody,
  },
  errorText: {
    ...type.bodySmallMuted,
    color: colors.rust,
  },
});
