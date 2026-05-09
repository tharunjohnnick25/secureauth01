import { Card, CardHeader, CardTitle, CardContent } from '@/components/components/Card';
import { Sidebar } from '@/components/components/Sidebar';
import { Navbar } from '@/components/components/Navbar';
import { Button } from '@/components/components/Button';
import {
  Users,
  Activity,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

const users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    status: 'active',
    lastLogin: '2 min ago',
    riskScore: 'low',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'User',
    status: 'active',
    lastLogin: '1 hour ago',
    riskScore: 'low',
  },
  {
    id: 3,
    name: 'Bob Wilson',
    email: 'bob.wilson@example.com',
    role: 'User',
    status: 'active',
    lastLogin: '3 hours ago',
    riskScore: 'high',
  },
  {
    id: 4,
    name: 'Alice Brown',
    email: 'alice.brown@example.com',
    role: 'User',
    status: 'suspended',
    lastLogin: '2 days ago',
    riskScore: 'medium',
  },
];

const auditLogs = [
  {
    id: 1,
    user: 'john.doe@example.com',
    action: 'User login',
    details: 'Successful authentication from Chrome/MacOS',
    timestamp: '2026-04-30 14:32:15',
  },
  {
    id: 2,
    user: 'jane.smith@example.com',
    action: 'Device added',
    details: 'New trusted device: iPhone 15 Pro',
    timestamp: '2026-04-30 13:15:42',
  },
  {
    id: 3,
    user: 'bob.wilson@example.com',
    action: 'Failed login',
    details: 'Invalid credentials (attempt 3/5)',
    timestamp: '2026-04-30 12:45:28',
  },
];

export function Admin() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="ml-64">
        <Navbar />
        <main className="pt-20 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold mb-2">Admin Panel</h1>
            <p className="text-muted-foreground">
              Manage users, monitor activity, and review audit logs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <h3 className="text-2xl font-semibold">{users.length}</h3>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Now</p>
                  <h3 className="text-2xl font-semibold">
                    {users.filter((u) => u.status === 'active').length}
                  </h3>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-warning/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">High Risk</p>
                  <h3 className="text-2xl font-semibold">
                    {users.filter((u) => u.riskScore === 'high').length}
                  </h3>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-destructive/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Suspended</p>
                  <h3 className="text-2xl font-semibold">
                    {users.filter((u) => u.status === 'suspended').length}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>User Management</CardTitle>
              <Button size="sm">Add User</Button>
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
                        Role
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Risk Score
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Last Login
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-border/50">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs">
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              user.status === 'active'
                                ? 'bg-success/20 text-success'
                                : 'bg-destructive/20 text-destructive'
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              user.riskScore === 'high'
                                ? 'bg-destructive/20 text-destructive'
                                : user.riskScore === 'medium'
                                ? 'bg-warning/20 text-warning'
                                : 'bg-success/20 text-success'
                            }`}
                          >
                            {user.riskScore}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {user.lastLogin}
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="outline" size="sm">
                            Manage
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 rounded-lg bg-input-background/30 hover:bg-input-background/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{log.action}</h4>
                          <span className="text-xs text-primary">{log.user}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{log.details}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {log.timestamp}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
