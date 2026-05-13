import { RolesPermissions } from '@/components/pages/RolesPermissions';
import AuthGuard from '@/components/auth/AuthGuard';

export default function AdminRolesPage() {
  return (
    <AuthGuard requireAdmin>
      <RolesPermissions />
    </AuthGuard>
  );
}
