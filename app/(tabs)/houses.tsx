import { Link, useFocusEffect } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Home } from 'lucide-react-native';

import { ListRowLink } from '@/src/components/ListRowLink';
import { Screen } from '@/src/components/Screen';
import { SectionTitle } from '@/src/components/SectionTitle';
import { isSupabaseConfigured } from '@/src/lib/env';
import { listHouses } from '@/src/services/houses';
import { colors, space, type } from '@/src/theme/theme';

export default function HousesScreen() {
  const [houses, setHouses] = useState<
    {
      id: string;
      name: string;
      address_line_1: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    }[]
  >([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadHouses = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setError('Supabase is not configured yet.');
      setIsLoading(false);
      return;
    }

    try {
      setError('');
      setIsLoading(true);

      const { data, error: loadError } = await listHouses();

      if (loadError) {
        setError(loadError.message);
        return;
      }

      setHouses(data ?? []);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Unable to load houses.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadHouses();
    }, [loadHouses]),
  );

  const hasHouses = houses.length > 0;

  return (
    <Screen eyebrow="Houses" title="Your houses">
      {isLoading ? (
        <View style={styles.section}>
          <Text style={styles.helperText}>Loading houses...</Text>
        </View>
      ) : error ? (
        <View style={styles.section}>
          <Text style={styles.errorText}>{error}</Text>
          <Link href="/add-property" asChild>
            <Pressable style={styles.addRow}>
              <Plus color={colors.teal} size={14} strokeWidth={1.75} />
              <Text style={styles.addLabel}>Add property</Text>
            </Pressable>
          </Link>
        </View>
      ) : hasHouses ? (
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <SectionTitle>Your houses</SectionTitle>
            <Link href="/add-property" asChild>
              <Pressable style={styles.addRow}>
                <Plus color={colors.teal} size={14} strokeWidth={1.75} />
                <Text style={styles.addLabel}>Add property</Text>
              </Pressable>
            </Link>
          </View>
          {houses.map((house) => (
            <ListRowLink
              key={house.id}
              href={{ pathname: '/houses/[id]', params: { id: house.id } }}
              icon={Home}
              iconBackground={colors.teal}
              iconColor={colors.tealOnDark}
              name={house.name}
              meta={`${house.address_line_1}, ${house.city}, ${house.state} ${house.postal_code}`}
            />
          ))}
        </View>
      ) : (
        <View style={styles.section}>
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Add your first property</Text>
            <Link href="/add-property" asChild>
              <Pressable style={styles.addRow}>
                <Plus color={colors.teal} size={14} strokeWidth={1.75} />
                <Text style={styles.addLabel}>Add your first property</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: space.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
  },
  emptyState: {
    backgroundColor: colors.paperRaised,
    borderRadius: 3,
    padding: space.md,
    gap: space.sm,
  },
  emptyTitle: {
    ...type.body,
    color: colors.ink,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  addLabel: {
    ...type.buttonLabel,
    color: colors.teal,
  },
  helperText: {
    ...type.bodySmallMuted,
    color: colors.inkBody,
  },
  errorText: {
    ...type.bodySmallMuted,
    color: colors.rust,
  },
});
