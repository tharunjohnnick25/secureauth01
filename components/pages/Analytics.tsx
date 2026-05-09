import { Card, CardHeader, CardTitle, CardContent } from '@/components/components/Card';
import { Sidebar } from '@/components/components/Sidebar';
import { Navbar } from '@/components/components/Navbar';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

const loginData = [
  { hour: '00:00', logins: 12 },
  { hour: '04:00', logins: 5 },
  { hour: '08:00', logins: 89 },
  { hour: '12:00', logins: 145 },
  { hour: '16:00', logins: 167 },
  { hour: '20:00', logins: 98 },
];

const weeklyData = [
  { day: 'Mon', success: 245, failed: 12, mfa: 230 },
  { day: 'Tue', success: 320, failed: 8, mfa: 310 },
  { day: 'Wed', success: 280, failed: 15, mfa: 265 },
  { day: 'Thu', success: 390, failed: 5, mfa: 380 },
  { day: 'Fri', success: 420, failed: 10, mfa: 405 },
  { day: 'Sat', success: 180, failed: 3, mfa: 175 },
  { day: 'Sun', success: 150, failed: 2, mfa: 148 },
];

const typingPatterns = [
  { user: 'john.doe', avgSpeed: 245, consistency: 92, risk: 'low' },
  { user: 'jane.smith', avgSpeed: 198, consistency: 88, risk: 'low' },
  { user: 'bob.wilson', avgSpeed: 312, consistency: 45, risk: 'high' },
  { user: 'alice.brown', avgSpeed: 267, consistency: 85, risk: 'medium' },
];

export function Analytics() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="ml-64">
        <Navbar />
        <main className="pt-20 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold mb-2">Analytics</h1>
            <p className="text-muted-foreground">
              Deep insights into authentication patterns and user behavior
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <h3 className="text-2xl font-semibold">97.2%</h3>
                  <p className="text-xs text-success flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    +2.1% this week
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Response Time</p>
                  <h3 className="text-2xl font-semibold">234ms</h3>
                  <p className="text-xs text-success flex items-center gap-1 mt-1">
                    <TrendingDown className="w-3 h-3" />
                    -15ms faster
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-warning/20 flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Failed Attempts</p>
                  <h3 className="text-2xl font-semibold">55</h3>
                  <p className="text-xs text-muted-foreground mt-1">This week</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Login Activity by Hour</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={loginData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.1)" />
                    <XAxis dataKey="hour" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(17, 24, 39, 0.9)',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="logins" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Authentication Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.1)" />
                    <XAxis dataKey="day" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(17, 24, 39, 0.9)',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="success" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="mfa" stroke="#6366f1" strokeWidth={2} />
                    <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Typing Behavior Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        User
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Avg Speed (ms)
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Consistency
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Risk Level
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Progress
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {typingPatterns.map((pattern, index) => (
                      <tr key={index} className="border-b border-border/50">
                        <td className="py-3 px-4 font-medium">{pattern.user}</td>
                        <td className="py-3 px-4">{pattern.avgSpeed}</td>
                        <td className="py-3 px-4">{pattern.consistency}%</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              pattern.risk === 'high'
                                ? 'bg-destructive/20 text-destructive'
                                : pattern.risk === 'medium'
                                ? 'bg-warning/20 text-warning'
                                : 'bg-success/20 text-success'
                            }`}
                          >
                            {pattern.risk}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                pattern.risk === 'high'
                                  ? 'bg-destructive'
                                  : pattern.risk === 'medium'
                                  ? 'bg-warning'
                                  : 'bg-success'
                              }`}
                              style={{ width: `${pattern.consistency}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
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
