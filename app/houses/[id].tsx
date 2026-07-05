import { Link, useLocalSearchParams } from 'expo-router';
import { ChevronRight, Plus, ShieldCheck } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ListRowLink } from '@/src/components/ListRowLink';
import { QuantityDots } from '@/src/components/QuantityDots';
import { Screen } from '@/src/components/Screen';
import { SectionTitle } from '@/src/components/SectionTitle';
import { getHouseById, getRoomsByHouseId, issuePreview, propertyInstructions } from '@/src/data/mock';
import { colors, radius, space, type } from '@/src/theme/theme';

export default function HouseDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const house = getHouseById(params.id ?? '');
  const rooms = getRoomsByHouseId(house.id);

  return (
    <Screen eyebrow="House" title={house.name}>
      <View style={styles.section}>
        <SectionTitle>Property overview</SectionTitle>
        <Text style={styles.meta}>{house.address}</Text>
        <Text style={styles.meta}>Cleaner access, instructions, and room readiness live here.</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.rowBetween}>
          <SectionTitle>Rooms</SectionTitle>
          <View style={styles.inlineAction}>
            <Plus color={colors.teal} size={14} strokeWidth={1.75} />
            <Text style={styles.inlineActionLabel}>Add room</Text>
          </View>
        </View>
        {rooms.map((room) => {
          const tileColor =
            room.status === 'ready'
              ? colors.teal
              : room.status === 'lowStock'
                ? colors.ochre
                : room.status === 'needsCleaning'
                  ? colors.inkMuted
                  : colors.rust;
          const tileOnDark =
            room.status === 'ready'
              ? colors.tealOnDark
              : room.status === 'lowStock'
                ? colors.ochreOnDark
                : room.status === 'needsCleaning'
                  ? colors.paper
                  : colors.rustOnDark;

          return (
            <ListRowLink
              key={room.id}
              href={{ pathname: '/rooms/[id]', params: { id: room.id } }}
              icon={room.icon}
              iconBackground={tileColor}
              iconColor={tileOnDark}
              name={room.name}
              meta={room.meta}
              status={room.status}>
              <View style={styles.quantityWrap}>
                <QuantityDots current={room.current} required={room.required} />
              </View>
            </ListRowLink>
          );
        })}
      </View>

      <View style={styles.section}>
        <View style={styles.rowBetween}>
          <SectionTitle>Cleaner access</SectionTitle>
          <Link href="/cleaners" asChild>
            <Pressable style={styles.linkRow}>
              <ShieldCheck color={colors.teal} size={16} strokeWidth={1.75} />
              <Text style={styles.linkText}>Manage access</Text>
            </Pressable>
          </Link>
        </View>
        <View style={styles.noteBlock}>
          <Text style={type.eyebrow}>Assigned access</Text>
          <Text style={type.noteBody}>
            Owners invite cleaners, choose the properties they can update, and share a one-time access code.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <SectionTitle>Instructions</SectionTitle>
        {propertyInstructions.map((instruction) => (
          <View key={instruction} style={styles.simpleRow}>
            <Text style={styles.body}>{instruction}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <SectionTitle>Open issues</SectionTitle>
        {issuePreview.map((issue) => (
          <View key={issue.id} style={styles.inlineListRow}>
            <View>
              <Text style={styles.body}>{issue.label}</Text>
              <Text style={styles.meta}>{issue.room}</Text>
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
  meta: {
    ...type.bodySmallMuted,
    color: colors.inkBody,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
  },
  inlineAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  inlineActionLabel: {
    ...type.buttonLabel,
    color: colors.teal,
  },
  quantityWrap: {
    paddingTop: space.xs,
  },
  noteBlock: {
    backgroundColor: colors.paperRaised,
    borderRadius: radius.control,
    padding: space.md,
    gap: space.xs,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  linkText: {
    ...type.buttonLabel,
    color: colors.teal,
  },
  simpleRow: {
    paddingVertical: space.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  inlineListRow: {
    paddingVertical: space.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
  },
  body: {
    ...type.body,
    color: colors.ink,
  },
});
