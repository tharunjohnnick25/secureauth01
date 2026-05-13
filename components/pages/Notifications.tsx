'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/Button';
import {
  Bell,
  Shield,
  Smartphone,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Info,
  Trash2,
} from 'lucide-react';

const notifications = [
  {
    id: 1,
    type: 'security',
    icon: Shield,
    title: 'Security Alert',
    message: 'Unusual login detected from Chennai, India',
    time: '5 minutes ago',
    read: false,
    priority: 'high',
  },
  {
    id: 2,
    type: 'device',
    icon: Smartphone,
    title: 'New Device Added',
    message: 'iPad Air has been added to your trusted devices',
    time: '1 hour ago',
    read: false,
    priority: 'medium',
  },
  {
    id: 3,
    type: 'location',
    icon: MapPin,
    title: 'New Location Detected',
    message: 'Login from London, United Kingdom',
    time: '3 hours ago',
    read: true,
    priority: 'low',
  },
  {
    id: 4,
    type: 'success',
    icon: CheckCircle,
    title: 'Password Changed',
    message: 'Your password was successfully updated',
    time: '5 hours ago',
    read: true,
    priority: 'low',
  },
  {
    id: 5,
    type: 'warning',
    icon: AlertTriangle,
    title: 'Failed Login Attempts',
    message: '3 failed login attempts detected',
    time: '1 day ago',
    read: true,
    priority: 'high',
  },
  {
    id: 6,
    type: 'info',
    icon: Info,
    title: 'System Update',
    message: 'New security features are now available',
    time: '2 days ago',
    read: true,
    priority: 'low',
  },
];

export function Notifications() {
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Sidebar />
      <div className="lg:ml-64 transition-all duration-300">
        <Navbar />
        <main className="pt-20 p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold mb-2">Notifications</h1>
              <p className="text-muted-foreground">
                Stay updated with your security alerts and activity
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Mark All as Read
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <h3 className="text-2xl font-semibold">{notifications.length}</h3>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-warning/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Unread</p>
                  <h3 className="text-2xl font-semibold">
                    {notifications.filter((n) => !n.read).length}
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
                  <p className="text-sm text-muted-foreground">High Priority</p>
                  <h3 className="text-2xl font-semibold">
                    {notifications.filter((n) => n.priority === 'high').length}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg transition-colors cursor-pointer ${
                        notification.read
                          ? 'bg-input-background/20 hover:bg-input-background/30'
                          : 'bg-input-background/50 hover:bg-input-background/60 border-l-4 border-primary'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            notification.priority === 'high'
                              ? 'bg-destructive/20'
                              : notification.priority === 'medium'
                              ? 'bg-warning/20'
                              : 'bg-primary/20'
                          }`}
                        >
                          <Icon
                            className={`w-5 h-5 ${
                              notification.priority === 'high'
                                ? 'text-destructive'
                                : notification.priority === 'medium'
                                ? 'text-warning'
                                : 'text-primary'
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-medium">{notification.title}</h4>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-primary rounded-full" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {notification.time}
                            </span>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
