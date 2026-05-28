import { ApiKeys } from '@/components/pages/ApiKeys';

// ✅ FIX: Removed duplicate AuthGuard — root layout already handles auth
export default function ApiKeysPage() {
  return <ApiKeys />;
}