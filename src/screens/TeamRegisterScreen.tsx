import { AuthField } from '@/src/components/AuthField';
import { AuthShell } from '@/src/components/AuthShell';
import { StyleSheet, Text, View } from 'react-native';

import { colors, space, type } from '@/src/theme/theme';

export function TeamRegisterScreen() {
  return (
    <AuthShell
      eyebrow="Property Team"
      title="Create property team account"
      subtitle="Use this path for field staff who clean, restock, inspect, report issues, and upload proof for assigned properties."
      actions={[{ label: 'Create property team account', href: '/login', primary: true }]}
      links={[{ label: 'Already have an account? Sign in', href: '/login' }]}>
      <AuthField label="Full name" value="Maya Brooks" />
      <AuthField label="Email" value="maya@example.com" />
      <AuthField label="Username" value="@mayateam" hint="Owners can invite by email or username." />
      <AuthField label="Password" value="Create a secure password" />
      <View style={styles.passwordBlock}>
        <Text style={styles.passwordTitle}>Password requirements</Text>
        <Text style={styles.ruleText}>Use at least 8 characters, one capital letter, one number, and one special character.</Text>
      </View>
      <AuthField label="Access code (optional)" value="Enter access code" />
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  passwordBlock: {
    gap: space.xs,
  },
  passwordTitle: {
    ...type.eyebrow,
    color: colors.ink,
  },
  ruleText: {
    ...type.bodySmallMuted,
    color: colors.inkBody,
  },
});
