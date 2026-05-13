'use client';

import { useMemo } from 'react';
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
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { formatDistanceToNow } from 'date-fns';

export function Dashboard() {
  const { data: logins, loading: loginsLoading } = useRealtimeData('login_history', (q) => q.select('*').order('created_at', { ascending: false }).limit(20));
  const { data: alerts } = useRealtimeData('alerts', (q) => q.select('*').order('created_at', { ascending: false }).limit(10));
  const { data: devices } = useRealtimeData('devices');
  const { data: allLogins } = useRealtimeData('login_history', (q) => q.select('status, created_at'));

  // Calculate Stats
  const stats = useMemo(() => {
    const successCount = (allLogins as any[]).filter((l: any) => l.status === 'success').length;
    const totalCount = (allLogins as any[]).length;
    const activeDevices = (devices as any[]).length;
    const activeAlerts = (alerts as any[]).filter((a: any) => !a.is_read).length;
    
    // Risk Score based on recent alerts
    const highRiskAlerts = (alerts as any[]).filter((a: any) => a.severity === 'critical' || a.severity === 'high').length;
    let riskLevel = 'Low';
    let riskColor = 'text-success';
    if (highRiskAlerts > 5) {
      riskLevel = 'Critical';
      riskColor = 'text-destructive';
    } else if (highRiskAlerts > 2) {
      riskLevel = 'Medium';
      riskColor = 'text-warning';
    }

    return { successCount, totalCount, activeDevices, activeAlerts, riskLevel, riskColor };
  }, [allLogins, devices, alerts]);

  // Aggregate Chart Data
  const chartData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return { day: days[d.getDay()], success: 0, failed: 0 };
    });

    (allLogins as any[]).forEach((log: any) => {
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
    const low = (allLogins as any[]).filter((l: any) => (l.risk_score || 0) < 30).length;
    const medium = (allLogins as any[]).filter((l: any) => (l.risk_score || 0) >= 30 && (l.risk_score || 0) < 70).length;
    const high = (allLogins as any[]).filter((l: any) => (l.risk_score || 0) >= 70).length;

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
        <main className="pt-20 p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold mb-2">Security Dashboard</h1>
              <p className="text-muted-foreground">Real-time enterprise-grade IAM monitoring</p>
            </div>
            <div className="flex items-center gap-3 bg-primary/10 px-4 py-2 rounded-lg border border-primary/20">
              <Activity className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">System Live</span>
            </div>
          </div>

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
                  <p className="text-sm text-muted-foreground">Active Devices</p>
                  <h3 className="text-2xl font-semibold">{stats.activeDevices}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Across entire network</p>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Authentication Trends (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.1)" vertical={false} />
                      <XAxis dataKey="day" stroke="#9ca3af" axisLine={false} tickLine={false} />
                      <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(17, 24, 39, 0.9)',
                          border: '1px solid rgba(99, 102, 241, 0.2)',
                          borderRadius: '12px',
                          backdropFilter: 'blur(8px)',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="success"
                        stroke="#6366f1"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#successGradient)"
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Global Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={8}
                        dataKey="value"
                      >
                        {riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(17, 24, 39, 0.9)',
                          border: '1px solid rgba(99, 102, 241, 0.2)',
                          borderRadius: '12px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-6 space-y-3">
                  {riskDistribution.map((item) => (
                    <div key={item.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <span className="text-sm font-bold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

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
                    {(logins as any[]).map((log: any) => (
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
                          No recent activity found.
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
