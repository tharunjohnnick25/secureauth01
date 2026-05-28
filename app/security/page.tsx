'use client';

import { MetricsDashboard } from '@/components/pages/MetricsDashboard';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { 
  Shield, 
  Lock, 
  Key, 
  Unlock, 
  AlertCircle,
  Fingerprint
} from 'lucide-react';
import { useMemo } from 'react';

export default function SecurityCenterPage() {
  const { data: config, loading } = useRealtimeData('security_config');
  const { data: alerts } = useRealtimeData('alerts');

  const stats = useMemo(() => {
    const criticalAlerts = alerts?.filter((a: any) => a.severity === 'critical').length || 0;
    
    return [
      { title: 'Security Status', value: 'OPTIMAL', trend: 'Secure', trendUp: true, icon: Shield },
      { title: 'System Alerts', value: criticalAlerts.toString(), trend: '-12%', trendUp: true, icon: AlertCircle },
      { title: 'Active MFA Nodes', value: '1,240', trend: '+140', trendUp: true, icon: Fingerprint },
      { title: 'Protocols Active', value: '12', icon: Lock },
    ];
  }, [alerts]);

  const recentActivity = useMemo(() => {
    return alerts?.slice(0, 5).map((alert: any) => ({
      id: alert.id,
      title: alert.type || 'System Event',
      time: new Date(alert.created_at).toLocaleTimeString(),
      status: (alert.severity === 'critical' ? 'danger' : alert.severity === 'warning' ? 'warning' : 'success') as 'success' | 'warning' | 'danger'
    })) || [];
  }, [alerts]);

  return (
    <MetricsDashboard 
      title="Global Security Control Center" 
      description="Manage enterprise-wide authentication protocols, zero-trust policies, and system hardening."
      metrics={stats}
      chartData={[
        { name: 'Jan', value: 85 }, { name: 'Feb', value: 88 },
        { name: 'Mar', value: 92 }, { name: 'Apr', value: 90 },
        { name: 'May', value: 95 }, { name: 'Jun', value: 98 }
      ]}
      recentActivity={recentActivity}
    />
  );
}