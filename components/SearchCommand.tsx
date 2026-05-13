'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  LayoutDashboard, 
  Shield, 
  Smartphone, 
  BarChart3, 
  Settings, 
  Users, 
  Bell, 
  Target, 
  Activity, 
  Lock,
  Globe,
  FileText,
  Key,
  User,
  AlertTriangle
} from 'lucide-react';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';

const STATIC_PAGES = [
  { group: 'Overview', items: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Notifications', href: '/notifications', icon: Bell },
  ]},
  { group: 'Security', items: [
    { name: 'Security Center', href: '/security', icon: Shield },
    { name: 'Risk Score', href: '/security/risk-score', icon: Target },
    { name: 'Zero Trust Configuration', href: '/security/zero-trust', icon: Lock },
    { name: 'Device Fingerprinting', href: '/security/fingerprinting', icon: Smartphone },
    { name: 'Threat Intelligence', href: '/threat-intelligence', icon: Activity },
  ]},
  { group: 'Management', items: [
    { name: 'Users & Roles', href: '/admin/users', icon: Users },
    { name: 'Access Control Matrix', href: '/admin/permissions', icon: Lock },
    { name: 'Audit Logs', href: '/admin/audit', icon: FileText },
    { name: 'Geographic Map', href: '/admin/geo-map', icon: Globe },
  ]},
  { group: 'Integration', items: [
    { name: 'API Keys', href: '/api-keys', icon: Key },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]}
];

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [dynamicResults, setDynamicResults] = React.useState<{users: any[], alerts: any[], devices: any[]}>({
    users: [],
    alerts: [],
    devices: []
  });
  const router = useRouter();
  const supabase = createClient();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  React.useEffect(() => {
    if (search.length < 2) {
      setDynamicResults({ users: [], alerts: [], devices: [] });
      return;
    }

    const performSearch = async () => {
      const [uRes, aRes, dRes] = await Promise.all([
        supabase.from('users').select('id, full_name, email').ilike('full_name', `%${search}%`).limit(3),
        supabase.from('alerts').select('id, message, type').ilike('message', `%${search}%`).limit(3),
        supabase.from('devices').select('id, device_name, browser').ilike('device_name', `%${search}%`).limit(3)
      ]);

      setDynamicResults({
        users: uRes.data || [],
        alerts: aRes.data || [],
        devices: dRes.data || []
      });
    };

    const timer = setTimeout(performSearch, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSelect = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      <div 
        onClick={() => setOpen(true)}
        className="relative group cursor-pointer w-full max-w-md"
      >
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors">
          <Search className="w-4 h-4" />
        </div>
        <div className="w-full rounded-lg bg-input-background/50 border border-border px-10 py-2.5 text-sm text-muted-foreground group-hover:border-primary/50 transition-all">
          Search entities, users, security...
        </div>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-border bg-muted/50 text-[10px] font-medium text-muted-foreground">
          ⌘K
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-[#0f0f23] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden"
            >
              <Command className="flex flex-col h-full">
                <div className="flex items-center border-b border-gray-200 dark:border-white/10 p-4 bg-gray-50 dark:bg-[#1a1a2e]">
                  <Search className="w-5 h-5 text-gray-400 mr-3" />
                  <Command.Input
                    autoFocus
                    placeholder="Search users, alerts, pages..."
                    value={search}
                    onValueChange={setSearch}
                    className="flex-1 bg-transparent border-none outline-none text-lg text-gray-800 dark:text-gray-100 placeholder:text-gray-400"
                  />
                </div>

                <Command.List className="max-h-[60vh] overflow-y-auto p-2 scroll-py-2 bg-white dark:bg-[#1a1a2e] rounded-b-xl">
                  <Command.Empty className="p-4 text-center text-sm text-gray-600 dark:text-gray-400">
                    No results found for &quot;{search}&quot;
                  </Command.Empty>

                  {/* Dynamic Results */}
                  {dynamicResults.users.length > 0 && (
                    <Command.Group heading="Users Found" className="px-2 py-2 text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold">
                       {dynamicResults.users.map(u => (
                         <Command.Item key={u.id} onSelect={() => handleSelect(`/admin/users?id=${u.id}`)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-white/5 cursor-pointer">
                            <User className="w-4 h-4 text-blue-500" />
                            <span>{u.full_name}</span>
                            <span className="text-xs text-gray-400 ml-auto">{u.email}</span>
                         </Command.Item>
                       ))}
                    </Command.Group>
                  )}

                  {dynamicResults.alerts.length > 0 && (
                    <Command.Group heading="Security Alerts" className="px-2 py-2 text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold">
                       {dynamicResults.alerts.map(a => (
                         <Command.Item key={a.id} onSelect={() => handleSelect(`/security/alerts?id=${a.id}`)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-800 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <span className="truncate">{a.message}</span>
                         </Command.Item>
                       ))}
                    </Command.Group>
                  )}

                  {STATIC_PAGES.map((group) => (
                    <Command.Group 
                      key={group.group} 
                      heading={group.group}
                      className="px-2 py-2 text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold mt-2"
                    >
                      {group.items.map((item) => (
                        <Command.Item
                          key={item.href}
                          onSelect={() => handleSelect(item.href)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-white/5 cursor-pointer transition-all aria-selected:bg-blue-100 dark:aria-selected:bg-blue-500/10 aria-selected:text-blue-600 dark:aria-selected:text-blue-400 group"
                        >
                          <item.icon className="w-4 h-4 text-gray-400 group-aria-selected:text-blue-500" />
                          <span>{item.name}</span>
                        </Command.Item>
                      ))}
                    </Command.Group>
                  ))}
                </Command.List>

                <div className="flex items-center justify-between border-t border-gray-200 dark:border-white/10 p-4 bg-gray-50 dark:bg-[#1a1a2e] text-[10px] text-gray-500 dark:text-gray-400">
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1"><span className="px-1 rounded border border-gray-300 dark:border-white/20 bg-white dark:bg-black/30">↑↓</span> Move</span>
                    <span className="flex items-center gap-1"><span className="px-1 rounded border border-gray-300 dark:border-white/20 bg-white dark:bg-black/30">Enter</span> Select</span>
                  </div>
                  <div className="font-mono">SecureAuth AI</div>
                </div>
              </Command>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
