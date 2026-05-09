import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, KeyRound } from 'lucide-react';
import { Button } from '@/components/components/Button';
import { Card } from '@/components/components/Card';

export function VerifyOTP() {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md relative">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
            <KeyRound className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-semibold mb-2">Verify Your Identity</h1>
          <p className="text-muted-foreground text-center">
            We've sent a 6-digit code to your email
          </p>
          <p className="text-sm text-primary mt-1">john.doe@example.com</p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                className="w-12 h-14 text-center text-xl font-semibold rounded-lg bg-input-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
              />
            ))}
          </div>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Didn't receive the code? </span>
            <button type="button" className="text-primary hover:underline">
              Resend
            </button>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Verify & Continue
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-border">
          <div className="glass-card rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-success mt-0.5" />
              <div>
                <h4 className="text-sm font-medium mb-1">Risk Analysis Complete</h4>
                <p className="text-xs text-muted-foreground">
                  Low risk detected - New device from familiar location
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
