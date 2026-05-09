import { Card, CardHeader, CardTitle, CardContent } from '@/components/components/Card';
import { Sidebar } from '@/components/components/Sidebar';
import { Navbar } from '@/components/components/Navbar';
import { Button } from '@/components/components/Button';
import {
  Shield,
  Smartphone,
  Key,
  Mail,
  CheckCircle,
  XCircle,
  Users,
  TrendingUp,
  QrCode,
} from 'lucide-react';

const mfaMethods = [
  { name: 'Authenticator App', icon: Smartphone, enabled: true, users: 187, description: 'TOTP-based authentication using apps like Google Authenticator', recommended: true },
  { name: 'SMS Verification', icon: Mail, enabled: true, users: 89, description: 'One-time codes sent via SMS', recommended: false },
  { name: 'Email Verification', icon: Mail, enabled: true, users: 45, description: 'Verification codes sent to email', recommended: false },
  { name: 'Hardware Token', icon: Key, enabled: true, users: 23, description: 'Physical security keys (YubiKey, etc.)', recommended: true },
  { name: 'Biometric', icon: Shield, enabled: false, users: 0, description: 'Fingerprint or facial recognition', recommended: true },
];

const mfaStats = [
  { label: 'Total Enrolled', value: '87%', icon: Shield, color: 'success', trend: '+12%' },
  { label: 'Authenticator App', value: '187', icon: Smartphone, color: 'primary', trend: '+23' },
  { label: 'Hardware Tokens', value: '23', icon: Key, color: 'warning', trend: '+5' },
  { label: 'Not Enrolled', value: '30', icon: XCircle, color: 'destructive', trend: '-15' },
];

const enrollmentStatus = [
  { user: 'sarah.chen@company.com', method: 'Authenticator App', status: 'Active', enrolled: '2026-01-15', lastUsed: '2 hours ago' },
  { user: 'michael.r@company.com', method: 'Hardware Token', status: 'Active', enrolled: '2026-02-20', lastUsed: '1 day ago' },
  { user: 'emily.t@company.com', method: 'Authenticator App', status: 'Active', enrolled: '2026-03-10', lastUsed: '5 hours ago' },
  { user: 'david.kim@company.com', method: 'SMS', status: 'Active', enrolled: '2026-04-01', lastUsed: '30 min ago' },
  { user: 'lisa.a@company.com', method: 'Not Enrolled', status: 'Inactive', enrolled: 'N/A', lastUsed: 'N/A' },
];

const policySettings = [
  { name: 'Require MFA for All Users', enabled: true, description: 'Enforce MFA enrollment for all user accounts' },
  { name: 'Remember Device', enabled: true, description: 'Allow trusted devices to skip MFA for 30 days' },
  { name: 'Backup Codes', enabled: true, description: 'Generate backup codes for account recovery' },
  { name: 'Admin Override', enabled: false, description: 'Allow admins to bypass MFA in emergencies' },
];

export function MfaSettings() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="ml-64">
        <Navbar />
        <main className="pt-20 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold mb-2">Multi-Factor Authentication</h1>
              <p className="text-muted-foreground">
                Configure and manage MFA methods for enhanced security
              </p>
            </div>
            <Button>
              <Shield className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {mfaStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg bg-${stat.color}/20 flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <h3 className="text-2xl font-semibold">{stat.value}</h3>
                    <p className="text-xs text-success flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" />
                      {stat.trend}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  Available MFA Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mfaMethods.map((method, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-input-background/30 hover:bg-input-background/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <method.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{method.name}</h4>
                              {method.recommended && (
                                <span className="text-xs px-2 py-0.5 rounded bg-success/20 text-success">
                                  Recommended
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Users className="w-3 h-3" />
                              <span>{method.users} users enrolled</span>
                            </div>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked={method.enabled}
                          />
                          <div className="w-11 h-6 bg-input-background rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>MFA Policy Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {policySettings.map((policy, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-input-background/30"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm flex-1">{policy.name}</h4>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked={policy.enabled}
                          />
                          <div className="w-9 h-5 bg-input-background rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                        </label>
                      </div>
                      <p className="text-xs text-muted-foreground">{policy.description}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 rounded-lg bg-warning/10 border border-warning/20">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Security Notice
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    MFA significantly reduces the risk of unauthorized access. We recommend requiring MFA for all users.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>User Enrollment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-medium">User</th>
                      <th className="text-left p-3 font-medium">Method</th>
                      <th className="text-left p-3 font-medium">Status</th>
                      <th className="text-left p-3 font-medium">Enrolled</th>
                      <th className="text-left p-3 font-medium">Last Used</th>
                      <th className="text-right p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollmentStatus.map((enrollment, index) => (
                      <tr key={index} className="border-b border-border hover:bg-input-background/30">
                        <td className="p-3 text-sm">{enrollment.user}</td>
                        <td className="p-3 text-sm">{enrollment.method}</td>
                        <td className="p-3">
                          <span className={`text-xs px-2 py-1 rounded ${
                            enrollment.status === 'Active' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                          }`}>
                            {enrollment.status}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">{enrollment.enrolled}</td>
                        <td className="p-3 text-sm text-muted-foreground">{enrollment.lastUsed}</td>
                        <td className="p-3 text-right">
                          <Button variant="outline" size="sm">
                            {enrollment.status === 'Active' ? 'Reset' : 'Enroll'}
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
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                Enrollment Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Authenticator App Setup</h4>
                  <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                    <li>Download an authenticator app (Google Authenticator, Authy, etc.)</li>
                    <li>Click "Enable MFA" in your account settings</li>
                    <li>Scan the QR code with your authenticator app</li>
                    <li>Enter the 6-digit code to verify setup</li>
                    <li>Save your backup codes in a secure location</li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Hardware Token Setup</h4>
                  <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                    <li>Request a hardware security key from IT</li>
                    <li>Navigate to MFA settings in your account</li>
                    <li>Select "Add Hardware Token"</li>
                    <li>Insert your security key when prompted</li>
                    <li>Complete the registration process</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
