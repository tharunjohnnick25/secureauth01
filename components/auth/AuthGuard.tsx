'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { createClient } from '@/lib/supabase/client';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, requiresMfa } = useAuthStore();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session && !isAuthenticated) {
        router.push(`/login?redirectTo=${pathname}`);
        return;
      }

      if (requiresMfa) {
        router.push('/mfa-verify');
        return;
      }

      if (requireAdmin && user?.role !== 'admin') {
        router.push('/unauthorized');
        return;
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        useAuthStore.getState().logout();
        router.push('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user, isAuthenticated, requiresMfa, requireAdmin, router, pathname, supabase.auth]);

  // Loading state can go here
  if (!isAuthenticated && !requiresMfa) return null;

  return <>{children}</>;
}
