import MfaForm from '@/components/auth/MfaForm';

export const metadata = {
  title: 'MFA Verification | CyberAuth',
  description: 'Complete multi-factor authentication',
};

export default function MfaVerifyPage() {
  return (
    <div className="w-full flex items-center justify-center p-4">
      <MfaForm />
    </div>
  );
}
