'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Shield,
  ShieldAlert,
  Smartphone,
  BarChart3,
  Settings,
  Users,
  Bell,
  Target,
  Bug,
  FileCheck,
  Key,
  Webhook,
  Plug,
  UserCog,
  FileText,
  AlertTriangle,
  Activity,
  Network,
  Globe,
  Database,
  Gauge,
  Mail,
  Lock,
  FileCode,
  CreditCard,
  TrendingUp,
  Download,
  Upload,
  FileBarChart,
  HelpCircle,
  Ticket,
  Clock,
  Building2,
  MapPin,
} from 'lucide-react';
import { cn } from '../lib/utils';

const navigationSections = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Attendance & Login', href: '/attendance', icon: Clock },
      { name: 'Notifications', href: '/notifications', icon: Bell },
    ],
  },
  {
    title: 'Employee Access',
    items: [
      { name: 'Employee Directory', href: '/employees', icon: Users },
      { name: 'Access Requests', href: '/access-requests', icon: FileCheck },
      { name: 'Departments', href: '/departments', icon: Building2 },
      { name: 'Roles & Permissions', href: '/roles-permissions', icon: UserCog },
    ],
  },
  {
    title: 'Office Security',
    items: [
      { name: 'Office Logins', href: '/office-logins', icon: MapPin },
      { name: 'AI Risk Monitoring', href: '/dashboard/risk', icon: ShieldAlert },
      { name: 'Device Fingerprinting', href: '/devices', icon: Smartphone },
      { name: 'Security Center', href: '/security', icon: Shield },
      { name: 'Threat Intelligence', href: '/threat-intelligence', icon: Target },
    ],
  },
  {
    title: 'System Management',
    items: [
      { name: 'Audit Logs', href: '/audit-logs', icon: FileText },
      { name: 'Analytics', href: '/analytics', icon: BarChart3 },
      { name: 'Subscription Plans', href: '/pricing', icon: CreditCard },
      { name: 'API Integrations', href: '/integrations', icon: Plug },
      { name: 'Settings', href: '/settings', icon: Settings },
    ],
  },
];


import { motion } from 'framer-motion';

export function SidebarContent() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full p-4">
      <div className="mb-6 px-2">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-white">SecureAuth</h2>
            <p className="text-xs text-gray-400">Employee Access</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
        <div className="space-y-4">
          {navigationSections.map((section) => (
            <div key={section.title}>
              <h3 className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm',
                        isActive
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      <div className="mt-auto pt-4 border-t border-white/10">
        <Link href="/profile" className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg transition-colors">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-sm font-semibold text-white">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-white">System Admin</p>
            <p className="text-xs text-gray-500 truncate">admin@mail.com</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <motion.aside 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed left-0 top-0 h-full w-64 glass-sidebar z-40 hidden lg:block border-r border-white/10"
    >
      <SidebarContent />
    </motion.aside>
  );
}
