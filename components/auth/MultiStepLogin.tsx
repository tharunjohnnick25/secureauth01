'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Mail, 
  Lock, 
  Fingerprint, 
  Smartphone, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Globe, 
  ScanFace,
  KeyRound
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { useTypingBehavior } from '@/hooks/useTypingBehavior';
import { getDeviceFingerprint } from '@/lib/security/fingerprint';
import { useLocation } from '@/hooks/useLocation';

type Step = 'identify' | 'authenticate' | 'analyze' | 'warning' | 'mfa' | 'granted';

export function MultiStepLogin() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('identify');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [riskScore, setRiskScore] = useState(0);
  const [isSuspicious, setIsSuspicious] = useState(false);
  
  const { setUser, setRequiresBiometric } = useAuthStore();
  const { metrics, handleKeyDown, handleKeyUp } = useTypingBehavior();
  const { location, requestLocation } = useLocation();
  const [fingerprint, setFingerprint] = useState<any>(null);

  // Live wave for typing
  const [keystrokeWave, setKeystrokeWave] = useState(Array.from({ length: 20 }).map(() => Math.random() * 20));

  useEffect(() => {
    setFingerprint(getDeviceFingerprint());
    requestLocation();
  }, []);

  const handleIdentify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.endsWith('@gmail.com')) {
      toast.error('Gmail accounts only for enterprise security');
      return;
    }
    setStep('authenticate');
  };

  const handleAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStep('analyze');
    
    // Simulate AI Risk Analysis
    setTimeout(() => {
      const calculatedRisk = Math.floor(Math.random() * 100);
      setRiskScore(calculatedRisk);
      
      if (calculatedRisk > 80) {
        setIsSuspicious(true);
        setStep('warning');
      } else if (calculatedRisk > 40) {
        setStep('mfa');
      } else {
        setStep('granted');
      }
      setIsLoading(false);
    }, 4000);
  };

  const handleKeyDownWithWave = (e: React.KeyboardEvent) => {
    handleKeyDown(e);
    setKeystrokeWave(prev => [...prev.slice(1), 20 + Math.random() * 40]);
  };

  const handleMFA = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('granted');
  };

  useEffect(() => {
    if (step === 'granted') {
      setTimeout(() => {
        setUser({ id: '1', email, role: 'admin', first_name: 'Security', last_name: 'Admin' });
        router.push('/dashboard');
      }, 2000);
    }
  }, [step]);

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#020617] overflow-hidden relative">
      {/* Background Cyber Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>

      <div className="w-full max-w-lg z-10">
        <AnimatePresence mode="wait">
          {/* STEP 1: IDENTIFY */}
          {step === 'identify' && (
            <motion.div key="identify" {...stepVariants} className="glass-panel p-10 border-blue-500/20">
               <div className="flex flex-col items-center text-center mb-10">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                    <Shield className="text-white w-10 h-10" />
                  </div>
                  <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">SecureAuth<span className="text-blue-400">AI</span></h1>
                  <p className="text-gray-400">Enterprise Identity Platform</p>
               </div>

               <form onSubmit={handleIdentify} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Corporate Identity</label>
                    <Input 
                      type="email" 
                      placeholder="user@gmail.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      icon={<Mail className="w-5 h-5 text-blue-400" />}
                      className="h-14 text-lg bg-black/40 border-white/10"
                      required
                    />
                  </div>

                  <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl flex items-center gap-3">
                     <Smartphone className="w-5 h-5 text-blue-400" />
                     <div className="flex-1">
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Device Recognition</div>
                        <div className="text-xs text-white">Browser fingerprint detected & verified</div>
                     </div>
                     <CheckCircle2 className="w-4 h-4 text-green-500" />
                  </div>

                  <Button type="submit" className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-xl group transition-all shadow-lg shadow-blue-500/20">
                    Next Step <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
               </form>

               <div className="mt-10 flex items-center justify-center gap-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  <div className="flex items-center gap-1.5"><Fingerprint className="w-3 h-3" /> Biometric Ready</div>
                  <div className="flex items-center gap-1.5"><Globe className="w-3 h-3" /> Geo-Fenced</div>
                  <div className="flex items-center gap-1.5"><Cpu className="w-3 h-3" /> AI Protected</div>
               </div>
            </motion.div>
          )}

          {/* STEP 2: AUTHENTICATE */}
          {step === 'authenticate' && (
            <motion.div key="authenticate" {...stepVariants} className="glass-panel p-10 border-purple-500/20">
               <div className="flex items-center gap-4 mb-10">
                  <button onClick={() => setStep('identify')} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                    <ArrowRight className="w-5 h-5 text-gray-400 rotate-180" />
                  </button>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Verification</h2>
                    <p className="text-sm text-gray-400">{email}</p>
                  </div>
               </div>

               <form onSubmit={handleAuthenticate} className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Access Credentials</label>
                    <div className="relative">
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={<Lock className="w-5 h-5 text-purple-400" />}
                        className="h-14 text-lg bg-black/40 border-white/10 pr-24"
                        onKeyDown={handleKeyDownWithWave}
                        onKeyUp={handleKeyUp}
                        required
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-0.5 h-6 items-end pointer-events-none">
                        {keystrokeWave.map((h, i) => (
                          <motion.div 
                            key={i}
                            animate={{ height: `${h}%` }}
                            className="w-0.5 bg-purple-500/40 rounded-full"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="relative p-6 bg-purple-500/5 border border-purple-500/10 rounded-2xl overflow-hidden group">
                     <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                          <Fingerprint className="text-purple-400 w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">Behavioral Profiling</div>
                          <div className="text-xs text-gray-500">Neural analysis of typing cadence active</div>
                        </div>
                     </div>
                     <motion.div 
                        animate={{ x: ['-100%', '100%'] }} 
                        transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                        className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent skew-x-12"
                     ></motion.div>
                  </div>

                  <Button type="submit" className="w-full h-14 bg-purple-600 hover:bg-purple-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-purple-500/20">
                    Verify Identity
                  </Button>
               </form>
            </motion.div>
          )}

          {/* STEP 3: ANALYZE */}
          {step === 'analyze' && (
            <motion.div key="analyze" {...stepVariants} className="glass-panel p-12 flex flex-col items-center text-center border-blue-400/30">
               <div className="relative mb-12">
                  <div className="w-32 h-32 rounded-full border-2 border-white/5 flex items-center justify-center">
                     <Cpu className="w-16 h-16 text-blue-400 animate-pulse" />
                  </div>
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                    className="absolute -inset-4 border-2 border-dashed border-blue-500/20 rounded-full"
                  ></motion.div>
                  <motion.div 
                    animate={{ rotate: -360 }} 
                    transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
                    className="absolute -inset-8 border border-blue-400/10 rounded-full"
                  ></motion.div>
               </div>

               <h2 className="text-3xl font-bold text-white mb-4">Risk Engine Scanning</h2>
               <div className="space-y-4 w-full mb-8">
                  {[
                    { label: 'Device Integrity', status: 'Verified', delay: 0.4 },
                    { label: 'Behavioral Rhythm', status: 'Matched', delay: 1.2 },
                    { label: 'Geolocation Trust', status: 'Safe', delay: 2.0 },
                    { label: 'Threat Intelligence', status: 'Clean', delay: 2.8 },
                  ].map((scan, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: scan.delay }}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5"
                    >
                       <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{scan.label}</span>
                       <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {scan.status}
                       </span>
                    </motion.div>
                  ))}
               </div>
               
               <div className="w-full space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                     <span>Neural Compute</span>
                     <span>{Math.floor(riskScore)}% COMPLETE</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: '100%' }} 
                      transition={{ duration: 4, ease: 'easeInOut' }}
                      className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    ></motion.div>
                  </div>
               </div>
            </motion.div>
          )}

          {/* STEP: WARNING */}
          {step === 'warning' && (
            <motion.div key="warning" {...stepVariants} className="glass-panel p-10 border-red-500/20 bg-red-500/5">
               <div className="flex flex-col items-center text-center mb-10">
                  <div className="w-20 h-20 rounded-2xl bg-red-500/20 flex items-center justify-center mb-6 border border-red-500/40">
                    <AlertTriangle className="text-red-400 w-10 h-10 animate-bounce" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2 tracking-tight uppercase">Suspicious Login</h2>
                  <p className="text-red-400 font-bold text-sm">Critical Security Alert</p>
               </div>

               <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl mb-8 space-y-4">
                  <div className="flex justify-between text-xs">
                     <span className="text-gray-400 uppercase font-bold tracking-widest">Risk Level</span>
                     <span className="text-red-400 font-bold">CRITICAL (92%)</span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Our AI has detected significant anomalies in this authentication attempt. 
                    Additional verification is mandatory to prevent unauthorized access.
                  </p>
               </div>

               <Button 
                onClick={() => setStep('mfa')}
                className="w-full h-14 bg-red-600 hover:bg-red-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-red-500/20"
               >
                 Acknowledge & Verify
               </Button>
               <button onClick={() => setStep('identify')} className="w-full mt-4 text-sm text-gray-500 hover:text-white transition-colors">
                 This wasn't me - Secure Account
               </button>
            </motion.div>
          )}

          {/* STEP 4: MFA */}
          {step === 'mfa' && (
            <motion.div key="mfa" {...stepVariants} className="glass-panel p-10 border-yellow-500/20">
               <div className="flex flex-col items-center text-center mb-10">
                  <div className="w-16 h-16 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-4 border border-yellow-500/20">
                    <KeyRound className="text-yellow-500 w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Elevated Risk Challenge</h2>
                  <p className="text-sm text-gray-400">Multi-Factor Authentication Required</p>
               </div>

               <form onSubmit={handleMFA} className="space-y-8">
                  <div className="flex justify-between gap-3">
                    {otp.map((val, i) => (
                      <input 
                        key={i}
                        type="text"
                        maxLength={1}
                        value={val}
                        onChange={(e) => {
                          const newOtp = [...otp];
                          newOtp[i] = e.target.value;
                          setOtp(newOtp);
                          if (e.target.value && i < 5) {
                            (e.target.nextSibling as HTMLInputElement)?.focus();
                          }
                        }}
                        className="w-12 h-14 bg-black/40 border border-white/10 rounded-xl text-center text-xl font-bold text-white focus:border-yellow-500/50 outline-none transition-all shadow-inner"
                      />
                    ))}
                  </div>

                  <Button type="submit" className="w-full h-14 bg-yellow-600 hover:bg-yellow-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-yellow-500/20">
                    Confirm Identity
                  </Button>
               </form>
            </motion.div>
          )}

          {/* STEP 5: GRANTED */}
          {step === 'granted' && (
            <motion.div key="granted" {...stepVariants} className="glass-panel p-16 flex flex-col items-center text-center border-green-400/30">
               <div className="relative mb-10">
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    transition={{ type: 'spring', damping: 10, stiffness: 100 }}
                    className="w-32 h-32 rounded-full bg-green-500/20 flex items-center justify-center border-2 border-green-500/40"
                  >
                     <ShieldCheck className="w-16 h-16 text-green-400" />
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 2 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 rounded-full border border-green-400/20"
                  ></motion.div>
               </div>

               <h2 className="text-4xl font-bold text-white mb-2">Access Granted</h2>
               <p className="text-gray-400 mb-8 font-medium">Establishing secure neural session...</p>
               
               <div className="flex gap-2">
                  {[1, 2, 3].map(i => (
                    <motion.div 
                      key={i}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                      className="w-2 h-2 rounded-full bg-green-500"
                    />
                  ))}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
