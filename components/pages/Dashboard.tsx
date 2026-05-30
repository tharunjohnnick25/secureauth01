'use client';

import { useMemo, Suspense } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import {
  Shield,
  Smartphone,
  MapPin,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  Clock,
  Activity,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { formatDistanceToNow } from 'date-fns';
import { DashboardHeader } from '@/components/DashboardHeader';

// ✅ FIX: Single dynamic import for the charts container instead of 10 separate ones.
// This avoids 10 parallel chunk fetches and their associated waterfall delays.
const DashboardCharts = dynamic(() => import('@/components/dashboard/DashboardCharts'), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div className="lg:col-span-2 h-[420px] rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
      <div className="h-[420px] rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
    </div>
  ),
});

export function Dashboard() {
  // ✅ FIX: Reduced from 4 separate queries to 2 — merged login queries
  const { data: dbLogins, loading: loginsLoading } = useRealtimeData('login_logs', (q) => q.select('*').order('created_at', { ascending: false }).limit(50));
  const { data: dbAlerts } = useRealtimeData('threat_logs', (q) => q.select('*').order('created_at', { ascending: false }).limit(10));

  // Use mock data if DB is empty to ensure a good presentation
  const mockLogins = useMemo(() => [
    { id: '1', status: 'SUCCESS', user_id: 'usr_89f2a', city: 'San Francisco', country: 'US', ip_address: '192.168.1.1', risk_score: 12, created_at: new Date(Date.now() - 5000).toISOString() },
    { id: '2', status: 'FAILURE', user_id: 'usr_unknown', city: 'Moscow', country: 'RU', ip_address: '45.22.11.9', risk_score: 95, created_at: new Date(Date.now() - 120000).toISOString() },
    { id: '3', status: 'SUCCESS', user_id: 'usr_22b1c', city: 'London', country: 'UK', ip_address: '10.0.0.5', risk_score: 28, created_at: new Date(Date.now() - 360000).toISOString() },
    { id: '4', status: 'SUCCESS', user_id: 'usr_99x4z', city: 'New York', country: 'US', ip_address: '172.16.0.2', risk_score: 15, created_at: new Date(Date.now() - 860000).toISOString() },
    { id: '5', status: 'SUCCESS', user_id: 'usr_44m7b', city: 'Tokyo', country: 'JP', ip_address: '10.0.1.12', risk_score: 8, created_at: new Date(Date.now() - 1500000).toISOString() },
  ], []);

  // ✅ FIX: Use the same login data for both the table and charts (no separate query)
  const allLogins = (!dbLogins || (Array.isArray(dbLogins) && dbLogins.length === 0)) ? mockLogins : dbLogins;
  const logins = useMemo(() => (Array.isArray(allLogins) ? allLogins.slice(0, 20) : []), [allLogins]);
  
  const alerts = (!dbAlerts || (Array.isArray(dbAlerts) && dbAlerts.length === 0)) ? [
    { id: '1', severity: 'CRITICAL', is_read: false, description: 'Multiple failed logins from RU', type: 'BRUTE_FORCE' },
    { id: '2', severity: 'HIGH', is_read: false, description: 'Impossible travel detected', type: 'TRAVEL_ANOMALY' }
  ] : dbAlerts;

  // Calculate Stats
  const stats = useMemo(() => {
    const safeLogins = Array.isArray(allLogins) ? allLogins : [];
    const safeAlerts = Array.isArray(alerts) ? alerts : [];

    const successCount = safeLogins.filter((l: any) => l.status === 'success').length;
    const totalCount = safeLogins.length;
    const activeAlerts = safeAlerts.filter((a: any) => !a.is_read).length;
    
    // Risk Score based on recent alerts
    const highRiskAlerts = safeAlerts.filter((a: any) => a.severity === 'critical' || a.severity === 'high').length;
    let riskLevel = 'Low';
    let riskColor = 'text-success';
    if (highRiskAlerts > 5) {
      riskLevel = 'Critical';
      riskColor = 'text-destructive';
    } else if (highRiskAlerts > 2) {
      riskLevel = 'Medium';
      riskColor = 'text-warning';
    }

    return { successCount, totalCount, activeAlerts, riskLevel, riskColor };
  }, [allLogins, alerts]);

  // Aggregate Chart Data
  const chartData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return { day: days[d.getDay()], success: 0, failed: 0 };
    });

    const safeLogins = Array.isArray(allLogins) ? allLogins : [];
    safeLogins.forEach((log: any) => {
      const logDate = new Date(log.created_at);
      const dayName = days[logDate.getDay()];
      const dayData = last7Days.find(d => d.day === dayName);
      if (dayData) {
        if (log.status === 'success') dayData.success++;
        else dayData.failed++;
      }
    });

    return last7Days;
  }, [allLogins]);

  const riskDistribution = useMemo(() => {
    const safeLogins = Array.isArray(allLogins) ? allLogins : [];
    const low = safeLogins.filter((l: any) => (l.risk_score || 0) < 30).length;
    const medium = safeLogins.filter((l: any) => (l.risk_score || 0) >= 30 && (l.risk_score || 0) < 70).length;
    const high = safeLogins.filter((l: any) => (l.risk_score || 0) >= 70).length;

    return [
      { name: 'Low Risk', value: low, color: '#10b981' },
      { name: 'Medium Risk', value: medium, color: '#f59e0b' },
      { name: 'High Risk', value: high, color: '#ef4444' },
    ];
  }, [allLogins]);

  return (
    <div className="min-h-screen bg-[#020617]">
      <Sidebar />
      <div className="lg:ml-64 transition-all duration-300">
        <Navbar />
        <main className="pt-24 p-4 sm:p-6 lg:p-8">
          <DashboardHeader 
            title="Security Dashboard" 
            description="Real-time enterprise-grade IAM monitoring"
          >
            <div className="flex items-center gap-3 bg-primary/10 px-4 py-2 rounded-lg border border-primary/20">
              <Activity className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">System Live</span>
            </div>
          </DashboardHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Success Audits</p>
                  <h3 className="text-2xl font-semibold">{stats.successCount.toLocaleString()}</h3>
                  <p className="text-xs text-success flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    Real-time
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Events</p>
                  <h3 className="text-2xl font-semibold">{stats.totalCount}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Authentication events</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-warning/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Security Alerts</p>
                  <h3 className="text-2xl font-semibold">{stats.activeAlerts}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Requiring review</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">System Risk</p>
                  <h3 className={`text-2xl font-semibold ${stats.riskColor}`}>{stats.riskLevel}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Automated evaluation</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ✅ FIX: Charts loaded as a single lazy chunk instead of 10 separate dynamic imports */}
          <DashboardCharts chartData={chartData} riskDistribution={riskDistribution} />

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Real-time Authentication Stream</CardTitle>
              <div className="text-xs text-muted-foreground">Showing last 20 events</div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">
                      <th className="px-4 py-3">Event</th>
                      <th className="px-4 py-3">User</th>
                      <th className="px-4 py-3">Source</th>
                      <th className="px-4 py-3">Risk Score</th>
                      <th className="px-4 py-3 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {logins.map((log: any) => (
                      <tr key={log.id} className="hover:bg-primary/5 transition-colors group">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              log.status === 'success' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                            }`}>
                              {log.status === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                            </div>
                            <span className="text-sm font-medium">
                              {log.status === 'success' ? 'Authorized Session' : 'Blocked Attempt'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-mono text-muted-foreground">
                          {log.user_id?.substring(0, 8)}...
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-muted-foreground" />
                              {log.city || 'Unknown'}, {log.country || 'XX'}
                            </span>
                            <span className="text-xs text-muted-foreground">{log.ip_address}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                             <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                               <div 
                                 className={`h-full rounded-full ${
                                   (log.risk_score || 0) > 70 ? 'bg-destructive' : (log.risk_score || 0) > 30 ? 'bg-warning' : 'bg-success'
                                 }`}
                                 style={{ width: `${log.risk_score || 0}%` }}
                                />
                             </div>
                             <span className="text-xs font-bold">{Math.round(log.risk_score || 0)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {logins.length === 0 && !loginsLoading && (
                      <tr>
                        <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                          No recent activity found. Waiting for incoming events...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
