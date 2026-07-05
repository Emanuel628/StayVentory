import { AuthField } from '@/src/components/AuthField';
import { AuthShell } from '@/src/components/AuthShell';

export function LoginScreen() {
  return (
    <AuthShell
      eyebrow="Login"
      title="Sign in to StayVentory"
      subtitle="Owners and property team members use different account paths, but both sign in from here."
      actions={[{ label: 'Sign in', href: '/' as const, primary: true }]}
      links={[
        { label: 'Forgot password', href: '/forgot-password' },
        { label: 'Create owner account', href: '/register' },
        { label: 'Create property team account', href: '/team-register' },
      ]}>
      <AuthField label="Email or username" value="owner@stayventory.co" />
      <AuthField label="Password" value="************" />
    </AuthShell>
  );
}
