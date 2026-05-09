import { Card, CardHeader, CardTitle, CardContent } from '@/components/components/Card';
import { Sidebar } from '@/components/components/Sidebar';
import { Navbar } from '@/components/components/Navbar';
import { Button } from '@/components/components/Button';
import { Input } from '@/components/components/Input';
import { Shield, Bell, Lock, User } from 'lucide-react';

export function Settings() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="ml-64">
        <Navbar />
        <main className="pt-20 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account and security preferences
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle>Profile Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm">Full Name</label>
                    <Input defaultValue="John Doe" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm">Email Address</label>
                    <Input defaultValue="john.doe@example.com" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm">Phone Number</label>
                    <Input defaultValue="+1 (555) 123-4567" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm">Role</label>
                    <Input defaultValue="Administrator" disabled />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-success" />
                  </div>
                  <CardTitle>Security Settings</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-input-background/30">
                    <div>
                      <h4 className="font-medium mb-1">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-success">Enabled</span>
                      <div className="w-10 h-6 bg-success rounded-full flex items-center px-1">
                        <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-input-background/30">
                    <div>
                      <h4 className="font-medium mb-1">Biometric Authentication</h4>
                      <p className="text-sm text-muted-foreground">
                        Use fingerprint or face recognition
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Disabled</span>
                      <div className="w-10 h-6 bg-muted rounded-full flex items-center px-1">
                        <div className="w-4 h-4 bg-white rounded-full" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-input-background/30">
                    <div>
                      <h4 className="font-medium mb-1">Risk-Based Authentication</h4>
                      <p className="text-sm text-muted-foreground">
                        Automatically adjust security based on login context
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-success">Enabled</span>
                      <div className="w-10 h-6 bg-success rounded-full flex items-center px-1">
                        <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-warning" />
                  </div>
                  <CardTitle>Notification Preferences</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-input-background/30">
                    <div>
                      <h4 className="font-medium mb-1">Security Alerts</h4>
                      <p className="text-sm text-muted-foreground">
                        Get notified about suspicious activity
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-success">Enabled</span>
                      <div className="w-10 h-6 bg-success rounded-full flex items-center px-1">
                        <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-input-background/30">
                    <div>
                      <h4 className="font-medium mb-1">New Device Login</h4>
                      <p className="text-sm text-muted-foreground">
                        Alert when a new device accesses your account
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-success">Enabled</span>
                      <div className="w-10 h-6 bg-success rounded-full flex items-center px-1">
                        <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-destructive" />
                  </div>
                  <CardTitle>Change Password</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm">Current Password</label>
                    <Input type="password" placeholder="Enter current password" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm">New Password</label>
                    <Input type="password" placeholder="Enter new password" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm">Confirm New Password</label>
                    <Input type="password" placeholder="Confirm new password" />
                  </div>
                  <div className="flex justify-end">
                    <Button>Update Password</Button>
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
