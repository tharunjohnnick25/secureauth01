import { Card, CardHeader, CardTitle, CardContent } from '@/components/components/Card';
import { Sidebar } from '@/components/components/Sidebar';
import { Navbar } from '@/components/components/Navbar';
import { Button } from '@/components/components/Button';
import {
  Users,
  Plus,
  UserPlus,
  Mail,
  MoreVertical,
  Crown,
  Shield,
  Eye,
} from 'lucide-react';

const teamMembers = [
  { id: '1', name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'Owner', status: 'Active', lastActive: '2 min ago', avatar: 'SC' },
  { id: '2', name: 'Michael Rodriguez', email: 'michael.r@company.com', role: 'Admin', status: 'Active', lastActive: '15 min ago', avatar: 'MR' },
  { id: '3', name: 'Emily Thompson', email: 'emily.t@company.com', role: 'Admin', status: 'Active', lastActive: '1 hour ago', avatar: 'ET' },
  { id: '4', name: 'David Kim', email: 'david.kim@company.com', role: 'Member', status: 'Active', lastActive: '3 hours ago', avatar: 'DK' },
  { id: '5', name: 'Lisa Anderson', email: 'lisa.a@company.com', role: 'Member', status: 'Active', lastActive: '5 hours ago', avatar: 'LA' },
  { id: '6', name: 'James Wilson', email: 'james.w@company.com', role: 'Viewer', status: 'Active', lastActive: '1 day ago', avatar: 'JW' },
  { id: '7', name: 'Maria Garcia', email: 'maria.g@company.com', role: 'Member', status: 'Invited', lastActive: 'Never', avatar: 'MG' },
];

const roleStats = [
  { role: 'Owner', count: 1, icon: Crown, color: 'warning' },
  { role: 'Admin', count: 2, icon: Shield, color: 'primary' },
  { role: 'Member', count: 3, icon: Users, color: 'success' },
  { role: 'Viewer', count: 1, icon: Eye, color: 'muted' },
];

const pendingInvites = [
  { email: 'maria.g@company.com', role: 'Member', sentBy: 'Sarah Chen', sentAt: '2026-04-28', expiresAt: '2026-05-05' },
  { email: 'john.doe@company.com', role: 'Viewer', sentBy: 'Michael Rodriguez', sentAt: '2026-04-27', expiresAt: '2026-05-04' },
];

export function TeamManagement() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="ml-64">
        <Navbar />
        <main className="pt-20 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold mb-2">Team Management</h1>
              <p className="text-muted-foreground">
                Manage your team members and their access
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Invite Members
              </Button>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {roleStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg bg-${stat.color}/20 flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.role}</p>
                    <h3 className="text-2xl font-semibold">{stat.count}</h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team Members ({teamMembers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-input-background/30 hover:bg-input-background/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-semibold text-primary">
                        {member.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{member.name}</h4>
                          {member.role === 'Owner' && (
                            <Crown className="w-4 h-4 text-warning" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded ${
                          member.role === 'Owner' ? 'bg-warning/20 text-warning' :
                          member.role === 'Admin' ? 'bg-primary/20 text-primary' :
                          member.role === 'Member' ? 'bg-success/20 text-success' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {member.role}
                        </span>
                      </div>
                      <div className="text-right min-w-[100px]">
                        <span className={`text-xs px-2 py-1 rounded ${
                          member.status === 'Active' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                        }`}>
                          {member.status}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">{member.lastActive}</p>
                      </div>
                      <button className="p-2 hover:bg-input-background rounded">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Pending Invitations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingInvites.map((invite, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-input-background/30 hover:bg-input-background/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium mb-1">{invite.email}</h4>
                          <p className="text-sm text-muted-foreground">Invited by {invite.sentBy}</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">
                          {invite.role}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Sent: {invite.sentAt}</span>
                        <span>Expires: {invite.expiresAt}</span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm" className="flex-1">
                          Resend
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Role Permissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="w-4 h-4 text-warning" />
                      <h4 className="font-medium">Owner</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Full access to all features including billing, team management, and security settings.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-primary" />
                      <h4 className="font-medium">Admin</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Manage team members, configure security policies, and access all monitoring features.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-success" />
                      <h4 className="font-medium">Member</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      View dashboards, manage own devices, and receive security alerts.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/10 border border-muted/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                      <h4 className="font-medium">Viewer</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Read-only access to dashboards and reports. Cannot modify any settings.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
