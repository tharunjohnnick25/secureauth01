"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { UserRole } from "@/types/auth"
import { useAuthStore } from "@/store/useAuthStore"
import { ROLE_HIERARCHY } from "@/lib/rbac"

interface RoleGuardProps {
  children: React.ReactNode
  requiredRole: UserRole | UserRole[]
  fallback?: React.ReactNode
}

export function RoleGuard({ children, requiredRole, fallback }: RoleGuardProps) {
  const { user, isAuthenticated } = useAuthStore()
  
  if (!isAuthenticated || !user) {
    if (fallback) return <>{fallback}</>
    return null
  }

  const userRole = (user.role || 'EMPLOYEE').toUpperCase() as UserRole;
  const userWeight = ROLE_HIERARCHY[userRole] || 0;

  let hasRequiredRole = false;

  if (Array.isArray(requiredRole)) {
    // True if user has any of the specific roles OR is a higher authority than the highest required role
    const specificMatch = requiredRole.map(r => r.toUpperCase() as UserRole).includes(userRole);
    const maximumRequiredWeight = Math.max(...requiredRole.map(r => ROLE_HIERARCHY[r.toUpperCase() as UserRole] || 0));
    
    hasRequiredRole = specificMatch || userWeight >= maximumRequiredWeight;
  } else {
    // True if user matches exactly OR is hierarchical superior
    const requiredWeight = ROLE_HIERARCHY[requiredRole.toUpperCase() as UserRole] || 0;
    hasRequiredRole = userWeight >= requiredWeight;
  }

  if (!hasRequiredRole) {
    if (fallback) return <>{fallback}</>
    return null
  }

  return <>{children}</>
}
