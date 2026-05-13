import { ApiKeys } from '@/components/pages/ApiKeys';
import AuthGuard from '@/components/auth/AuthGuard';

export default function ApiKeysPage() {
  return (
    <AuthGuard>
      <ApiKeys />
    </AuthGuard>
  );
}