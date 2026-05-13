'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minutes

export function SessionTimeout() {
  const { isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const timeoutRef = useRef<any>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    if (isAuthenticated) {
      timeoutRef.current = setTimeout(() => {
        handleLogout();
      }, TIMEOUT_DURATION);
    }
  };

  const handleLogout = () => {
    logout();
    toast.error('Session expired due to inactivity');
    router.push('/login');
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      window.addEventListener(event, resetTimeout);
    });

    resetTimeout();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach(event => {
        window.removeEventListener(event, resetTimeout);
      });
    };
  }, [isAuthenticated]);

  return null;
}
