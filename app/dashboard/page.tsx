import { Dashboard } from '@/components/pages/Dashboard';

// ✅ FIX: Removed the duplicate AuthGuard wrapper.
// The root layout already wraps ALL non-public routes in AuthGuardWrapper → AuthGuard.
// The double-wrapping caused two separate Supabase getSession() calls and
// two "Securing Session..." loading screens on every dashboard visit.
export default function DashboardPage() {
  return <Dashboard />;
}
