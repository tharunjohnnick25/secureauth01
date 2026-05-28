'use client';

import { MetricsDashboard } from '@/components/pages/MetricsDashboard';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShieldAlert, 
  Activity,
  Calendar
} from 'lucide-react';
import { useMemo } from 'react';

export default function AnalyticsPage() {
  const { data: logs, loading } = useRealtimeData('login_logs', (q) => 
    q.order('created_at', { ascending: false }).limit(100)
  );

  const { data: threatAlerts } = useRealtimeData('threat_alerts');

  const stats = useMemo(() => {
    const totalLogins = logs?.length || 0;
    const failures = logs?.filter((l: any) => l.status === 'FAILURE').length || 0;
    const failureRate = totalLogins > 0 ? ((failures / totalLogins) * 100).toFixed(1) : '0';
    const activeThreats = threatAlerts?.filter((t: any) => t.status === 'OPEN').length || 0;

    return [
      { title: 'Total Access Events', value: totalLogins.toString(), trend: '+14%', trendUp: true, icon: Activity },
      { title: 'Failure Rate', value: `${failureRate}%`, trend: '-2.1%', trendUp: true, icon: ShieldAlert },
      { title: 'Active Threats', value: activeThreats.toString(), trend: '+5', trendUp: false, icon: TrendingUp },
      { title: 'Unique Users', value: new Set(logs?.map((l: any) => l.user_id)).size.toString(), icon: Users },
    ];
  }, [logs, threatAlerts]);

  const recentActivity = useMemo(() => {
    return logs?.slice(0, 5).map((log: any) => ({
      id: log.id,
      title: `${log.status === 'SUCCESS' ? 'Authorized' : 'Denied'} Access - ${log.ip_address}`,
      time: new Date(log.created_at).toLocaleTimeString(),
      status: (log.status === 'SUCCESS' ? 'success' : 'danger') as 'success' | 'warning' | 'danger'
    })) || [];
  }, [logs]);

  return (
    <MetricsDashboard 
      title="System Analytics & Core Metrics" 
      description="In-depth analysis of authentication patterns and adaptive security performance."
      metrics={stats}
      chartData={[
        { name: '00:00', value: 45 }, { name: '04:00', value: 30 },
        { name: '08:00', value: 180 }, { name: '12:00', value: 240 },
        { name: '16:00', value: 210 }, { name: '20:00', value: 120 }
      ]}
      recentActivity={recentActivity}
    />
  );
}