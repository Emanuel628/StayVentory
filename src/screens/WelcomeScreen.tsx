import { Link } from 'expo-router';
import { CalendarCheck2, Camera, ClipboardList, House, PackageSearch, UsersRound } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthShell } from '@/src/components/AuthShell';
import { colors, radius, space, type } from '@/src/theme/theme';

const features = [
  { icon: House, label: 'Build houses and room-by-room standards' },
  { icon: ClipboardList, label: 'Track cleaning steps and room notes' },
  { icon: PackageSearch, label: 'See low stock and guest-readiness issues fast' },
  { icon: Camera, label: 'Collect photo and video proof from the field' },
  { icon: UsersRound, label: 'Invite your property team with owner-controlled access' },
  { icon: CalendarCheck2, label: 'Review turnovers and what needs attention now' },
];

export function WelcomeScreen() {
  return (
    <AuthShell
      eyebrow="Welcome"
      title="StayVentory"
      subtitle="A tropical, room-by-room turnover control app for owners who need every property clean, stocked, and guest-ready."
      actions={[
        { label: 'Create owner account', href: '/register', primary: true },
        { label: 'Sign in', href: '/login' },
      ]}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What the app offers</Text>
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <View key={feature.label} style={styles.featureRow}>
              <View style={styles.iconTile}>
                <Icon color={colors.tealOnDark} size={18} strokeWidth={1.75} />
              </View>
              <Text style={styles.featureText}>{feature.label}</Text>
            </View>
          );
        })}
      </View>

      <Link href="/team-register" asChild>
        <Pressable style={styles.textLink}>
          <Text style={styles.textLinkLabel}>Joining as Property Team?</Text>
        </Pressable>
      </Link>
    </AuthShell>
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
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingVertical: space.xs,
  },
  iconTile: {
    width: 34,
    height: 34,
    borderRadius: radius.tile,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  featureText: {
    ...type.body,
    flex: 1,
  },
  textLink: {
    alignSelf: 'flex-start',
    paddingVertical: space.xs,
  },
  textLinkLabel: {
    ...type.buttonLabel,
    color: colors.rust,
  },
});
