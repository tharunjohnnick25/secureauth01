import { AdminDashboard } from '@/components/pages/AdminDashboard';
import AuthGuard from '@/components/auth/AuthGuard';

export default function AdminDashboardPage() {
  return (
    <AuthGuard>
      <AdminDashboard />
    </AuthGuard>
  );
}
