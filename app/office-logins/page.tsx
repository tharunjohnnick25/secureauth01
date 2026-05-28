'use client';

import { MetricsDashboard } from '@/components/pages/MetricsDashboard';
import { MapPin, Users, ShieldAlert, LogIn } from 'lucide-react';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { useMemo } from 'react';

export default function Page() {
  const { data: dbLogs } = useRealtimeData('office_access_logs');
  const { data: threatLogs } = useRealtimeData('threat_logs');

  const stats = useMemo(() => {
    const active = dbLogs?.filter((l: any) => l.access_type === 'ENTRY').length || 0;
    const suspicious = threatLogs?.length || 0;
    
    return [
      { title: 'Active On-Site', value: active.toString(), trend: '+12%', trendUp: true, icon: Users },
      { title: 'Remote Logins', value: '891', trend: '+5%', trendUp: true, icon: LogIn },
      { title: 'Suspicious Locations', value: suspicious.toString(), trend: 'Active', trendUp: true, icon: ShieldAlert },
      { title: 'Monitored Offices', value: '12', icon: MapPin },
    ];
  }, [dbLogs, threatLogs]);

  const recent = useMemo(() => {
    if (!dbLogs || dbLogs.length === 0) return [
      { id: '1', title: 'Login from new country (Brazil)', time: '5 mins ago', status: 'danger' as const },
      { id: '2', title: 'Group check-in at NY HQ', time: '10 mins ago', status: 'success' as const },
      { id: '3', title: 'VPN IP Detected', time: '1 hour ago', status: 'warning' as const },
    ];
    return dbLogs.slice(0, 5).map((l: any) => ({
      id: l.id,
      title: `${l.access_type === 'ENTRY' ? 'Check-in' : 'Check-out'} at ${l.location}`,
      time: new Date(l.timestamp).toLocaleTimeString(),
      status: 'success' as const
    }));
  }, [dbLogs]);

  return (
    <MetricsDashboard 
      title="Office Logins & Geolocation" 
      description="Monitor physical access and geo-fenced attendance."
      metrics={stats}
      chartData={[
        { name: '08:00', value: 120 }, { name: '09:00', value: 400 },
        { name: '10:00', value: 380 }, { name: '11:00', value: 450 },
        { name: '12:00', value: 420 }, { name: '13:00', value: 490 }
      ]}
      recentActivity={recent}
    />
  );
}