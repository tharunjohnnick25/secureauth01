import { DeviceManagement } from '@/components/pages/DeviceManagement';
import AuthGuard from '@/components/auth/AuthGuard';

export default function DevicesPage() {
  return (
    <AuthGuard>
      <DeviceManagement />
    </AuthGuard>
  );
}