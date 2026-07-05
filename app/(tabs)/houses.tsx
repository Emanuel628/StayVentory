import { Link } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ListRowLink } from '@/src/components/ListRowLink';
import { Screen } from '@/src/components/Screen';
import { SectionTitle } from '@/src/components/SectionTitle';
import { houses } from '@/src/data/mock';
import { colors, space, type } from '@/src/theme/theme';

export default function HousesScreen() {
  const hasHouses = houses.length > 0;

  return (
    <Screen eyebrow="Houses" title="Your houses">
      {hasHouses ? (
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
              icon={house.icon}
              iconBackground={colors.teal}
              iconColor={colors.tealOnDark}
              name={house.name}
              meta={house.meta}
              status={house.status}
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
});
