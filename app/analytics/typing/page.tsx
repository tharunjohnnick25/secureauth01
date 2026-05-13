import { TypingAnalytics } from '@/components/pages/TypingAnalytics';
import AuthGuard from '@/components/auth/AuthGuard';

export default function TypingAnalyticsPage() {
  return (
    <AuthGuard>
      <TypingAnalytics />
    </AuthGuard>
  );
}
