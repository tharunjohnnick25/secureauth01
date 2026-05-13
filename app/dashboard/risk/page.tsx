import { RiskDashboard } from '@/components/pages/RiskDashboard';
import AuthGuard from '@/components/auth/AuthGuard';

export default function RiskDashboardPage() {
  return (
    <AuthGuard>
      <RiskDashboard />
    </AuthGuard>
  );
}
