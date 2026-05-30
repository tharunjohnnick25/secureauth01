'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/Button';
import {
  Smartphone,
  Monitor,
  Tablet,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Trash2,
} from 'lucide-react';

const devices = [
  {
    id: 1,
    name: 'MacBook Pro',
    type: 'desktop',
    os: 'macOS 14.2',
    browser: 'Chrome 121',
    location: 'New York, US',
    lastActive: '2 minutes ago',
    status: 'active',
    trusted: true,
  },
  {
    id: 2,
    name: 'iPhone 15 Pro',
    type: 'mobile',
    os: 'iOS 17.3',
    browser: 'Safari',
    location: 'New York, US',
    lastActive: '1 hour ago',
    status: 'active',
    trusted: true,
  },
  {
    id: 3,
    name: 'iPad Air',
    type: 'tablet',
    os: 'iPadOS 17.3',
    browser: 'Safari',
    location: 'Boston, US',
    lastActive: '3 hours ago',
    status: 'idle',
    trusted: true,
  },
  {
    id: 4,
    name: 'Windows PC',
    type: 'desktop',
    os: 'Windows 11',
    browser: 'Edge 121',
    location: 'Unknown Location',
    lastActive: '2 days ago',
    status: 'suspicious',
    trusted: false,
  },
];

export function Devices() {
  const DeviceIcon = ({ type }: { type: string }) => {
    switch (type) {
      case 'mobile':
        return <Smartphone className="w-6 h-6" />;
      case 'tablet':
        return <Tablet className="w-6 h-6" />;
      default:
        return <Monitor className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Sidebar />
      <div className="lg:ml-64 transition-all duration-300">
        <Navbar />
        <main className="pt-24 p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold mb-2">Device Management</h1>
            <p className="text-muted-foreground">
              Monitor and manage all devices accessing your account
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Devices</p>
                  <h3 className="text-2xl font-semibold">{devices.length}</h3>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Trusted Devices</p>
                  <h3 className="text-2xl font-semibold">
                    {devices.filter((d) => d.trusted).length}
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
                  <p className="text-sm text-muted-foreground">Suspicious</p>
                  <h3 className="text-2xl font-semibold">
                    {devices.filter((d) => d.status === 'suspicious').length}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>All Devices</CardTitle>
              <Button size="sm">Add Device</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {devices.map((device) => (
                  <div
                    key={device.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-input-background/30 hover:bg-input-background/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          device.status === 'suspicious'
                            ? 'bg-destructive/20 text-destructive'
                            : 'bg-primary/20 text-primary'
                        }`}
                      >
                        <DeviceIcon type={device.type} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{device.name}</h4>
                          {device.trusted && (
                            <span className="px-2 py-0.5 rounded-full bg-success/20 text-success text-xs">
                              Trusted
                            </span>
                          )}
                          {device.status === 'suspicious' && (
                            <span className="px-2 py-0.5 rounded-full bg-destructive/20 text-destructive text-xs">
                              Suspicious
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {device.os} • {device.browser}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {device.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {device.lastActive}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!device.trusted && (
                        <Button variant="outline" size="sm">
                          Trust Device
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
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
