import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Wrench, AlertTriangle, PackageX } from 'lucide-react-native';

import { Screen } from '@/src/components/Screen';
import { colors, iconTile, radius, space, type } from '@/src/theme/theme';

const issues = [
  {
    id: '1',
    title: 'Lamp switch broken',
    house: 'The Linden House',
    room: 'Bedroom 2',
    category: 'Repair',
    color: colors.rust,
    icon: Wrench,
    iconColor: colors.rustOnDark,
  },
  {
    id: '2',
    title: 'Coffee pod stock low',
    house: 'Cedar Retreat',
    room: 'Kitchen',
    category: 'Replace',
    color: colors.ochre,
    icon: PackageX,
    iconColor: colors.ochreOnDark,
  },
  {
    id: '3',
    title: 'Water stain on ceiling',
    house: 'Maple Flat',
    room: 'Bathroom 1',
    category: 'Maintenance',
    color: colors.rust,
    icon: AlertTriangle,
    iconColor: colors.rustOnDark,
  },
];

export default function IssuesScreen() {
  return (
    <Screen eyebrow="Issues" title="Repair, maintain, replace">
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Open items</Text>
        {issues.map((issue) => {
          const Icon = issue.icon;
          return (
            <View key={issue.id} style={styles.issueRow}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconTile, { backgroundColor: issue.color }]}>
                  <Icon color={issue.iconColor} size={iconTile.iconSize} strokeWidth={iconTile.strokeWidth} />
                </View>
                <View style={styles.rowText}>
                  <Text style={styles.rowName}>{issue.title}</Text>
                  <Text style={styles.rowMeta}>
                    {issue.house} | {issue.room}
                  </Text>
                </View>
              </View>
              <Text style={styles.category}>{issue.category}</Text>
            </View>
          );
        })}
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
  issueRow: {
    paddingVertical: space.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    flex: 1,
  },
  iconTile: {
    width: iconTile.size,
    height: iconTile.size,
    borderRadius: radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowText: {
    gap: 2,
    flex: 1,
  },
  rowName: {
    ...type.houseName,
    color: colors.ink,
  },
  rowMeta: {
    ...type.bodySmallMuted,
  },
  category: {
    ...type.mono,
    color: colors.rust,
    textTransform: 'uppercase',
  },
});

