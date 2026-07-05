import { useRouter } from 'expo-router';
import { KeyRound, Mail, ShieldCheck } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Screen } from '@/src/components/Screen';
import { SectionTitle } from '@/src/components/SectionTitle';
import { formatRetryAfter, getRateLimitState, recordRateLimitHit } from '@/src/services/rateLimit';
import { colors, radius, space, type } from '@/src/theme/theme';

export default function GiveAccessScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [helperText, setHelperText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [timeRemainingLabel, setTimeRemainingLabel] = useState('');

  useEffect(() => {
    if (!expiresAt) {
      setTimeRemainingLabel('');
      return;
    }

    const updateTimeRemaining = () => {
      const remainingMs = Math.max(0, expiresAt - Date.now());

      if (!remainingMs) {
        setGeneratedCode('');
        setExpiresAt(null);
        setTimeRemainingLabel('');
        setHelperText('Code expired. Generate a new one to continue.');
        return;
      }

      const remainingMinutes = Math.ceil(remainingMs / 60000);
      setTimeRemainingLabel(`Expires in about ${remainingMinutes} minute${remainingMinutes === 1 ? '' : 's'}.`);
    };

    updateTimeRemaining();

    const timer = setInterval(() => {
      updateTimeRemaining();
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  const handleGenerateCode = async () => {
    const rateLimitKey = 'generate-access-code';
    setHelperText('');
    setIsGenerating(true);

    const rateLimit = await getRateLimitState(rateLimitKey, { limit: 1, windowMs: 30 * 1000 });

    if (!rateLimit.allowed) {
      setHelperText(`Please wait ${formatRetryAfter(rateLimit.retryAfterMs)} before generating another code.`);
      setIsGenerating(false);
      return;
    }

    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const numbers = Math.floor(1000 + Math.random() * 9000);
    const prefix =
      letters[Math.floor(Math.random() * letters.length)] +
      letters[Math.floor(Math.random() * letters.length)] +
      letters[Math.floor(Math.random() * letters.length)] +
      letters[Math.floor(Math.random() * letters.length)];
    const suffix =
      letters[Math.floor(Math.random() * letters.length)] +
      letters[Math.floor(Math.random() * letters.length)];

    setGeneratedCode(`${prefix}-${numbers}-${suffix}`);
    setExpiresAt(Date.now() + 15 * 60 * 1000);
    setHelperText('Code is valid for 15 minutes.');
    await recordRateLimitHit(rateLimitKey, { limit: 1, windowMs: 30 * 1000 });
    setIsGenerating(false);
  };

  const handleSend = () => {
    if (!email.trim()) {
      setHelperText('Add an email before sending access.');
      return;
    }

    if (!generatedCode) {
      setHelperText('Generate an access code before sending access.');
      return;
    }

    setHelperText('Invite prepared. Backend delivery will plug into this send action next.');
    router.replace('/cleaners');
  };

  return (
    <Screen eyebrow="Access" title="Give property access" backHref="/cleaners" backLabel="Back to team">
      <View style={styles.section}>
        <SectionTitle>Invite property team</SectionTitle>
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="teammember@example.com"
            placeholderTextColor={colors.inkMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>
      </View>

      <View style={styles.section}>
        <SectionTitle>Access code</SectionTitle>
        <View style={styles.actionRow}>
          <View style={styles.actionLeft}>
            <KeyRound color={colors.teal} size={16} strokeWidth={1.75} />
            <Text style={styles.actionLabel}>Generate access code</Text>
          </View>
          <Pressable style={styles.generateButton} onPress={handleGenerateCode}>
            <Text style={styles.generateButtonLabel}>{isGenerating ? 'Generating...' : 'Generate'}</Text>
          </Pressable>
        </View>

        <View style={styles.codeShelf}>
          <Text style={styles.codeLabel}>Generated code</Text>
          <Text style={generatedCode ? styles.codeValue : styles.codePlaceholder}>
            {generatedCode || 'A new one-time code will appear here after you generate it.'}
          </Text>
          {generatedCode && timeRemainingLabel ? <Text style={styles.expiryText}>{timeRemainingLabel}</Text> : null}
          {helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}
        </View>
      </View>

      <View style={styles.noteBlock}>
        <ShieldCheck color={colors.ochre} size={16} strokeWidth={1.75} />
        <Text style={styles.noteText}>
          Owners generate a new one-time string each time they want to grant access to a property team member.
        </Text>
      </View>

      <Pressable style={styles.sendButton} onPress={handleSend}>
        <Text style={styles.sendLabel}>Send</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: space.md,
  },
  formField: {
    backgroundColor: colors.paperRaised,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.control,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    gap: 2,
  },
  fieldLabel: {
    ...type.eyebrow,
    color: colors.ink,
  },
  input: {
    minHeight: 44,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.hairline,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    backgroundColor: colors.paper,
    ...type.body,
    color: colors.inkBody,
  },
  actionRow: {
    paddingVertical: space.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  actionLabel: {
    ...type.body,
    color: colors.ink,
  },
  generateButton: {
    minHeight: 34,
    borderRadius: radius.control,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.md,
  },
  generateButtonLabel: {
    ...type.buttonLabel,
    color: colors.buttonPrimaryText,
  },
  codeShelf: {
    backgroundColor: colors.paperRaised,
    borderRadius: radius.control,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    gap: 2,
  },
  codeLabel: {
    ...type.eyebrow,
    color: colors.inkMuted,
  },
  codePlaceholder: {
    ...type.bodySmallMuted,
    color: colors.inkBody,
  },
  codeValue: {
    ...type.mono,
    color: colors.teal,
    fontSize: 14,
  },
  expiryText: {
    ...type.bodySmallMuted,
    color: colors.ochre,
  },
  helperText: {
    ...type.bodySmallMuted,
    color: colors.inkBody,
  },
  noteBlock: {
    backgroundColor: colors.paperRaised,
    borderRadius: radius.control,
    padding: space.md,
    gap: space.sm,
  },
  noteText: {
    ...type.noteBody,
    color: colors.inkBody,
  },
  sendButton: {
    minHeight: 46,
    borderRadius: radius.control,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.lg,
  },
  sendLabel: {
    ...type.buttonLabel,
    color: colors.buttonPrimaryText,
  },
});
