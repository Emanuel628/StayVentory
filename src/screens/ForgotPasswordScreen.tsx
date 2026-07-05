import { AuthField } from '@/src/components/AuthField';
import { AuthShell } from '@/src/components/AuthShell';

export function ForgotPasswordScreen() {
  return (
    <AuthShell
      eyebrow="Reset"
      title="Forgot password"
      subtitle="We will send reset instructions to the email or username tied to the account."
      actions={[
        { label: 'Send reset instructions', href: '/login', primary: true },
        { label: 'Back to sign in', href: '/login' },
      ]}>
      <AuthField label="Email or username" value="owner@stayventory.co" />
    </AuthShell>
  );
}
