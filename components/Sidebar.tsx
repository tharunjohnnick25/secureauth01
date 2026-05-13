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
} from 'lucide-react';
import { cn } from '../lib/utils';

const navigationSections = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Analytics', href: '/analytics', icon: BarChart3 },
      { name: 'Notifications', href: '/notifications', icon: Bell },
    ],
  },
  {
    title: 'Security',
    items: [
      { name: 'AI Risk Monitoring', href: '/dashboard/risk', icon: ShieldAlert },
      { name: 'Security Center', href: '/security', icon: Shield },
      { name: 'Threat Intelligence', href: '/threat-intelligence', icon: Target },
      { name: 'Vulnerability Scanner', href: '/vulnerability-scanner', icon: Bug },
      { name: 'Compliance Reports', href: '/compliance-reports', icon: FileCheck },
      { name: 'Risk Assessment', href: '/risk-assessment', icon: AlertTriangle },
      { name: 'Incident Response', href: '/incident-response', icon: Activity },
      { name: 'Forensics', href: '/forensics', icon: FileText },
    ],
  },
  {
    title: 'Management',
    items: [
      { name: 'Devices', href: '/devices', icon: Smartphone },
      { name: 'Team Management', href: '/team-management', icon: Users },
      { name: 'Roles & Permissions', href: '/roles-permissions', icon: UserCog },
      { name: 'Access Control Matrix', href: '/admin/permissions', icon: Lock },
      { name: 'Session Management', href: '/session-management', icon: Activity },
      { name: 'Admin Panel', href: '/admin', icon: Users },
    ],
  },
  {
    title: 'Integration',
    items: [
      { name: 'API Keys', href: '/api-keys', icon: Key },
      { name: 'Webhooks', href: '/webhooks', icon: Webhook },
      { name: 'Integrations', href: '/integrations', icon: Plug },
      { name: 'SSO Configuration', href: '/sso-configuration', icon: Lock },
      { name: 'LDAP Integration', href: '/ldap-integration', icon: Network },
    ],
  },
  {
    title: 'Monitoring',
    items: [
      { name: 'Security Events', href: '/security-events', icon: AlertTriangle },
      { name: 'Audit Logs', href: '/audit-logs', icon: FileText },
      { name: 'Network Map', href: '/network-map', icon: Network },
      { name: 'Geolocation Map', href: '/geolocation-map', icon: Globe },
      { name: 'System Health', href: '/system-health', icon: Gauge },
      { name: 'Performance Metrics', href: '/performance-metrics', icon: TrendingUp },
    ],
  },
  {
    title: 'Reports',
    items: [
      { name: 'Reports Dashboard', href: '/reports-dashboard', icon: FileBarChart },
      { name: 'Custom Reports', href: '/custom-reports', icon: FileText },
      { name: 'Scheduled Reports', href: '/scheduled-reports', icon: FileCheck },
      { name: 'Usage Statistics', href: '/usage-statistics', icon: BarChart3 },
    ],
  },
  {
    title: 'Configuration',
    items: [
      { name: 'Settings', href: '/settings', icon: Settings },
      { name: 'MFA Settings', href: '/mfa-settings', icon: Shield },
      { name: 'Password Policies', href: '/password-policies', icon: Lock },
      { name: 'Alerts Configuration', href: '/alerts-configuration', icon: Bell },
      { name: 'Email Templates', href: '/email-templates', icon: Mail },
      { name: 'Notification Rules', href: '/notification-rules', icon: Bell },
    ],
  },
  {
    title: 'Developer',
    items: [
      { name: 'API Documentation', href: '/api-documentation', icon: FileCode },
      { name: 'Developer Portal', href: '/developer-portal', icon: FileCode },
    ],
  },
  {
    title: 'Billing',
    items: [
      { name: 'Billing', href: '/billing', icon: CreditCard },
      { name: 'Subscription Plans', href: '/subscription-plans', icon: CreditCard },
    ],
  },
  {
    title: 'Data',
    items: [
      { name: 'Export Data', href: '/export-data', icon: Download },
      { name: 'Import Data', href: '/import-data', icon: Upload },
      { name: 'Backup & Recovery', href: '/backup-recovery', icon: Database },
    ],
  },
  {
    title: 'Support',
    items: [
      { name: 'Help Center', href: '/help-center', icon: HelpCircle },
      { name: 'Support Tickets', href: '/support-tickets', icon: Ticket },
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
            <p className="text-xs text-gray-400">Risk-Based MFA</p>
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
            <p className="text-sm font-medium truncate text-white">Security Admin</p>
            <p className="text-xs text-gray-500 truncate">admin@secureauth.io</p>
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
