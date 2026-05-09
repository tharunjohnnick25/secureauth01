import { Card, CardHeader, CardTitle, CardContent } from '@/components/components/Card';
import { Sidebar } from '@/components/components/Sidebar';
import { Navbar } from '@/components/components/Navbar';
import { Button } from '@/components/components/Button';
import {
  Activity,
  User,
  Monitor,
  Smartphone,
  Tablet,
  MapPin,
  Clock,
  XCircle,
  AlertTriangle,
  Shield,
} from 'lucide-react';

const activeSessions = [
  { id: '1', user: 'sarah.chen@company.com', device: 'Chrome on macOS', deviceType: 'desktop', location: 'New York, US', ip: '192.168.1.105', started: '2 hours ago', lastActivity: '2 min ago', status: 'active' },
  { id: '2', user: 'michael.r@company.com', device: 'Safari on iPhone 14', deviceType: 'mobile', location: 'London, UK', ip: '203.0.113.45', started: '5 hours ago', lastActivity: '15 min ago', status: 'active' },
  { id: '3', user: 'emily.t@company.com', device: 'Firefox on Windows', deviceType: 'desktop', location: 'Tokyo, JP', ip: '198.51.100.89', started: '1 day ago', lastActivity: '1 hour ago', status: 'active' },
  { id: '4', user: 'david.kim@company.com', device: 'Chrome on Android', deviceType: 'mobile', location: 'Singapore, SG', ip: '45.33.32.156', started: '3 hours ago', lastActivity: '30 min ago', status: 'active' },
  { id: '5', user: 'lisa.a@company.com', device: 'Safari on iPad Pro', deviceType: 'tablet', location: 'São Paulo, BR', ip: '192.0.2.45', started: '6 hours ago', lastActivity: '5 min ago', status: 'active' },
  { id: '6', user: 'unknown@suspicious.com', device: 'Unknown Browser', deviceType: 'unknown', location: 'Unknown', ip: '45.76.89.123', started: '10 min ago', lastActivity: '1 min ago', status: 'suspicious' },
];

const sessionStats = [
  { label: 'Active Sessions', value: '287', icon: Activity, color: 'primary' },
  { label: 'Desktop', value: '156', icon: Monitor, color: 'success' },
  { label: 'Mobile', value: '98', icon: Smartphone, color: 'warning' },
  { label: 'Suspicious', value: '3', icon: AlertTriangle, color: 'destructive' },
];

const recentTerminations = [
  { user: 'john.doe@company.com', reason: 'User logout', device: 'Chrome on Windows', time: '15 min ago' },
  { user: 'jane.smith@company.com', reason: 'Session timeout', device: 'Safari on macOS', time: '45 min ago' },
  { user: 'unknown', reason: 'Security policy violation', device: 'Unknown', time: '2 hours ago' },
];

const sessionPolicies = [
  { name: 'Session Timeout', value: '30 minutes', status: 'enabled' },
  { name: 'Concurrent Sessions', value: '3 devices', status: 'enabled' },
  { name: 'Idle Timeout', value: '15 minutes', status: 'enabled' },
  { name: 'Device Trust', value: 'Required', status: 'enabled' },
];

export function SessionManagement() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="ml-64">
        <Navbar />
        <main className="pt-20 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold mb-2">Session Management</h1>
              <p className="text-muted-foreground">
                Monitor and control active user sessions
              </p>
            </div>
            <Button variant="outline">
              <Shield className="w-4 h-4 mr-2" />
              Session Policies
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {sessionStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg bg-${stat.color}/20 flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <h3 className="text-2xl font-semibold">{stat.value}</h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Active Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`p-4 rounded-lg transition-colors ${
                      session.status === 'suspicious'
                        ? 'bg-destructive/10 border border-destructive/20'
                        : 'bg-input-background/30 hover:bg-input-background/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          session.deviceType === 'desktop' ? 'bg-primary/20' :
                          session.deviceType === 'mobile' ? 'bg-warning/20' :
                          session.deviceType === 'tablet' ? 'bg-success/20' :
                          'bg-destructive/20'
                        }`}>
                          {session.deviceType === 'desktop' && <Monitor className="w-5 h-5 text-primary" />}
                          {session.deviceType === 'mobile' && <Smartphone className="w-5 h-5 text-warning" />}
                          {session.deviceType === 'tablet' && <Tablet className="w-5 h-5 text-success" />}
                          {session.deviceType === 'unknown' && <AlertTriangle className="w-5 h-5 text-destructive" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{session.user}</span>
                            {session.status === 'suspicious' && (
                              <span className="text-xs px-2 py-0.5 rounded bg-destructive/20 text-destructive">
                                SUSPICIOUS
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{session.device}</p>
                          <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{session.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-mono">{session.ip}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>Started: {session.started}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Activity className="w-3 h-3" />
                              <span>Active: {session.lastActivity}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <XCircle className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Showing 6 of 287 active sessions</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Previous</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Terminations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTerminations.map((termination, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-input-background/30 hover:bg-input-background/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-sm mb-1">{termination.user}</p>
                          <p className="text-xs text-muted-foreground">{termination.device}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{termination.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="w-3 h-3 text-destructive" />
                        <span className="text-xs text-muted-foreground">{termination.reason}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Session Policies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sessionPolicies.map((policy, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-input-background/30"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{policy.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded ${
                          policy.status === 'enabled' ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'
                        }`}>
                          {policy.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{policy.value}</p>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4">Configure Policies</Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
