import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  role: string;
  first_name?: string;
  last_name?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  requiresMfa: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical' | null;
  setUser: (user: User | null) => void;
  setRequiresMfa: (val: boolean, riskLevel?: AuthState['riskLevel']) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      requiresMfa: false,
      riskLevel: null,
      setUser: (user) => set({ user, isAuthenticated: !!user, requiresMfa: false }),
      setRequiresMfa: (requiresMfa, riskLevel) => set({ requiresMfa, riskLevel: riskLevel || null }),
      logout: () => set({ user: null, isAuthenticated: false, requiresMfa: false, riskLevel: null }),
    }),
    {
      name: 'cyber-auth-storage',
    }
  )
);
