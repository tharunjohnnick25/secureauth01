'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { createClient } from '@/lib/supabase/client';
import { Shield } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, requiresBiometric, setUser, logout } = useAuthStore();
  const [hasChecked, setHasChecked] = useState(false);
  const isCheckingRef = useRef(false);

  // ✅ FIX: Only run once on mount, not on every route change
  useEffect(() => {
    // If already authenticated via persisted store, skip the async check immediately
    if (isAuthenticated && user) {
      setHasChecked(true);
      return;
    }

    // Prevent duplicate concurrent calls
    if (isCheckingRef.current || hasChecked) return;
    isCheckingRef.current = true;

    const checkAuth = async () => {
      try {
        const supabase = createClient();
        // Give a timeout to getSession to prevent infinite loading
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Auth check timeout')), 5000)
        );

        const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]) as any;

        if (session && !isAuthenticated) {
          setUser({
            id: session.user.id,
            email: session.user.email ?? '',
            role: (session.user.user_metadata?.role as string) ?? 'user',
            first_name: session.user.user_metadata?.first_name,
            last_name: session.user.user_metadata?.last_name,
          });
        } else if (!session && !isAuthenticated) {
          const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
          if (!token) {
            router.replace(`/login?redirectTo=${encodeURIComponent(pathname)}`);
            return;
          }
        }
      } catch (error) {
        console.error('AuthGuard check failed:', error);
      } finally {
        setHasChecked(true);
        isCheckingRef.current = false;
      }
    };

    checkAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen to auth state changes once on mount — logout detection
  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        logout();
        router.replace('/login');
      }
    });
    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle biometric requirement
  useEffect(() => {
    if (requiresBiometric && pathname !== '/verify-biometric') {
      router.replace('/verify-biometric');
    }
  }, [requiresBiometric, pathname, router]);

  // Handle admin requirement
  useEffect(() => {
    if (hasChecked && isAuthenticated && requireAdmin && user?.role !== 'admin') {
      router.replace('/unauthorized');
    }
  }, [hasChecked, isAuthenticated, requireAdmin, user, router]);

  // ✅ FIX: If auth state is persisted in Zustand, render children IMMEDIATELY.
  // The loading screen only shows when there is genuinely no auth state at all on first visit.
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Not authenticated and haven't finished checking — show minimal, FAST loading indicator
  if (!hasChecked && !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-cyber-dark)]">
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary animate-spin" style={{ animationDuration: '1.5s' }} />
          </div>
        </div>
        <p className="mt-4 text-primary/70 text-sm animate-pulse">Securing Session...</p>
      </div>
    );
  }

  return <>{children}</>;
}
