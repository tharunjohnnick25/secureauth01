export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'EMPLOYEE' | 'USER';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: UserRole;
  organization_id?: string;
  created_at: string;
  last_login?: string;
  mfa_enabled: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED';
}

export interface AuthSession {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'EXECUTE';
}

export interface RolePermission {
  role: UserRole;
  permissions: Permission[];
}
