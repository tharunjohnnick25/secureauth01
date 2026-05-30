import { supabase } from '@/lib/supabase';

export interface DashboardStats {
  totalUsers: number;
  activeSessions: number;
  failedAttempts: number;
  mfaEnabledPercent: number;
}

export const DashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    // 1. Total Users
    const { count: userCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // 2. Active Sessions (last 24 hours)
    const { count: sessionCount } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .gt('last_active', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    // 3. Failed Attempts (last 24 hours)
    const { count: failedCount } = await supabase
      .from('login_logs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'FAILURE')
      .gt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    // 4. MFA Enabled Users
    const { count: mfaCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('mfa_enabled', true);

    const total = userCount || 1;
    const mfaEnabledPercent = Math.round(((mfaCount || 0) / total) * 100);

    return {
      totalUsers: userCount || 0,
      activeSessions: sessionCount || 0,
      failedAttempts: failedCount || 0,
      mfaEnabledPercent,
    };
  },

  getRecentActivities: async () => {
    const { data } = await supabase
      .from('login_logs')
      .select('*, users(email)')
      .order('created_at', { ascending: false })
      .limit(10);
    
    return (data || []).map((log: any) => ({
      id: log.id,
      user: log.users?.email || 'Unknown',
      action: log.status === 'SUCCESS' ? 'Login successful' : 'Login failed',
      timestamp: log.created_at,
      status: log.status === 'SUCCESS' ? 'success' : 'danger',
      ip: log.ip_address,
    }));
  },

  getSecurityAlerts: async () => {
    const { data } = await supabase
      .from('anomaly_logs')
      .select('*, users(email)')
      .eq('is_resolved', false)
      .order('created_at', { ascending: false })
      .limit(5);

    return (data || []).map((alert: any) => ({
      id: alert.id,
      type: alert.type.replace(/_/g, ' '),
      message: alert.details?.message || `Anomaly detected for ${alert.type}`,
      severity: alert.severity.toLowerCase(),
      time: alert.created_at
    }));
  },

  getDepartments: async () => {
    const { data } = await supabase
      .from('departments')
      .select('*, users(full_name)');
    return (data || []).map((dept: any) => ({
       id: dept.id,
       name: dept.name,
       head: dept.users?.full_name || 'Unassigned',
       employees: dept.employee_count || 0,
       risk: (dept.avg_risk_score || 0) > 60 ? 'High' : (dept.avg_risk_score || 0) > 30 ? 'Medium' : 'Low'
    }));
  },

  getAttendance: async () => {
    const { data } = await supabase
      .from('login_logs')
      .select('*, users(full_name, email)')
      .order('created_at', { ascending: false })
      .limit(100);
    return data || [];
  }
};
