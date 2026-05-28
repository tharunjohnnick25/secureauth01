"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { UserRole } from "@/types/auth"
// import { useAuth } from "@/hooks/useAuth" // Placeholder hook

interface RoleGuardProps {
  children: React.ReactNode
  requiredRole: UserRole | UserRole[]
  fallback?: React.ReactNode
}

export function RoleGuard({ children, requiredRole, fallback }: RoleGuardProps) {
  const router = useRouter()
  // const { user, isLoading } = useAuth()
  
  // For now, mock the user role
  const user = { role: 'SUPER_ADMIN' as UserRole } // Mock data
  const isLoading = false

  if (isLoading) {
    return <div>Loading...</div> // Should use a proper Skeleton component
  }

  const hasRequiredRole = Array.isArray(requiredRole)
    ? requiredRole.includes(user?.role as UserRole)
    : user?.role === requiredRole

  if (!user || !hasRequiredRole) {
    if (fallback) return <>{fallback}</>
    
    // Default fallback: show nothing or redirect
    return null
  }

  return <>{children}</>
}
