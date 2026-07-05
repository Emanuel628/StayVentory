import { Link } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ListRowLink } from '@/src/components/ListRowLink';
import { Screen } from '@/src/components/Screen';
import { SectionTitle } from '@/src/components/SectionTitle';
import { houses } from '@/src/data/mock';
import { colors, space, type } from '@/src/theme/theme';

export default function HousesScreen() {
  return (
    <Screen eyebrow="Houses" title="Hello, Emanuel">
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <SectionTitle>Your houses</SectionTitle>
          <Link href="/cleaners" asChild>
            <Pressable style={styles.addRow}>
              <Plus color={colors.teal} size={14} strokeWidth={1.75} />
              <Text style={styles.addLabel}>Cleaner access</Text>
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

      <View style={styles.section}>
        <SectionTitle>Owner model</SectionTitle>
        <Text style={styles.helpText}>
          Open a house, then open a room. Each room gets its own page with inventory, notes, proof, and issues.
        </Text>
      </View>
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
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  addLabel: {
    ...type.buttonLabel,
    color: colors.teal,
  },
  helpText: {
    ...type.noteBody,
    color: colors.inkBody,
  },
});
