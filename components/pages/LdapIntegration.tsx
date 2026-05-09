import { Card, CardHeader, CardTitle, CardContent } from '@/components/components/Card';
import { Sidebar } from '@/components/components/Sidebar';
import { Navbar } from '@/components/components/Navbar';
import { Button } from '@/components/components/Button';
import { Database, CheckCircle, Settings, RefreshCw } from 'lucide-react';

const ldapConfig = [
  { setting: 'LDAP Server', value: 'ldap://dc.example.com:389', status: 'Connected' },
  { setting: 'Base DN', value: 'DC=example,DC=com', status: 'Valid' },
  { setting: 'Bind DN', value: 'CN=admin,DC=example,DC=com', status: 'Valid' },
  { setting: 'User Filter', value: '(&(objectClass=user)(sAMAccountName={{username}}))', status: 'Valid' },
];

export function LdapIntegration() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="ml-64">
        <Navbar />
        <main className="pt-20 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold mb-2">LDAP Integration</h1>
              <p className="text-muted-foreground">Configure LDAP/Active Directory integration</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Test Connection
              </Button>
              <Button>
                <Settings className="w-4 h-4 mr-2" />
                Save Configuration
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                LDAP Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ldapConfig.map((config, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-input-background/30">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{config.setting}</h4>
                      <span className="text-xs px-2 py-1 rounded bg-success/20 text-success flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {config.status}
                      </span>
                    </div>
                    <code className="text-sm text-muted-foreground font-mono">{config.value}</code>
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
