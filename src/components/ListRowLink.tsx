import { Href, Link } from 'expo-router';
import { LucideIcon } from 'lucide-react-native';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { StatusStamp } from '@/src/components/StatusStamp';
import { colors, iconTile, radius, space, StatusKey, type } from '@/src/theme/theme';

type Props = {
  href: Href;
  icon: LucideIcon;
  iconBackground: string;
  iconColor: string;
  name: string;
  meta: string;
  status?: StatusKey;
  children?: ReactNode;
};

export function ListRowLink({
  href,
  icon: Icon,
  iconBackground,
  iconColor,
  name,
  meta,
  status,
  children,
}: Props) {
  return (
    <Link href={href} asChild>
      <Pressable style={styles.row}>
        <View style={styles.rowLeft}>
          <View style={[styles.iconTile, { backgroundColor: iconBackground }]}>
            <Icon color={iconColor} size={iconTile.iconSize} strokeWidth={iconTile.strokeWidth} />
          </View>
          <View style={styles.rowText}>
            <Text style={styles.rowName}>{name}</Text>
            <Text style={styles.rowMeta}>{meta}</Text>
            {children}
          </View>
        </View>
        {status ? <StatusStamp status={status} /> : null}
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
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
});
