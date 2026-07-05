import { useState } from 'react';
import { Text } from 'react-native';

import { AuthField } from '@/src/components/AuthField';
import { AuthShell } from '@/src/components/AuthShell';
import { formatRetryAfter, getRateLimitState, recordRateLimitHit } from '@/src/services/rateLimit';
import { requestPasswordReset } from '@/src/services/auth';
import { colors, type } from '@/src/theme/theme';

export function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    const rateLimitKey = `password-reset:${normalizedEmail || 'anonymous'}`;

    try {
      setMessage('');
      setError('');
      setIsSubmitting(true);

      const rateLimit = await getRateLimitState(rateLimitKey, { limit: 1, windowMs: 60 * 1000 });

      if (!rateLimit.allowed) {
        setError(`Please wait ${formatRetryAfter(rateLimit.retryAfterMs)} before sending another reset email.`);
        return;
      }

      const { error: resetError } = await requestPasswordReset(normalizedEmail);

      if (resetError) {
        setError(resetError.message);
        return;
      }

      await recordRateLimitHit(rateLimitKey, { limit: 1, windowMs: 60 * 1000 });
      setMessage('Reset instructions have been sent if the account exists.');
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Unable to send reset instructions.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Reset"
      title="Forgot password"
      subtitle="We will send reset instructions to the email tied to the account."
      actions={[
        { label: isSubmitting ? 'Sending...' : 'Send reset instructions', onPress: handleReset, primary: true, disabled: isSubmitting },
        { label: 'Back to sign in', href: '/login' },
      ]}>
      <AuthField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="owner@stayventory.co"
        keyboardType="email-address"
        inputMode="email"
      />
      {message ? <Text style={{ ...type.bodySmallMuted, color: colors.teal }}>{message}</Text> : null}
      {error ? <Text style={{ ...type.bodySmallMuted, color: colors.rust }}>{error}</Text> : null}
    </AuthShell>
  );
}
