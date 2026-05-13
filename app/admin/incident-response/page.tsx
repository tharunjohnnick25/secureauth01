import { IncidentResponse } from '@/components/pages/IncidentResponse';
import AuthGuard from '@/components/auth/AuthGuard';

export default function AdminIncidentResponsePage() {
  return (
    <AuthGuard requireAdmin>
      <IncidentResponse />
    </AuthGuard>
  );
}
