'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { 
  User, 
  Mail, 
  Shield, 
  Key, 
  Fingerprint, 
  Smartphone, 
  Globe, 
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useBiometrics } from '@/hooks/useBiometrics';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { useMemo } from 'react';

export function UserProfile() {
  const { user } = useAuthStore();
  const { data: dbLogins } = useRealtimeData('login_logs', (q) => 
    q.select('*').eq('user_id', user?.id || '').order('created_at', { ascending: false }).limit(5)
  );

  const displayLogins = useMemo(() => {
    if (!dbLogins || dbLogins.length === 0) return [
      { location: 'San Francisco, US', time: 'Just now', device: 'Chrome / MacOS', status: 'trusted' },
      { location: 'New York, US', time: '2 hours ago', device: 'iPhone 15', status: 'verified' },
    ];
    return dbLogins.map((l: any) => ({
      location: `${l.city || 'Unknown'}, ${l.country || 'XX'}`,
      time: 'Recently',
      device: l.user_agent.split(' ')[0] || 'Browser',
      status: l.status.toLowerCase()
    }));
  }, [dbLogins]);
  const [loading, setLoading] = useState(false);
  const { registerBiometrics } = useBiometrics();
  const supabase = createClient();

  const handleRegisterBiometrics = async () => {
    setLoading(true);
    try {
      const success = await registerBiometrics(user?.email || '');
      if (success) {
        toast.success('Biometric device registered');
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Sidebar />
      <div className="lg:ml-64 transition-all duration-300">
        <Navbar />
        <main className="pt-20 p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold mb-2">User Profile</h1>
            <p className="text-muted-foreground">Manage your identity and security settings</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <Input 
                        placeholder="John Doe" 
                        defaultValue={user?.first_name ? `${user.first_name} ${user.last_name}` : ''}
                        icon={<User className="w-4 h-4" />}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Gmail Address</label>
                      <Input 
                        placeholder="user@gmail.com" 
                        defaultValue={user?.email || ''} 
                        disabled
                        icon={<Mail className="w-4 h-4" />}
                      />
                    </div>
                  </div>
                  <Button>Update Profile</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Fingerprint className="w-5 h-5 text-primary" />
                    Biometric Authentication
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Zero-Trust Biometrics</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Register your device's biometric sensors (TouchID, FaceID, or Windows Hello) for secure passwordless verification when suspicious activity is detected.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-input-background/30 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <Fingerprint className="w-8 h-8 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Main Device Biometrics</p>
                        <p className="text-xs text-muted-foreground">Not yet registered</p>
                      </div>
                    </div>
                    <Button onClick={handleRegisterBiometrics} disabled={loading}>
                      {loading ? 'Processing...' : 'Register Device'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Domain Verification</span>
                    <span className="text-success font-medium flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      gmail.com
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Account Status</span>
                    <span className="text-primary font-medium">Active</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Security Level</span>
                    <span className="text-success font-medium">High</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Recent Login History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {displayLogins.map((login, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-input-background flex items-center justify-center shrink-0">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{login.location}</p>
                        <p className="text-[10px] text-muted-foreground">{login.time} • {login.device}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${login.status === 'success' ? 'bg-success' : 'bg-destructive'}`} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
