import { usePathname, useRouter } from 'expo-router';
import { CalendarCheck2, HousePlus, NotebookPen, TriangleAlert } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

import { colors, type } from '@/src/theme/theme';

type FooterItem = {
  label: string;
  href: string;
  matches: string[];
  renderIcon: (color: string, isActive: boolean) => React.ReactNode;
};

const footerItems: FooterItem[] = [
  {
    label: 'Houses',
    href: '/houses',
    matches: ['/houses', '/houses/', '/add-property', '/add-room', '/room-icon-picker', '/rooms/'],
    renderIcon: (color) => <HousePlus color={color} size={18} strokeWidth={1.75} />,
  },
  {
    label: 'Cleaning',
    href: '/cleaning',
    matches: ['/cleaning'],
    renderIcon: (color) => <CalendarCheck2 color={color} size={18} strokeWidth={1.75} />,
  },
  {
    label: 'Home',
    href: '/',
    matches: ['/'],
    renderIcon: (color, isActive) => (
      <View style={[styles.homeCircle, isActive ? styles.homeCircleActive : styles.homeCircleInactive]}>
        <Svg width={18} height={18} viewBox="0 0 18 18">
          <Rect x="3" y="3" width="12" height="12" rx="1.5" fill={color} />
        </Svg>
      </View>
    ),
  },
  {
    label: 'Issues',
    href: '/issues',
    matches: ['/issues'],
    renderIcon: (color) => <TriangleAlert color={color} size={18} strokeWidth={1.75} />,
  },
  {
    label: 'Notes',
    href: '/notes',
    matches: ['/notes'],
    renderIcon: (color) => <NotebookPen color={color} size={18} strokeWidth={1.75} />,
  },
];

function isActivePath(pathname: string, matches: string[]) {
  return matches.some((match) => pathname === match || pathname.startsWith(match));
}

export function AppFooter() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View style={styles.footer}>
      {footerItems.map((item) => {
        const isActive = isActivePath(pathname, item.matches);
        const isHome = item.label === 'Home';
        const iconColor = isHome
          ? isActive
            ? colors.buttonPrimaryText
            : colors.teal
          : isActive
            ? colors.teal
            : colors.inkMuted;
        const labelColor = isActive ? colors.teal : colors.inkMuted;

        return (
          <Pressable key={item.label} style={styles.item} onPress={() => router.replace(item.href as never)}>
            <View style={[styles.iconWrap, isActive ? styles.iconWrapActive : null]}>{item.renderIcon(iconColor, isActive)}</View>
            <Text style={[styles.label, { color: labelColor }]}>{item.label}</Text>
            {isHome ? null : <View style={[styles.activeBar, isActive ? styles.activeBarVisible : null]} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: colors.paper,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    minHeight: 92,
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minHeight: 72,
  },
  iconWrap: {
    minHeight: 48,
    minWidth: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    transform: [{ scale: 1.08 }],
  },
  label: {
    ...type.buttonLabel,
    fontSize: 10,
  },
  homeCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeCircleActive: {
    backgroundColor: colors.teal,
  },
  homeCircleInactive: {
    backgroundColor: colors.paperRaised,
  },
  activeBar: {
    width: 24,
    height: 3,
    borderRadius: 999,
    backgroundColor: 'transparent',
  },
  activeBarVisible: {
    backgroundColor: colors.teal,
  },
});
