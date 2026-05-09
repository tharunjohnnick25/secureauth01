import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Login | CyberAuth',
  description: 'Secure multi-factor risk-based authentication system',
};

export default function LoginPage() {
  return (
    <div className="w-full flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}
