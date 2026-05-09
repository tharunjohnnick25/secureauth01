import { Link, useLocation } from 'react-router';
import {
  LayoutDashboard,
  Shield,
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
import { useState } from 'react';

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

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Devices', href: '/devices', icon: Smartphone },
  { name: 'Security', href: '/security', icon: Shield },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Admin Panel', href: '/admin', icon: Users },
];

export function Sidebar() {
  const location = useLocation();
  const [expandedView, setExpandedView] = useState(false);

  return (
    <aside className="fixed left-0 top-0 h-full w-64 glass-sidebar z-40 overflow-y-auto">
      <div className="flex flex-col h-full p-4">
        <div className="mb-6 px-2">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold">SecureAuth</h2>
              <p className="text-xs text-muted-foreground">Risk-Based MFA</p>
            </div>
          </Link>
        </div>

        <div className="mb-4 px-2">
          <button
            onClick={() => setExpandedView(!expandedView)}
            className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors text-left"
          >
            {expandedView ? '← Compact View' : '→ Expanded View (50 pages)'}
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          {expandedView ? (
            <div className="space-y-4">
              {navigationSections.map((section) => (
                <div key={section.title}>
                  <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {section.title}
                  </h3>
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const isActive = location.pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm',
                            isActive
                              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                              : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
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
          ) : (
            navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })
          )}
        </nav>

        <div className="mt-auto pt-4 border-t border-border">
          <Link to="/profile" className="flex items-center gap-3 px-3 py-2 hover:bg-sidebar-accent rounded-lg transition-colors">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-sm font-semibold">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">John Doe</p>
              <p className="text-xs text-muted-foreground truncate">admin@secureauth.io</p>
            </div>
          </Link>
        </div>
      </div>
    </aside>
  );
}
