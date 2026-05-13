'use client';

import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import { toast } from 'sonner';

export function useBiometrics() {
  const registerBiometrics = async (email: string) => {
    try {
      // 1. Get options from server
      const optionsRes = await fetch('/api/auth/biometrics/register-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const options = await optionsRes.json();

      if (options.error) throw new Error(options.error);

      // 2. Start browser registration
      const attestationResponse = await startRegistration(options);

      // 3. Verify on server
      const verificationRes = await fetch('/api/auth/biometrics/verify-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, attestationResponse }),
      });
      const verification = await verificationRes.json();

      if (verification.success) {
        toast.success('Biometrics registered successfully');
        return true;
      } else {
        throw new Error('Registration verification failed');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Biometric registration failed');
      return false;
    }
  };

  const authenticateBiometrics = async (email: string) => {
    try {
      // 1. Get options from server
      const optionsRes = await fetch('/api/auth/biometrics/login-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const options = await optionsRes.json();

      if (options.error) throw new Error(options.error);

      // 2. Start browser authentication
      const assertionResponse = await startAuthentication(options);

      // 3. Verify on server
      const verificationRes = await fetch('/api/auth/biometrics/verify-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, assertionResponse }),
      });
      const verification = await verificationRes.json();

      if (verification.success) {
        toast.success('Biometric verification successful');
        return true;
      } else {
        throw new Error('Verification failed');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Biometric authentication failed');
      return false;
    }
  };

  return { registerBiometrics, authenticateBiometrics };
}
