import { RiskAssessment } from '@/components/pages/RiskAssessment';
import AuthGuard from '@/components/auth/AuthGuard';

export default function RiskScorePage() {
  return (
    <AuthGuard>
      <RiskAssessment />
    </AuthGuard>
  );
}
