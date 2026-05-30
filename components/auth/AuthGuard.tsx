'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useAuth } from './AuthProvider';
import { Shield } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { session, isLoading } = useAuth();
  const { user, isAuthenticated, requiresBiometric } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    if (!session && !isAuthenticated) {
      router.replace(`/login?redirectTo=${encodeURIComponent(pathname)}`);
      return;
    }

    // Role-based and permission-based route protection
    if (session && user) {
      const userRole = (user.role || '').toUpperCase();

      // `/admin` routes require administrative privileges
      if (requireAdmin) {
        const isAdminRole = ['SUPER_ADMIN', 'ORGANIZATION_OWNER', 'ORGANIZATION_ADMIN', 'ADMIN'].includes(userRole);
        if (!isAdminRole) {
          router.replace('/unauthorized');
          return;
        }
      }
      
      // Protected modules security rules
      const isSecurityRoute = 
        pathname.startsWith('/security') || 
        pathname.startsWith('/threat-intelligence') || 
        pathname.startsWith('/incident-response') || 
        pathname.startsWith('/vulnerability-scanner') || 
        pathname.startsWith('/forensics') || 
        pathname.startsWith('/alerts-configuration');

      if (isSecurityRoute) {
        // Must have manage_security permission or view_analytics permission (except employee/guest)
        const isEmployeeOrGuest = ['EMPLOYEE', 'GUEST_USER', 'employee', 'guest'].includes(user.role || '');
        const hasSecurityAccess = userRole === 'SECURITY_ANALYST' || userRole === 'SUPER_ADMIN' || userRole === 'ORGANIZATION_OWNER' || userRole === 'ORGANIZATION_ADMIN';
        
        if (isEmployeeOrGuest && !hasSecurityAccess) {
          router.replace('/unauthorized');
          return;
        }
      }

      // Audit logs require compliance/admin permissions
      if (pathname.startsWith('/audit-logs') || pathname.startsWith('/admin/audit')) {
        const hasAuditAccess = ['SUPER_ADMIN', 'ORGANIZATION_OWNER', 'ORGANIZATION_ADMIN', 'SECURITY_ANALYST', 'HR_MANAGER'].includes(userRole);
        if (!hasAuditAccess) {
          router.replace('/unauthorized');
          return;
        }
      }

      // Billing/subscriptions require owner or super admin privileges
      if (pathname.startsWith('/billing') || pathname.startsWith('/subscription-plans')) {
        const hasBillingAccess = ['SUPER_ADMIN', 'ORGANIZATION_OWNER'].includes(userRole);
        if (!hasBillingAccess) {
          router.replace('/unauthorized');
          return;
        }
      }
    }
  }, [session, isAuthenticated, isLoading, pathname, requireAdmin, user, router]);

  // Handle biometric requirement
  useEffect(() => {
    if (requiresBiometric && pathname !== '/verify-biometric') {
      router.replace('/verify-biometric');
    }
  }, [requiresBiometric, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-cyber-dark)]">
        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
          <Shield className="w-6 h-6 text-primary animate-spin" style={{ animationDuration: '1.5s' }} />
        </div>
        <p className="mt-4 text-primary/70 text-sm animate-pulse tracking-widest uppercase font-bold">Securing Session...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return null;
}
