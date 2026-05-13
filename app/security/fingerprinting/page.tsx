import { DeviceDetails } from '@/components/pages/DeviceDetails';
import AuthGuard from '@/components/auth/AuthGuard';

export default function FingerprintingPage() {
  return (
    <AuthGuard>
      <DeviceDetails />
    </AuthGuard>
  );
}
