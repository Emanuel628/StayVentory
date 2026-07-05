import { AuthField } from '@/src/components/AuthField';
import { AuthShell } from '@/src/components/AuthShell';

export function RegisterScreen() {
  return (
    <AuthShell
      eyebrow="Register"
      title="Create owner account"
      subtitle="Set up your account first, then add houses, rooms, room standards, and property team access."
      actions={[{ label: 'Create account', href: '/' as const, primary: true }]}
      links={[{ label: 'Already have an account? Sign in', href: '/login' }]}>
      <AuthField label="Full name" value="Emanuel Castro" />
      <AuthField label="Email" value="owner@stayventory.co" />
      <AuthField label="Password" value="Create a secure password" />
      <AuthField label="Company or portfolio name" value="StayVentory Owner Account" />
    </AuthShell>
  );
}
