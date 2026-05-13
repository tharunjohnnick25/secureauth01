import { ThreatIntelligence } from '@/components/pages/ThreatIntelligence';
import AuthGuard from '@/components/auth/AuthGuard';

export default function ThreatIntelligencePage() {
  return (
    <AuthGuard>
      <ThreatIntelligence />
    </AuthGuard>
  );
}