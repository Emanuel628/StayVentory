import { AuthField } from '@/src/components/AuthField';
import { AuthShell } from '@/src/components/AuthShell';

export function LoginScreen() {
  return (
    <AuthShell
      eyebrow="Login"
      title="Sign in to StayVentory"
      subtitle="Owners and invited property team members sign in here after their account has been created."
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
