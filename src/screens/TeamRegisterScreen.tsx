import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { AuthField } from '@/src/components/AuthField';
import { AuthShell } from '@/src/components/AuthShell';
import { signUpWithPassword } from '@/src/services/auth';
import { colors, space, type } from '@/src/theme/theme';

export function TeamRegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setError('');
      setIsSubmitting(true);

      const { data, error: authError } = await signUpWithPassword({
        email: email.trim(),
        password,
        displayName: fullName.trim(),
        role: 'cleaner',
        username: username.trim() || undefined,
      });

      if (authError) {
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
      eyebrow="Property Team"
      title="Create property team account"
      subtitle="Use this path for field staff who clean, restock, inspect, report issues, and upload proof for assigned properties."
      actions={[{ label: isSubmitting ? 'Creating account...' : 'Create property team account', onPress: handleRegister, primary: true, disabled: isSubmitting }]}
      links={[{ label: 'Sign in', href: '/login' }]}>
      <AuthField label="Full name" value={fullName} onChangeText={setFullName} placeholder="Maya Brooks" autoCapitalize="words" />
      <AuthField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="maya@example.com"
        keyboardType="email-address"
        inputMode="email"
      />
      <AuthField
        label="Username"
        value={username}
        onChangeText={setUsername}
        placeholder="@mayateam"
        hint="Owners can invite by email or username."
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
        <Text style={styles.passwordTitle}>Password requirements</Text>
        <Text style={styles.ruleText}>Use at least 8 characters, one capital letter, one number, and one special character.</Text>
      </View>
      <AuthField label="Access code (optional)" value={accessCode} onChangeText={setAccessCode} placeholder="Enter access code" />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
  errorText: {
    ...type.bodySmallMuted,
    color: colors.rust,
  },
});
