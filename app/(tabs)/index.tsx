import { Href, Link } from 'expo-router';
import {
  AlertTriangle,
  CalendarCheck2,
  ChevronRight,
  CircleAlert,
  ClipboardCheck,
  House,
  PackageSearch,
} from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/src/components/Screen';
import { SectionTitle } from '@/src/components/SectionTitle';
import { StatusStamp } from '@/src/components/StatusStamp';
import { houses } from '@/src/data/mock';
import { colors, iconTile, radius, space, type } from '@/src/theme/theme';

const attentionHouses = houses.filter((house) => house.status !== 'ready');

const criticalActions: {
  id: string;
  title: string;
  detail: string;
  href: Href;
  tone: 'critical' | 'warning' | 'review';
}[] = [
  {
    id: 'proof',
    title: 'Missing turnover proof needs review',
    detail: 'Primary bathroom and kitchen closeout photos are still missing before guest readiness review.',
    href: '/cleaning',
    tone: 'critical',
  },
  {
    id: 'issue',
    title: 'Open repair decision is blocking a room',
    detail: 'The Linden House living room lamp switch is still unresolved and needs an owner call.',
    href: '/issues',
    tone: 'critical',
  },
  {
    id: 'stock',
    title: 'Low-stock rooms need a restock plan',
    detail: 'Primary bathroom and laundry room are below par on guest-facing essentials.',
    href: '/houses',
    tone: 'warning',
  },
];

const dueToday = [
  {
    id: 'linden',
    house: 'The Linden House',
    detail: 'Cleaner arrives today at 2:00 PM. Review proof and restock gaps before guest-ready signoff.',
    status: 'needsCleaning' as const,
  },
  {
    id: 'cedar',
    house: 'Cedar Retreat',
    detail: 'Tomorrow at 11:00 AM. Laundry room is low and the kitchen still needs final media.',
    status: 'lowStock' as const,
  },
];

const restockNow = [
  {
    id: 'tp',
    item: 'Toilet paper',
    amount: 'Need 2 more',
    location: 'The Linden House | Primary Bathroom',
  },
  {
    id: 'detergent',
    item: 'Laundry detergent',
    amount: 'Need 2 more',
    location: 'Cedar Retreat | Laundry Room',
  },
  {
    id: 'hand-soap',
    item: 'Hand soap backup',
    amount: 'Need 1 more',
    location: 'The Linden House | Primary Bathroom',
  },
];

const missingProof = [
  {
    id: 'proof-1',
    label: 'Primary bathroom final photo missing',
    meta: 'The Linden House',
  },
  {
    id: 'proof-2',
    label: 'Kitchen closeout video missing',
    meta: 'Cedar Retreat',
  },
];

function getActionToneStyle(tone: 'critical' | 'warning' | 'review') {
  if (tone === 'critical') {
    return {
      icon: <CircleAlert color={colors.rust} size={16} strokeWidth={1.75} />,
      label: 'DO NOW',
      labelColor: colors.rust,
    };
  }

  if (tone === 'warning') {
    return {
      icon: <PackageSearch color={colors.ochre} size={16} strokeWidth={1.75} />,
      label: 'RESTOCK',
      labelColor: colors.ochre,
    };
  }

  return {
    icon: <ClipboardCheck color={colors.teal} size={16} strokeWidth={1.75} />,
    label: 'REVIEW',
    labelColor: colors.teal,
  };
}

