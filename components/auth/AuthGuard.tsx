'use client';

import { useEffect, useState } from 'react';
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
  const { user, isAuthenticated, requiresBiometric, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      // Fallback: Check custom JWT in localStorage for Admin
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const localUserStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      let localUser = null;
      try {
         if (localUserStr) localUser = JSON.parse(localUserStr);
      } catch (e) {}

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session && !isAuthenticated && !token) {
        if (pathname !== '/login' && pathname !== '/signup' && pathname !== '/forgot-password' && !pathname.startsWith('/admin/login')) {
          router.push(`/login?redirectTo=${pathname}`);
        }
        setIsLoading(false);
        return;
      }

      if (requiresBiometric && pathname !== '/verify-biometric') {
        router.push('/verify-biometric');
        setIsLoading(false);
        return;
      }

      // Check admin status if required
      if (requireAdmin) {
        let isAdmin = false;
        
        if (session) {
          const { data: profile } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single();
          if (profile?.role === 'admin') isAdmin = true;
        } else if (localUser && localUser.role === 'admin') {
          isAdmin = true;
        }

        if (!isAdmin) {
          router.push('/unauthorized');
          setIsLoading(false);
          return;
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        logout();
        router.push('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user, isAuthenticated, requiresBiometric, requireAdmin, router, pathname, logout, supabase]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-cyber-dark)]">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center animate-pulse">
            <Shield className="w-8 h-8 text-primary animate-bounce" />
          </div>
          <div className="absolute inset-0 rounded-2xl border border-primary/50 animate-ping" />
        </div>
        <p className="mt-6 text-primary font-cyber text-glow animate-pulse">Securing Session...</p>
      </div>
    );
  }

  return <>{children}</>;
}
