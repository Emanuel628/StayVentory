import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { AuthField } from '@/src/components/AuthField';
import { AuthShell } from '@/src/components/AuthShell';
import { formatRetryAfter, getRateLimitState, recordRateLimitHit } from '@/src/services/rateLimit';
import { signUpWithPassword } from '@/src/services/auth';
import { colors, space, type } from '@/src/theme/theme';

export function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setError('');
      setIsSubmitting(true);

      const rateLimit = await getRateLimitState(`owner-register:${normalizedEmail || 'anonymous'}`, {
        limit: 3,
        windowMs: 30 * 60 * 1000,
      });

      if (!rateLimit.allowed) {
        setError(`Too many account creation attempts. Try again in ${formatRetryAfter(rateLimit.retryAfterMs)}.`);
        return;
      }

      const { data, error: authError } = await signUpWithPassword({
        email: normalizedEmail,
        password,
        displayName: fullName.trim(),
        role: 'owner',
      });

      if (authError) {
        await recordRateLimitHit(`owner-register:${normalizedEmail || 'anonymous'}`, {
          limit: 3,
          windowMs: 30 * 60 * 1000,
        });
        setError(authError.message);
        return;
      }

      if (data.session) {
        router.replace('/');
        return;
      }

      Alert.alert('Check your email', 'Your account was created. Use the confirmation email to finish signing in.');
      router.replace('/login');
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Unable to create the account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Register"
      title="Create owner account"
      subtitle="Set up your account first, then add houses, rooms, room standards, and property team access."
      actions={[{ label: isSubmitting ? 'Creating account...' : 'Create account', onPress: handleRegister, primary: true, disabled: isSubmitting }]}
      links={[{ label: 'Sign in', href: '/login' }]}>
      <AuthField label="Full name" value={fullName} onChangeText={setFullName} placeholder="Emanuel Castro" autoCapitalize="words" />
      <AuthField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="owner@stayventory.co"
        keyboardType="email-address"
        inputMode="email"
      />
      <AuthField label="Password" value={password} onChangeText={setPassword} placeholder="Create a secure password" secureTextEntry />
      <AuthField
        label="Confirm password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Repeat your password"
        secureTextEntry
      />
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
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
  errorText: {
    ...type.bodySmallMuted,
    color: colors.rust,
  },
});
