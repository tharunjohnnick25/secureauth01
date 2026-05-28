'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, Key, ArrowRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card } from '@/components/Card';
import { toast } from 'sonner';

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const email = searchParams.get('email');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');

      toast.success('Identity verified');
      
      // Next step: Biometric or Dashboard
      if (data.requiresBiometric) {
        router.push(`/verify-biometric?email=${email}`);
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#020617]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md relative bg-black/40 backdrop-blur-xl border-white/10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
            <Key className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-semibold mb-2">Two-Factor Auth</h1>
          <p className="text-muted-foreground text-center text-sm">
            We've sent a verification code to <span className="text-white font-medium">{email || 'your email'}</span>.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Verification Code</label>
            <Input
              type="text"
              placeholder="000000"
              className="text-center tracking-widest text-2xl font-bold h-16"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              required
            />
          </div>

          <Button type="submit" className="w-full h-12" size="lg" disabled={loading}>
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                Verify Identity <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>

          <p className="text-center text-xs text-gray-500">
            Didn't receive a code? <button type="button" className="text-primary hover:underline">Resend Code</button>
          </p>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-4">
           <div className="flex items-center gap-1.5 grayscale opacity-50">
             <Shield className="w-4 h-4" />
             <span className="text-[10px] font-bold uppercase tracking-tighter">Secure Terminal</span>
           </div>
        </div>
      </Card>
    </div>
  );
}
