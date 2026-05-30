'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/Button';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Clock,
  XCircle,
} from 'lucide-react';

const securityAlerts = [
  {
    id: 1,
    type: 'critical',
    title: 'Unusual login location detected',
    description: 'Login attempt from Mumbai, India - 8,487 miles from usual location',
    time: '5 minutes ago',
    status: 'active',
  },
  {
    id: 2,
    type: 'warning',
    title: 'Multiple failed login attempts',
    description: '5 failed attempts in the last 10 minutes from IP 192.168.1.1',
    time: '1 hour ago',
    status: 'active',
  },
  {
    id: 3,
    type: 'info',
    title: 'New device authorized',
    description: 'iPad Air added to trusted devices list',
    time: '3 hours ago',
    status: 'resolved',
  },
  {
    id: 4,
    type: 'warning',
    title: 'Typing pattern anomaly',
    description: 'User bob.wilson showing unusual typing speed variation',
    time: '5 hours ago',
    status: 'active',
  },
];

const locationActivity = [
  { country: 'India', city: 'Bangalore', logins: 245, risk: 'low' },
  { country: 'United Kingdom', city: 'London', logins: 89, risk: 'low' },
  { country: 'United States', city: 'New York', logins: 34, risk: 'medium' },
  { country: 'India', city: 'Chennai', logins: 1, risk: 'high' },
];

export function Security() {
  return (
    <div className="min-h-screen bg-[#020617]">
      <Sidebar />
      <div className="lg:ml-64 transition-all duration-300">
        <Navbar />
        <main className="pt-24 p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold mb-2">Security Center</h1>
            <p className="text-muted-foreground">
              Monitor and respond to security events in real-time
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-destructive/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Alerts</p>
                  <h3 className="text-2xl font-semibold">
                    {securityAlerts.filter((a) => a.status === 'active').length}
                  </h3>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Resolved Today</p>
                  <h3 className="text-2xl font-semibold">12</h3>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Security Score</p>
                  <h3 className="text-2xl font-semibold">94/100</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-4 rounded-lg bg-input-background/30 hover:bg-input-background/50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            alert.type === 'critical'
                              ? 'bg-destructive/20'
                              : alert.type === 'warning'
                              ? 'bg-warning/20'
                              : 'bg-success/20'
                          }`}
                        >
                          {alert.type === 'critical' ? (
                            <XCircle className="w-5 h-5 text-destructive" />
                          ) : alert.type === 'warning' ? (
                            <AlertTriangle className="w-5 h-5 text-warning" />
                          ) : (
                            <CheckCircle className="w-5 h-5 text-success" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{alert.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {alert.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {alert.time}
                            </span>
                            {alert.status === 'active' && (
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  Investigate
                                </Button>
                                <Button size="sm" variant="ghost">
                                  Dismiss
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {locationActivity.map((location, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-input-background/30 hover:bg-input-background/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <h4 className="font-medium">
                            {location.city}, {location.country}
                          </h4>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            location.risk === 'high'
                              ? 'bg-destructive/20 text-destructive'
                              : location.risk === 'medium'
                              ? 'bg-warning/20 text-warning'
                              : 'bg-success/20 text-success'
                          }`}
                        >
                          {location.risk}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {location.logins} logins
                        </span>
                        <div className="w-32 bg-muted rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              location.risk === 'high'
                                ? 'bg-destructive'
                                : location.risk === 'medium'
                                ? 'bg-warning'
                                : 'bg-success'
                            }`}
                            style={{ width: `${Math.min((location.logins / 250) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
