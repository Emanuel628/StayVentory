import { ReactNode } from 'react';
import { Href, Link, usePathname } from 'expo-router';
import { ChevronLeft, Settings2 } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, space, type } from '@/src/theme/theme';

type ScreenProps = {
  eyebrow: string;
  title: string;
  children: ReactNode;
  backHref?: Href;
  backLabel?: string;
  headerRight?: ReactNode;
  showSettingsLink?: boolean;
};

export function Screen({
  eyebrow,
  title,
  children,
  backHref,
  backLabel = 'Back',
  headerRight,
  showSettingsLink = true,
}: ScreenProps) {
  const pathname = usePathname();
  const shouldShowSettingsLink = showSettingsLink && pathname !== '/settings' && pathname !== '/team-workspace';
  const resolvedHeaderRight =
    headerRight ??
    (shouldShowSettingsLink ? (
      <Link href="/settings" asChild>
        <Pressable style={styles.settingsLink}>
          <Settings2 color={colors.teal} size={16} strokeWidth={1.75} />
          <Text style={styles.settingsLabel}>Settings</Text>
        </Pressable>
      </Link>
    ) : null);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        {backHref ? (
          <View style={styles.headerTopRow}>
            <Link href={backHref} asChild>
              <Pressable style={styles.backLink}>
                <ChevronLeft color={colors.teal} size={16} strokeWidth={1.75} />
                <Text style={styles.backLabel}>{backLabel}</Text>
              </Pressable>
            </Link>
            {resolvedHeaderRight}
          </View>
        ) : resolvedHeaderRight ? (
          <View style={styles.headerTopRow}>
            <View />
            {resolvedHeaderRight}
          </View>
        ) : null}
        <Text style={type.eyebrow}>{eyebrow}</Text>
        <Text style={type.screenGreeting}>{title}</Text>
      </View>
      {children}
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
  headerTopRow: {
    minHeight: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    alignSelf: 'flex-start',
  },
  backLabel: {
    ...type.buttonLabel,
    color: colors.teal,
  },
  settingsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    alignSelf: 'flex-start',
  },
  settingsLabel: {
    ...type.buttonLabel,
    color: colors.teal,
  },
});