export default function HomeScreen() {
  return (
    <Screen eyebrow="Home" title="Owner command center">
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>What needs attention before the next guest</Text>
        <Text style={styles.heroBody}>
          Start with blockers first, then review today&apos;s turnovers, then buy what will leave a room below standard.
        </Text>
        <View style={styles.metricRow}>
          <View style={styles.metricCell}>
            <Text style={styles.metricValue}>3</Text>
            <Text style={styles.metricLabel}>critical actions</Text>
          </View>
          <View style={styles.metricCell}>
            <Text style={styles.metricValue}>2</Text>
            <Text style={styles.metricLabel}>jobs due now</Text>
          </View>
          <View style={styles.metricCell}>
            <Text style={styles.metricValue}>{attentionHouses.length}</Text>
            <Text style={styles.metricLabel}>houses to review</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <SectionTitle>Do first</SectionTitle>
        {criticalActions.map((action) => {
          const tone = getActionToneStyle(action.tone);

          return (
            <Link key={action.id} href={action.href} asChild>
              <Pressable style={styles.taskRow}>
                <View style={styles.taskTop}>
                  <View style={styles.taskTagWrap}>
                    {tone.icon}
                    <Text style={[styles.taskTag, { color: tone.labelColor }]}>{tone.label}</Text>
                  </View>
                  <ChevronRight color={colors.inkMuted} size={16} strokeWidth={1.75} />
                </View>
                <Text style={styles.taskTitle}>{action.title}</Text>
                <Text style={styles.taskDetail}>{action.detail}</Text>
              </Pressable>
            </Link>
          );
        })}
      </View>

      <View style={styles.section}>
        <SectionTitle>Due next</SectionTitle>
        {dueToday.map((item) => (
          <Link key={item.id} href="/cleaning" asChild>
            <Pressable style={styles.row}>
              <View style={styles.rowLeft}>
                <View
                  style={[
                    styles.iconTile,
                    { backgroundColor: item.status === 'lowStock' ? colors.ochre : colors.teal },
                  ]}>
                  <CalendarCheck2
                    color={item.status === 'lowStock' ? colors.ochreOnDark : colors.tealOnDark}
                    size={iconTile.iconSize}
                    strokeWidth={iconTile.strokeWidth}
                  />
                </View>
                <View style={styles.rowText}>
                  <Text style={styles.rowName}>{item.house}</Text>
                  <Text style={styles.rowMeta}>{item.detail}</Text>
                </View>
              </View>
              <StatusStamp status={item.status} />
            </Pressable>
          </Link>
        ))}
      </View>

      <View style={styles.section}>
        <SectionTitle>Missing proof and unresolved issues</SectionTitle>
        {missingProof.map((item) => (
          <Link key={item.id} href="/cleaning" asChild>
            <Pressable style={styles.inlineRow}>
              <View style={styles.inlineLeft}>
                <AlertTriangle color={colors.rust} size={16} strokeWidth={1.75} />
                <View style={styles.rowText}>
                  <Text style={styles.body}>{item.label}</Text>
                  <Text style={styles.rowMeta}>{item.meta}</Text>
                </View>
              </View>
              <ChevronRight color={colors.inkMuted} size={16} strokeWidth={1.75} />
            </Pressable>
          </Link>
        ))}
        <Link href="/issues" asChild>
          <Pressable style={styles.inlineRow}>
            <View style={styles.inlineLeft}>
              <AlertTriangle color={colors.rust} size={16} strokeWidth={1.75} />
              <View style={styles.rowText}>
                <Text style={styles.body}>Lamp switch broken</Text>
                <Text style={styles.rowMeta}>The Linden House | Living Room</Text>
              </View>
            </View>
            <ChevronRight color={colors.inkMuted} size={16} strokeWidth={1.75} />
          </Pressable>
        </Link>
      </View>

      <View style={styles.section}>
        <SectionTitle>Buy next</SectionTitle>
        {restockNow.map((item) => (
          <Link key={item.id} href="/houses" asChild>
            <Pressable style={styles.inlineRow}>
              <View style={styles.inlineLeft}>
                <PackageSearch color={colors.ochre} size={16} strokeWidth={1.75} />
                <View style={styles.rowText}>
                  <Text style={styles.body}>{item.item}</Text>
                  <Text style={styles.rowMeta}>
                    {item.amount} | {item.location}
                  </Text>
                </View>
              </View>
              <ChevronRight color={colors.inkMuted} size={16} strokeWidth={1.75} />
            </Pressable>
          </Link>
        ))}
      </View>

      <View style={styles.section}>
        <SectionTitle>Houses needing review</SectionTitle>
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
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.paperRaised,
    borderRadius: radius.control,
    padding: space.lg,
    gap: space.md,
  },
  heroTitle: {
    ...type.houseName,
    color: colors.ink,
  },
  heroBody: {
    ...type.noteBody,
    color: colors.inkBody,
  },
  metricRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    paddingTop: space.md,
    gap: space.md,
  },
  metricCell: {
    flex: 1,
    gap: 2,
  },
  metricValue: {
    ...type.screenGreeting,
    fontSize: 24,
  },
  metricLabel: {
    ...type.bodySmallMuted,
    color: colors.inkBody,
  },
  section: {
    gap: space.md,
  },
  taskRow: {
    paddingVertical: space.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
    gap: space.xs,
  },
  taskTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
  },
  taskTagWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  taskTag: {
    ...type.eyebrow,
  },
  taskTitle: {
    ...type.body,
    fontFamily: type.buttonLabel.fontFamily,
    color: colors.ink,
  },
  taskDetail: {
    ...type.noteBody,
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
    color: colors.inkBody,
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
});

