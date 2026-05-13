import { MultiStepLogin } from '@/components/auth/MultiStepLogin';

export const metadata = {
  title: 'Login | SecureAuth AI',
  description: 'Premium multi-factor risk-based authentication system',
};

export default function LoginPage() {
  return <MultiStepLogin />;
}
