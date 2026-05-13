import { TeamManagement } from '@/components/pages/TeamManagement';
import AuthGuard from '@/components/auth/AuthGuard';

export default function AdminUsersPage() {
  return (
    <AuthGuard requireAdmin>
      <TeamManagement />
    </AuthGuard>
  );
}
