import { createServerSupabaseClient } from './supabase/server';

export async function getDashboardStats() {
  const supabase = await createServerSupabaseClient();

  const { count: totalLogins } = await supabase
    .from('login_history')
    .select('*', { count: 'exact', head: true });

  const { data: recentAlerts } = await supabase
    .from('alerts')
    .select('*')
    .eq('is_read', false)
    .order('created_at', { ascending: false })
    .limit(5);

  const { count: activeDevices } = await supabase
    .from('devices')
    .select('*', { count: 'exact', head: true })
    .eq('is_trusted', true);

  return {
    totalLogins: totalLogins || 0,
    activeDevices: activeDevices || 0,
    recentAlerts: recentAlerts || [],
  };
}

export async function getLoginTrends() {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('login_history')
    .select('created_at, status')
    .order('created_at', { ascending: true });

  if (error) return [];

  // Group by day/hour logic would go here
  return data;
}
