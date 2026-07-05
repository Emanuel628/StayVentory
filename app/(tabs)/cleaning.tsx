import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { CalendarCheck2, Camera, CheckSquare2 } from 'lucide-react-native';

import { Screen } from '@/src/components/Screen';
import { StatusStamp } from '@/src/components/StatusStamp';
import { colors, iconTile, radius, space, type } from '@/src/theme/theme';

const jobs = [
  {
    id: '1',
    house: 'The Linden House',
    date: 'Today, 2:00 PM',
    cleaner: 'Maya Brooks',
    status: 'needsCleaning' as const,
  },
  {
    id: '2',
    house: 'Cedar Retreat',
    date: 'Tomorrow, 11:00 AM',
    cleaner: 'Jordan Lee',
    status: 'ready' as const,
  },
];

const checklist = [
  { label: 'Replace towels', done: true },
  { label: 'Verify 6 toilet paper rolls', done: true },
  { label: 'Upload bathroom proof photo', done: false },
];

export default function CleaningScreen() {
  return (
    <Screen eyebrow="Cleaning" title="Owner turnover view">
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today&apos;s jobs</Text>
        {jobs.map((job) => (
          <View key={job.id} style={styles.jobRow}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconTile, { backgroundColor: colors.teal }]}>
                <CalendarCheck2 color={colors.tealOnDark} size={iconTile.iconSize} strokeWidth={iconTile.strokeWidth} />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowName}>{job.house}</Text>
                <Text style={styles.rowMeta}>
                  {job.date} | {job.cleaner}
                </Text>
              </View>
            </View>
            <StatusStamp status={job.status} />
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cleaner checklist preview</Text>
        <View style={styles.noteBlock}>
          <Text style={type.eyebrow}>Primary bathroom</Text>
          {checklist.map((item) => (
            <View key={item.label} style={styles.checklistRow}>
              <View style={styles.checklistLeft}>
                <CheckSquare2 color={item.done ? colors.teal : colors.inkMuted} size={18} strokeWidth={1.75} />
                <Text style={styles.checklistLabel}>{item.label}</Text>
              </View>
              <Text style={[type.bodySmallMuted, item.done ? styles.successMeta : null]}>{item.done ? 'Done' : 'Open'}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Restock snapshot</Text>
        <View style={styles.inlineRow}>
          <View style={styles.rowText}>
            <Text style={styles.inventoryName}>Bathroom 1 | Toilet paper</Text>
            <Text style={styles.rowMeta}>4 on hand | minimum 6 required</Text>
          </View>
          <Text style={styles.restockCount}>4/6</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cleaner proof requirement</Text>
        <View style={styles.jobRow}>
          <View style={styles.rowLeft}>
            <View style={[styles.iconTile, { backgroundColor: colors.ochre }]}>
              <Camera color={colors.ochreOnDark} size={iconTile.iconSize} strokeWidth={iconTile.strokeWidth} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowName}>Final room photo needed</Text>
              <Text style={styles.rowMeta}>Primary bedroom, kitchen, and main bath</Text>
            </View>
          </View>
        </View>
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
  jobRow: {
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
    color: colors.inkBody,
  },
  noteBlock: {
    backgroundColor: colors.paperRaised,
    borderRadius: radius.control,
    padding: space.md,
    gap: space.sm,
  },
  checklistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.sm,
    paddingVertical: 4,
  },
  checklistLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    flex: 1,
  },
  checklistLabel: {
    ...type.body,
    flex: 1,
    color: colors.ink,
  },
  successMeta: {
    color: colors.teal,
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
  inventoryName: {
    ...type.body,
    color: colors.ink,
  },
  restockCount: {
    ...type.mono,
    color: colors.rust,
  },
});
