import { Link } from 'expo-router';
import { AlertTriangle, CalendarCheck2, ChevronRight, House, PackageSearch, ShieldCheck } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/src/components/Screen';
import { SectionTitle } from '@/src/components/SectionTitle';
import { StatusStamp } from '@/src/components/StatusStamp';
import { cleanerAccess, houses } from '@/src/data/mock';
import { colors, iconTile, radius, space, type } from '@/src/theme/theme';

const attentionHouses = houses.filter((house) => house.status !== 'ready');

const attentionJobs = [
  {
    id: '1',
    house: 'The Linden House',
    detail: 'Property team arrives today at 2:00 PM',
    status: 'needsCleaning' as const,
  },
  {
    id: '2',
    house: 'Cedar Retreat',
    detail: 'Laundry room stock is below minimum',
    status: 'lowStock' as const,
  },
];

const attentionIssues = [
  {
    id: '1',
    label: 'Lamp switch broken',
    meta: 'The Linden House | Living Room',
  },
  {
    id: '2',
    label: 'Upload proof photo still missing',
    meta: 'The Linden House | Primary Bathroom',
  },
];

export default function HomeScreen() {
  return (
    <Screen eyebrow="Home" title="Needs attention now">
      <View style={styles.section}>
        <SectionTitle>At a glance</SectionTitle>
        <View style={styles.overviewRow}>
          <View style={styles.metricBlock}>
            <Text style={type.eyebrow}>Houses</Text>
            <Text style={styles.metricValue}>{attentionHouses.length}</Text>
            <Text style={styles.metricMeta}>need review</Text>
          </View>
          <View style={styles.metricBlock}>
            <Text style={type.eyebrow}>Team</Text>
            <Text style={styles.metricValue}>{cleanerAccess.length}</Text>
            <Text style={styles.metricMeta}>assigned</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <SectionTitle>Priority houses</SectionTitle>
        {attentionHouses.map((house) => (
          <Link key={house.id} href={{ pathname: '/houses/[id]', params: { id: house.id } }} asChild>
            <Pressable style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconTile, { backgroundColor: colors.rust }]}>
                  <House color={colors.rustOnDark} size={iconTile.iconSize} strokeWidth={iconTile.strokeWidth} />
                </View>
                <View style={styles.rowText}>
                  <Text style={styles.rowName}>{house.name}</Text>
                  <Text style={styles.rowMeta}>{house.meta}</Text>
                </View>
              </View>
              <StatusStamp status={house.status} />
            </Pressable>
          </Link>
        ))}
      </View>

      <View style={styles.section}>
        <SectionTitle>Turnovers and restock</SectionTitle>
        {attentionJobs.map((item) => (
          <View key={item.id} style={styles.row}>
            <View style={styles.rowLeft}>
              <View
                style={[
                  styles.iconTile,
                  { backgroundColor: item.status === 'lowStock' ? colors.ochre : colors.teal },
                ]}>
                {item.status === 'lowStock' ? (
                  <PackageSearch color={colors.ochreOnDark} size={iconTile.iconSize} strokeWidth={iconTile.strokeWidth} />
                ) : (
                  <CalendarCheck2 color={colors.tealOnDark} size={iconTile.iconSize} strokeWidth={iconTile.strokeWidth} />
                )}
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowName}>{item.house}</Text>
                <Text style={styles.rowMeta}>{item.detail}</Text>
              </View>
            </View>
            <StatusStamp status={item.status} />
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <SectionTitle>Open issues</SectionTitle>
          <Link href="/cleaners" asChild>
            <Pressable style={styles.inlineLink}>
              <ShieldCheck color={colors.teal} size={14} strokeWidth={1.75} />
              <Text style={styles.inlineLinkLabel}>Property team access</Text>
            </Pressable>
          </Link>
        </View>
        {attentionIssues.map((issue) => (
          <View key={issue.id} style={styles.inlineRow}>
            <View style={styles.inlineLeft}>
              <AlertTriangle color={colors.rust} size={16} strokeWidth={1.75} />
              <View style={styles.rowText}>
                <Text style={styles.body}>{issue.label}</Text>
                <Text style={styles.rowMeta}>{issue.meta}</Text>
              </View>
            </View>
            <ChevronRight color={colors.inkMuted} size={16} strokeWidth={1.75} />
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
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
  },
  overviewRow: {
    flexDirection: 'row',
    gap: space.md,
  },
  metricBlock: {
    flex: 1,
    backgroundColor: colors.paperRaised,
    borderRadius: radius.control,
    padding: space.md,
    gap: space.xs,
  },
  metricValue: {
    ...type.screenGreeting,
    fontSize: 24,
  },
  metricMeta: {
    ...type.bodySmallMuted,
    color: colors.inkBody,
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
  iconTile: {
    width: iconTile.size,
    height: iconTile.size,
    borderRadius: radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowName: {
    ...type.houseName,
    color: colors.ink,
  },
  rowMeta: {
    ...type.bodySmallMuted,
  },
  body: {
    ...type.body,
    color: colors.ink,
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
  inlineLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  inlineLinkLabel: {
    ...type.buttonLabel,
    color: colors.teal,
  },
});
