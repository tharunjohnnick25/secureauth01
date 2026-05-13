import { ThreatIntelligence } from '@/components/pages/ThreatIntelligence';
import AuthGuard from '@/components/auth/AuthGuard';

export default function AdminThreatsPage() {
  return (
    <AuthGuard requireAdmin>
      <ThreatIntelligence />
    </AuthGuard>
  );
}
