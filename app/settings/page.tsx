import { SecuritySettings } from '@/components/pages/SecuritySettings';
import AuthGuard from '@/components/auth/AuthGuard';

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SecuritySettings />
    </AuthGuard>
  );
}