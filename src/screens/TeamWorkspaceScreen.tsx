import { CalendarCheck2, Camera, ChevronRight, House, NotebookPen, ShieldCheck } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/src/components/Screen';
import { SectionTitle } from '@/src/components/SectionTitle';
import { StatusStamp } from '@/src/components/StatusStamp';
import { houses, ownerContact, roomInstructions } from '@/src/data/mock';
import { colors, iconTile, radius, space, type } from '@/src/theme/theme';

const assignedHouses = houses.slice(0, 2);
const assignedJobs = [
  {
    id: '1',
    house: 'The Linden House',
    detail: 'Today, 2:00 PM | Primary bathroom proof still needed',
    status: 'needsCleaning' as const,
  },
  {
    id: '2',
    house: 'Cedar Retreat',
    detail: 'Tomorrow, 11:00 AM | Restock paper towels and soap',
    status: 'lowStock' as const,
  },
];
const workspaceInstructions = roomInstructions.slice(0, 3);

export function TeamWorkspaceScreen() {
  return (
    <Screen eyebrow="Property Team" title="Assigned work" showSettingsLink={false}>
      <View style={styles.section}>
        <SectionTitle>What needs your attention</SectionTitle>
        {assignedJobs.map((job) => (
          <View key={job.id} style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconTile, { backgroundColor: job.status === 'lowStock' ? colors.ochre : colors.teal }]}>
                <CalendarCheck2
                  color={job.status === 'lowStock' ? colors.ochreOnDark : colors.tealOnDark}
                  size={iconTile.iconSize}
                  strokeWidth={iconTile.strokeWidth}
                />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowName}>{job.house}</Text>
                <Text style={styles.rowMeta}>{job.detail}</Text>
              </View>
            </View>
            <StatusStamp status={job.status} />
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <SectionTitle>Assigned houses</SectionTitle>
        {assignedHouses.map((house) => (
          <View key={house.id} style={styles.inlineRow}>
            <View style={styles.inlineLeft}>
              <View style={[styles.iconTile, { backgroundColor: colors.teal }]}>
                <House color={colors.tealOnDark} size={iconTile.iconSize} strokeWidth={iconTile.strokeWidth} />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowName}>{house.name}</Text>
                <Text style={styles.rowMeta}>{house.address}</Text>
              </View>
            </View>
            <ChevronRight color={colors.inkMuted} size={16} strokeWidth={1.75} />
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <SectionTitle>What you can do</SectionTitle>
        <View style={styles.noteBlock}>
          <View style={styles.noteRow}>
            <Camera color={colors.ochre} size={16} strokeWidth={1.75} />
            <Text style={styles.body}>Upload photos and video proof for assigned houses.</Text>
          </View>
          <View style={styles.noteRow}>
            <NotebookPen color={colors.teal} size={16} strokeWidth={1.75} />
            <Text style={styles.body}>Send notes to the owner for a specific property.</Text>
          </View>
          <View style={styles.noteRow}>
            <ShieldCheck color={colors.rust} size={16} strokeWidth={1.75} />
            <Text style={styles.body}>Update checklists, restock status, and report issues.</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <SectionTitle>Owner contact</SectionTitle>
        <View style={styles.contactBlock}>
          <Text style={styles.body}>{ownerContact.name}</Text>
          <Text style={styles.rowMeta}>{ownerContact.phone}</Text>
          <Text style={styles.rowMeta}>{ownerContact.email}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <SectionTitle>Property instructions</SectionTitle>
        {workspaceInstructions.map((instruction) => (
          <View key={instruction.id} style={styles.simpleRow}>
            <Text style={styles.body}>{instruction.text}</Text>
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
  row: {
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
  iconTile: {
    width: iconTile.size,
    height: iconTile.size,
    borderRadius: radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
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
  noteBlock: {
    backgroundColor: colors.paperRaised,
    borderRadius: radius.control,
    padding: space.md,
    gap: space.md,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.sm,
  },
  body: {
    ...type.body,
    color: colors.ink,
  },
  contactBlock: {
    gap: space.xs,
  },
  simpleRow: {
    paddingVertical: space.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
});
