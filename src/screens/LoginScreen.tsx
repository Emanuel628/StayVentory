import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { CheckSquare2, Square } from 'lucide-react-native';

import { AuthField } from '@/src/components/AuthField';
import { AuthShell } from '@/src/components/AuthShell';
import { getLastLoginEmail, setLastLoginEmail } from '@/src/services/authPreferences';
import { clearRateLimit, formatRetryAfter, getRateLimitState, recordRateLimitHit } from '@/src/services/rateLimit';
import { signInWithPassword } from '@/src/services/auth';
import { colors, space, type } from '@/src/theme/theme';

export function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadLastLoginEmail = async () => {
      const savedEmail = await getLastLoginEmail();

      if (isMounted && savedEmail) {
        setEmail(savedEmail);
      }
    };

    void loadLastLoginEmail();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSignIn = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    const rateLimitKey = `signin:${normalizedEmail || 'anonymous'}`;

    try {
      setError('');
      setIsSubmitting(true);

      const rateLimit = await getRateLimitState(rateLimitKey, { limit: 5, windowMs: 15 * 60 * 1000 });

      if (!rateLimit.allowed) {
        setError(`Too many sign-in attempts. Try again in ${formatRetryAfter(rateLimit.retryAfterMs)}.`);
        return;
      }

      const { error: authError } = await signInWithPassword(normalizedEmail, password);

      if (authError) {
        await recordRateLimitHit(rateLimitKey, { limit: 5, windowMs: 15 * 60 * 1000 });
        setError(authError.message);
        return;
      }

      await clearRateLimit(rateLimitKey);
      await setLastLoginEmail(normalizedEmail);
      router.replace('/');
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Login"
      title="Sign in to StayVentory"
      subtitle="Owners and invited property team members sign in here after their account has been created."
      actions={[{ label: isSubmitting ? 'Signing in...' : 'Sign in', onPress: handleSignIn, primary: true, disabled: isSubmitting }]}
      links={[
        { label: 'Forgot password', href: '/forgot-password' },
        { label: 'Create owner account', href: '/register' },
        { label: 'Create property team account', href: '/team-register' },
      ]}>
      <AuthField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="owner@stayventory.co"
        keyboardType="email-address"
        inputMode="email"
      />
      <AuthField
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry={!showPassword}
      />
      <Pressable style={styles.toggleRow} onPress={() => setShowPassword((current) => !current)}>
        {showPassword ? (
          <CheckSquare2 color={colors.teal} size={16} strokeWidth={1.75} />
        ) : (
          <Square color={colors.inkMuted} size={16} strokeWidth={1.75} />
        )}
        <Text style={styles.toggleLabel}>Show password</Text>
      </Pressable>
      {error ? <Text style={{ ...type.bodySmallMuted, color: colors.rust }}>{error}</Text> : null}
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  toggleLabel: {
    ...type.bodySmallMuted,
    color: colors.ink,
  },
});
