import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

import { colors, space, type } from '@/src/theme/theme';

const rows = ['Profile', 'House playbook', 'Cleaner access', 'Notifications', 'Design lock'];

export default function SettingsScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={type.eyebrow}>Settings</Text>
        <Text style={type.screenGreeting}>System controls</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        {rows.map((row) => (
          <View key={row} style={styles.settingRow}>
            <Text style={styles.settingLabel}>{row}</Text>
            <ChevronRight color={colors.inkMuted} size={18} strokeWidth={1.75} />
          </View>
        ))}
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
  sectionTitle: {
    ...type.eyebrow,
    color: colors.ink,
  },
  settingRow: {
    paddingVertical: space.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
  },
  settingLabel: {
    ...type.body,
    color: colors.ink,
  },
});
