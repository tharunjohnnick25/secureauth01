import { Security } from '@/components/pages/Security';
import AuthGuard from '@/components/auth/AuthGuard';

export default function ZeroTrustPage() {
  return (
    <AuthGuard>
      <Security />
    </AuthGuard>
  );
}
