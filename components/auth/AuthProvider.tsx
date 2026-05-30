"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';
import type { Session } from '@supabase/supabase-js';
import { log } from '@/lib/logger';

interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
  signOut: async () => {},
});

const SESSION_STORAGE_KEY = 'secureauth.supabase.session';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(() => {
    // Fast restore from localStorage to avoid "securing session" flicker
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(SESSION_STORAGE_KEY) : null;
      if (raw) return JSON.parse(raw) as Session;
    } catch (e) {
      // ignore parse errors
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(!session);
  const { setUser, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const syncingRef = useRef<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();

        if (!mounted) return;

        if (initialSession) {
          setSession(initialSession);
          try {
            localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(initialSession));
          } catch {}

          // sync profile only once per user
          if (initialSession.user && syncingRef.current !== initialSession.user.id) {
            syncingRef.current = initialSession.user.id;
            await syncUserWithProfile(initialSession.user.id, initialSession.user.email ?? '');
          }
        } else {
          setSession(null);
          try { localStorage.removeItem(SESSION_STORAGE_KEY); } catch {}
        }
      } catch (err) {
        log('error', 'AuthProvider.init', String(err));
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    init();

    const { data } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      try {
        setSession(newSession);
        if (newSession) {
          try { localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newSession)); } catch {}

          if (newSession.user && syncingRef.current !== newSession.user.id) {
            syncingRef.current = newSession.user.id;
            await syncUserWithProfile(newSession.user.id, newSession.user.email ?? '');
          }
        } else {
          try { localStorage.removeItem(SESSION_STORAGE_KEY); } catch {}
          logout();
        }
      } catch (err) {
        log('error', 'AuthProvider.onAuthStateChange', String(err));
      } finally {
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [setUser, logout]);

  const syncUserWithProfile = async (userId: string, email: string) => {
    try {
      const { data: profile } = await supabase
        .from('users')
        .select('id, role, full_name')
        .eq('id', userId)
        .single();

      if (profile) {
        const p = profile as { id: string; role?: string; full_name?: string };
        setUser({
          id: userId,
          email: email,
          role: p.role || 'employee',
          first_name: p.full_name?.split(' ')[0] || '',
          last_name: p.full_name?.split(' ').slice(1).join(' ') || '',
        });
      }
    } catch (error) {
      log('error', 'syncUserWithProfile', String(error));
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      log('error', 'signOut', String(err));
    }
    logout();
    try { localStorage.removeItem(SESSION_STORAGE_KEY); } catch {}
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ session, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
