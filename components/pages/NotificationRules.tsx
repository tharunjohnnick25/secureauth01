import { Card, CardHeader, CardTitle, CardContent } from '@/components/components/Card';
import { Sidebar } from '@/components/components/Sidebar';
import { Navbar } from '@/components/components/Navbar';
import { Button } from '@/components/components/Button';
import { Bell, Plus, Settings } from 'lucide-react';

const rules = [
  { name: 'Critical Security Events', channels: ['Email', 'SMS', 'Slack'], status: 'Active', priority: 'High' },
  { name: 'Failed Login Attempts', channels: ['Email'], status: 'Active', priority: 'Medium' },
  { name: 'System Updates', channels: ['Email'], status: 'Active', priority: 'Low' },
  { name: 'Compliance Violations', channels: ['Email', 'Slack'], status: 'Active', priority: 'High' },
];

export function NotificationRules() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="ml-64">
        <Navbar />
        <main className="pt-20 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold mb-2">Notification Rules</h1>
              <p className="text-muted-foreground">Configure notification routing and delivery</p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Rule
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {rules.map((rule, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-input-background/30">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{rule.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          rule.priority === 'High' ? 'bg-destructive/20 text-destructive' :
                          rule.priority === 'Medium' ? 'bg-warning/20 text-warning' :
                          'bg-primary/20 text-primary'
                        }`}>
                          {rule.priority}
                        </span>
                        <Button variant="outline" size="sm"><Settings className="w-4 h-4" /></Button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {rule.channels.map((channel, i) => (
                        <span key={i} className="text-xs px-2 py-1 rounded bg-primary/10">{channel}</span>
                      ))}
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
