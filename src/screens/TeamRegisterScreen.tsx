import { AuthField } from '@/src/components/AuthField';
import { AuthShell } from '@/src/components/AuthShell';

export function TeamRegisterScreen() {
  return (
    <AuthShell
      eyebrow="Property Team"
      title="Create property team account"
      subtitle="Use this path for field staff who clean, restock, inspect, report issues, and upload proof for assigned properties."
      actions={[
        { label: 'Create property team account', href: '/login', primary: true },
        { label: 'Owner account instead', href: '/register' },
      ]}>
      <AuthField label="Full name" value="Maya Brooks" />
      <AuthField label="Email" value="maya@example.com" />
      <AuthField label="Username" value="@mayateam" hint="Owners can invite by email or username." />
      <AuthField label="Password" value="Create a secure password" />
    </AuthShell>
  );
}
