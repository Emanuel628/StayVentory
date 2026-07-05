import { AuthField } from '@/src/components/AuthField';
import { AuthShell } from '@/src/components/AuthShell';
import { StyleSheet, Text, View } from 'react-native';

import { colors, space, type } from '@/src/theme/theme';

export function RegisterScreen() {
  return (
    <AuthShell
      eyebrow="Register"
      title="Create owner account"
      subtitle="Set up your account first, then add houses, rooms, room standards, and property team access."
      actions={[{ label: 'Create account', href: '/' as const, primary: true }]}
      links={[{ label: 'Sign in', href: '/login' }]}>
      <AuthField label="Full name" value="Emanuel Castro" />
      <AuthField label="Email" value="owner@stayventory.co" />
      <AuthField label="Password" value="Create a secure password" />
      <View style={styles.passwordBlock}>
        <Text style={styles.passwordTitle}>Password strength</Text>
        <View style={styles.strengthRow}>
          <View style={[styles.strengthBar, styles.strengthBarActive]} />
          <View style={[styles.strengthBar, styles.strengthBarActive]} />
          <View style={styles.strengthBar} />
          <View style={styles.strengthBar} />
        </View>
        <Text style={styles.ruleText}>Use at least 8 characters, one capital letter, one number, and one special character.</Text>
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  passwordBlock: {
    gap: space.sm,
  },
  passwordTitle: {
    ...type.eyebrow,
    color: colors.ink,
  },
  strengthRow: {
    flexDirection: 'row',
    gap: space.xs,
  },
  strengthBar: {
    flex: 1,
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.hairline,
  },
  strengthBarActive: {
    backgroundColor: colors.teal,
  },
  ruleText: {
    ...type.bodySmallMuted,
    color: colors.inkBody,
  },
});
