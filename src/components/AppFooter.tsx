import { usePathname, useRouter } from 'expo-router';
import { CalendarCheck2, HousePlus, NotebookPen, TriangleAlert } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

import { colors, type } from '@/src/theme/theme';

type FooterItem = {
  label: string;
  href: string;
  matches: string[];
  renderIcon: (color: string) => React.ReactNode;
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
    label: 'Issues',
    href: '/issues',
    matches: ['/issues'],
    renderIcon: (color) => <TriangleAlert color={color} size={18} strokeWidth={1.75} />,
  },
  {
    label: 'Home',
    href: '/',
    matches: ['/'],
    renderIcon: (color) => (
      <View style={styles.homeCircle}>
        <Svg width={18} height={18} viewBox="0 0 18 18">
          <Rect x="3" y="3" width="12" height="12" rx="1.5" fill={color} />
        </Svg>
      </View>
    ),
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
        const iconColor = isActive ? colors.buttonPrimaryText : colors.inkMuted;
        const labelColor = isActive ? colors.teal : colors.inkMuted;

        return (
          <Pressable key={item.label} style={styles.item} onPress={() => router.replace(item.href as never)}>
            {item.renderIcon(iconColor)}
            <Text style={[styles.label, { color: labelColor }]}>{item.label}</Text>
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
    paddingTop: 10,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
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
    backgroundColor: colors.teal,
    marginTop: -4,
  },
});
