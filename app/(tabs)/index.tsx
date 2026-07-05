import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Bath, BedDouble, Home, LampDesk, Plus } from 'lucide-react-native';

import { QuantityDots } from '@/src/components/QuantityDots';
import { StatusStamp } from '@/src/components/StatusStamp';
import { colors, iconTile, radius, space, type } from '@/src/theme/theme';

const houses = [
  { id: '1', name: 'The Linden House', meta: '4 rooms • 2 issues open', status: 'attention' as const, icon: Home },
  { id: '2', name: 'Cedar Retreat', meta: '5 rooms • guest-ready', status: 'ready' as const, icon: Home },
];

const rooms = [
  {
    id: '1',
    name: 'Primary Bathroom',
    meta: '9 tracked items',
    status: 'lowStock' as const,
    icon: Bath,
    current: 4,
    required: 6,
  },
  {
    id: '2',
    name: 'Primary Bedroom',
    meta: '7 tracked items',
    status: 'ready' as const,
    icon: BedDouble,
    current: 2,
    required: 2,
  },
  {
    id: '3',
    name: 'Living Room',
    meta: '6 tracked items',
    status: 'attention' as const,
    icon: LampDesk,
    current: 1,
    required: 2,
  },
];

export default function HousesScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={type.eyebrow}>Houses</Text>
        <Text style={type.screenGreeting}>Hello, Emanuel</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Your houses</Text>
          <View style={styles.addRow}>
            <Plus color={colors.teal} size={14} strokeWidth={1.75} />
            <Text style={styles.addLabel}>Add house</Text>
          </View>
        </View>
        {houses.map((house) => {
          const Icon = house.icon;
          return (
            <View key={house.id} style={styles.listRow}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconTile, { backgroundColor: colors.teal }]}>
                  <Icon color={colors.tealOnDark} size={iconTile.iconSize} strokeWidth={iconTile.strokeWidth} />
                </View>
                <View style={styles.rowText}>
                  <Text style={styles.rowName}>{house.name}</Text>
                  <Text style={styles.rowMeta}>{house.meta}</Text>
                </View>
              </View>
              <StatusStamp status={house.status} />
            </View>
          );
        })}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>The Linden House</Text>
        <Text style={styles.houseMeta}>1132 Linden Ave • 3 bedrooms • 2 baths</Text>
        {rooms.map((room) => {
          const Icon = room.icon;
          const tileColor = room.status === 'ready' ? colors.teal : room.status === 'lowStock' ? colors.ochre : colors.rust;
          const tileOnDark =
            room.status === 'ready' ? colors.tealOnDark : room.status === 'lowStock' ? colors.ochreOnDark : colors.rustOnDark;

          return (
            <View key={room.id} style={styles.listRow}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconTile, { backgroundColor: tileColor }]}>
                  <Icon color={tileOnDark} size={iconTile.iconSize} strokeWidth={iconTile.strokeWidth} />
                </View>
                <View style={styles.rowText}>
                  <Text style={styles.rowName}>{room.name}</Text>
                  <Text style={styles.rowMeta}>{room.meta}</Text>
                  <View style={styles.quantityWrap}>
                    <QuantityDots current={room.current} required={room.required} />
                  </View>
                </View>
              </View>
              <StatusStamp status={room.status} />
            </View>
          );
        })}
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
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
  },
  sectionTitle: {
    ...type.eyebrow,
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
  houseMeta: {
    ...type.bodySmallMuted,
    color: colors.inkBody,
  },
  listRow: {
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
  quantityWrap: {
    paddingTop: space.xs,
  },
});
