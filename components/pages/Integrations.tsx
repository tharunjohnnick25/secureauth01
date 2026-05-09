import { Card, CardHeader, CardTitle, CardContent } from '@/components/components/Card';
import { Sidebar } from '@/components/components/Sidebar';
import { Navbar } from '@/components/components/Navbar';
import { Button } from '@/components/components/Button';
import {
  Puzzle,
  CheckCircle,
  Settings,
  ExternalLink,
  Slack,
  Github,
  Cloud,
  Database,
  Mail,
  MessageSquare,
} from 'lucide-react';

const integrations = [
  {
    name: 'Slack',
    icon: Slack,
    description: 'Send security alerts and notifications to Slack channels',
    status: 'Connected',
    category: 'Communication',
    lastSync: '2 hours ago',
    color: 'primary'
  },
  {
    name: 'GitHub',
    icon: Github,
    description: 'Sync security events with GitHub Security Advisories',
    status: 'Connected',
    category: 'Development',
    lastSync: '5 hours ago',
    color: 'primary'
  },
  {
    name: 'Jira',
    icon: MessageSquare,
    description: 'Create and track security incidents in Jira',
    status: 'Connected',
    category: 'Project Management',
    lastSync: '1 day ago',
    color: 'primary'
  },
  {
    name: 'AWS CloudWatch',
    icon: Cloud,
    description: 'Monitor and analyze logs from AWS services',
    status: 'Available',
    category: 'Cloud',
    lastSync: null,
    color: 'muted'
  },
  {
    name: 'Splunk',
    icon: Database,
    description: 'Send security event data to Splunk for analysis',
    status: 'Available',
    category: 'SIEM',
    lastSync: null,
    color: 'muted'
  },
  {
    name: 'SendGrid',
    icon: Mail,
    description: 'Send email notifications for security events',
    status: 'Available',
    category: 'Email',
    lastSync: null,
    color: 'muted'
  },
];

const categories = [
  { name: 'All Integrations', count: integrations.length },
  { name: 'Communication', count: 1 },
  { name: 'Development', count: 1 },
  { name: 'Cloud', count: 1 },
  { name: 'SIEM', count: 1 },
  { name: 'Email', count: 1 },
];

const recentActivity = [
  { integration: 'Slack', action: 'Sent alert notification', timestamp: '2 hours ago', status: 'Success' },
  { integration: 'GitHub', action: 'Synced security advisories', timestamp: '5 hours ago', status: 'Success' },
  { integration: 'Jira', action: 'Created incident ticket', timestamp: '1 day ago', status: 'Success' },
  { integration: 'Slack', action: 'Sent daily summary', timestamp: '1 day ago', status: 'Success' },
];

export function Integrations() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="ml-64">
        <Navbar />
        <main className="pt-20 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold mb-2">Integrations</h1>
              <p className="text-muted-foreground">
                Connect with your favorite tools and services
              </p>
            </div>
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              Browse Marketplace
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Puzzle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Integrations</p>
                  <h3 className="text-2xl font-semibold">{integrations.length}</h3>
                  <p className="text-xs text-muted-foreground mt-1">6 available</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Connected</p>
                  <h3 className="text-2xl font-semibold">3</h3>
                  <p className="text-xs text-success mt-1">All active</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-warning/20 flex items-center justify-center">
                  <Settings className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Setup</p>
                  <h3 className="text-2xl font-semibold">3</h3>
                  <p className="text-xs text-muted-foreground mt-1">Ready to connect</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category, index) => (
                    <button
                      key={index}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        index === 0 ? 'bg-primary/20 text-primary' : 'hover:bg-input-background/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{category.name}</span>
                        <span className="text-xs bg-background/50 px-2 py-1 rounded">{category.count}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Available Integrations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {integrations.map((integration, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-input-background/30 hover:bg-input-background/50 transition-colors border border-border"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-lg bg-${integration.color}/20 flex items-center justify-center flex-shrink-0`}>
                          <integration.icon className={`w-6 h-6 text-${integration.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium mb-1">{integration.name}</h4>
                              <p className="text-xs text-muted-foreground mb-2">{integration.category}</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded ${
                              integration.status === 'Connected'
                                ? 'bg-success/20 text-success'
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              {integration.status}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {integration.description}
                          </p>
                          <div className="flex items-center justify-between">
                            {integration.lastSync && (
                              <span className="text-xs text-muted-foreground">
                                Last sync: {integration.lastSync}
                              </span>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="ml-auto"
                            >
                              {integration.status === 'Connected' ? (
                                <>
                                  <Settings className="w-3 h-3 mr-2" />
                                  Configure
                                </>
                              ) : (
                                'Connect'
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-input-background/30 hover:bg-input-background/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <div>
                        <p className="font-medium">{activity.integration}</p>
                        <p className="text-sm text-muted-foreground">{activity.action}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
                      <span className="text-xs px-2 py-1 rounded bg-success/20 text-success">
                        {activity.status}
                      </span>
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
