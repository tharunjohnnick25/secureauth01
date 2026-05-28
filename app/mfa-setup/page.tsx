'use client';

import { useState } from 'react';
import { Shield, Smartphone, Key, ArrowRight, CheckCircle2, Copy, Download } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function MfaSetupPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [recoveryCodes] = useState([
    'A8B2-9X2Z-P9K1', 'L0M4-Q7W6-R3T9', 'C5N1-Y8U2-I4O6', 'S9D3-F2G7-H5J1'
  ]);

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setStep(3);
    toast.success('MFA successfully enabled!');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#020617]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl opacity-50" />
      </div>

      <Card className="w-full max-w-xl relative bg-black/40 backdrop-blur-xl border-white/10 p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Secure Your Account</h1>
            <p className="text-sm text-gray-400">Step {step} of 3: {step === 1 ? 'Select Method' : step === 2 ? 'Pair Device' : 'Verification Complete'}</p>
          </div>
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <p className="text-gray-300">Choose how you want to receive your second-factor authentication codes.</p>
            <div className="grid gap-4">
              <button 
                onClick={() => setStep(2)}
                className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-left group"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">Authenticator App</h3>
                  <p className="text-sm text-gray-400">Use Google Authenticator, Authy, or Microsoft Authenticator.</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-600" />
              </button>
              <button className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-left group opacity-50 cursor-not-allowed">
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">
                  <Key className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">Security Key (WebAuthn)</h3>
                  <p className="text-sm text-gray-400">Use a physical YubiKey or biometric TouchID/FaceID.</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 px-2 py-1 rounded">Coming Soon</span>
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="bg-white p-4 rounded-2xl w-48 h-48 flex items-center justify-center shadow-lg shadow-blue-500/20">
                {/* Mock QR Code */}
                <div className="w-36 h-36 bg-black relative flex items-center justify-center overflow-hidden rounded-lg">
                   <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
                   <div className="grid grid-cols-4 grid-rows-4 gap-2">
                     {[...Array(16)].map((_, i) => (
                       <div key={i} className={`w-6 h-6 ${Math.random() > 0.5 ? 'bg-white' : 'bg-transparent'}`} />
                     ))}
                   </div>
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <h3 className="font-bold text-lg">Scan this QR Code</h3>
                <p className="text-sm text-gray-400">Open your authenticator app and scan the code. If you can't scan it, enter the secret manually:</p>
                <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/10 font-mono text-xs">
                  <span className="flex-1 text-blue-400">JBSW-Y3DP-EHPK-3PXP</span>
                  <button onClick={() => copyToClipboard('JBSW-Y3DP-EHPK-3PXP')} className="hover:text-white"><Copy className="w-4 h-4" /></button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold uppercase tracking-widest text-gray-500">6-Digit Verification Code</label>
              <Input 
                type="text" 
                placeholder="000 000" 
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                className="text-center text-2xl font-bold tracking-[0.5em] h-14"
              />
              <Button onClick={handleVerify} className="w-full bg-blue-600 hover:bg-blue-500 h-12" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify and Enable'}
              </Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-8">
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto border border-green-500/20">
              <CheckCircle2 className="w-10 h-10 text-green-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">MFA is Active!</h2>
              <p className="text-gray-400 text-sm">Your account is now protected with double-layer encryption.</p>
            </div>

            <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl text-left space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-widest text-red-400">Recovery Backup Codes</h4>
                <div className="flex gap-2">
                  <button onClick={() => toast.success('Codes downloaded')} className="p-1 hover:text-white"><Download className="w-4 h-4" /></button>
                  <button onClick={() => copyToClipboard(recoveryCodes.join('\n'))} className="p-1 hover:text-white"><Copy className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {recoveryCodes.map(code => (
                  <div key={code} className="p-2 bg-black/40 rounded border border-white/5 text-center font-mono text-sm text-gray-300">
                    {code}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-gray-500 italic text-center">Store these safely. They are the only way to recover access if you lose your device.</p>
            </div>

            <Button className="w-full h-12" onClick={() => window.location.href = '/dashboard'}>
              Continue to Dashboard
            </Button>
          </motion.div>
        )}
      </Card>
    </div>
  );
}

