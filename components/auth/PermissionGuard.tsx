'use client';

import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { hasPermission } from '@/lib/rbac';

interface PermissionGuardProps {
  children: React.ReactNode;
  permission: string;
  fallback?: React.ReactNode;
  customRolePermissions?: Record<string, string[]>;
}

export function PermissionGuard({
  children,
  permission,
  fallback = null,
  customRolePermissions,
}: PermissionGuardProps) {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <>{fallback}</>;
  }

  const allowed = hasPermission(user.role, permission, customRolePermissions);

  if (!allowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
export default PermissionGuard;
