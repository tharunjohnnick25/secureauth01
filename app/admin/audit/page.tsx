import { AuditLogs } from '@/components/pages/AuditLogs';
import AuthGuard from '@/components/auth/AuthGuard';

export default function AdminAuditPage() {
  return (
    <AuthGuard requireAdmin>
      <AuditLogs />
    </AuthGuard>
  );
}
