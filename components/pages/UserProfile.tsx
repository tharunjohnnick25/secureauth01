import { Card, CardHeader, CardTitle, CardContent } from '@/components/components/Card';
import { Sidebar } from '@/components/components/Sidebar';
import { Navbar } from '@/components/components/Navbar';
import { Button } from '@/components/components/Button';
import { User, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react';

export function UserProfile() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="ml-64">
        <Navbar />
        <main className="pt-20 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold mb-2">User Profile</h1>
            <p className="text-muted-foreground">Manage your personal information</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardContent className="flex flex-col items-center text-center pt-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-3xl font-semibold mb-4">
                  JD
                </div>
                <h2 className="text-2xl font-semibold mb-1">John Doe</h2>
                <p className="text-muted-foreground mb-4">Administrator</p>
                <div className="flex gap-2">
                  <Button size="sm">Edit Profile</Button>
                  <Button size="sm" variant="outline">Settings</Button>
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">john.doe@example.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">New York, United States</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Created</span>
                    <span className="font-medium">January 15, 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Login</span>
                    <span className="font-medium">2 minutes ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Status</span>
                    <span className="px-2 py-1 rounded-full bg-success/20 text-success text-xs">
                      Active
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Security Level</span>
                    <span className="px-2 py-1 rounded-full bg-success/20 text-success text-xs">
                      High
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
