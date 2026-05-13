'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/Button';
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Users,
} from 'lucide-react';

const roles = [
  { id: '1', name: 'Security Administrator', users: 3, description: 'Full access to security features and configurations', editable: true },
  { id: '2', name: 'Compliance Officer', users: 2, description: 'Manage compliance reports and audit logs', editable: true },
  { id: '3', name: 'Incident Responder', users: 5, description: 'Handle security incidents and threat analysis', editable: true },
  { id: '4', name: 'Read-Only Analyst', users: 8, description: 'View-only access to all security data', editable: true },
  { id: '5', name: 'Super Admin', users: 1, description: 'Complete system access (built-in)', editable: false },
];

const permissions = [
  {
    category: 'Dashboard & Analytics',
    items: [
      { name: 'View Dashboard', securityAdmin: true, complianceOfficer: true, incidentResponder: true, readOnlyAnalyst: true },
      { name: 'View Analytics', securityAdmin: true, complianceOfficer: true, incidentResponder: true, readOnlyAnalyst: true },
      { name: 'Export Reports', securityAdmin: true, complianceOfficer: true, incidentResponder: false, readOnlyAnalyst: false },
    ]
  },
  {
    category: 'Security Management',
    items: [
      { name: 'Manage Security Policies', securityAdmin: true, complianceOfficer: false, incidentResponder: false, readOnlyAnalyst: false },
      { name: 'Configure Alerts', securityAdmin: true, complianceOfficer: false, incidentResponder: true, readOnlyAnalyst: false },
      { name: 'View Threat Intelligence', securityAdmin: true, complianceOfficer: true, incidentResponder: true, readOnlyAnalyst: true },
      { name: 'Run Vulnerability Scans', securityAdmin: true, complianceOfficer: false, incidentResponder: true, readOnlyAnalyst: false },
    ]
  },
  {
    category: 'Incident Response',
    items: [
      { name: 'View Incidents', securityAdmin: true, complianceOfficer: true, incidentResponder: true, readOnlyAnalyst: true },
      { name: 'Create Incidents', securityAdmin: true, complianceOfficer: false, incidentResponder: true, readOnlyAnalyst: false },
      { name: 'Resolve Incidents', securityAdmin: true, complianceOfficer: false, incidentResponder: true, readOnlyAnalyst: false },
    ]
  },
  {
    category: 'User & Team Management',
    items: [
      { name: 'View Team Members', securityAdmin: true, complianceOfficer: true, incidentResponder: false, readOnlyAnalyst: false },
      { name: 'Manage Team Members', securityAdmin: true, complianceOfficer: false, incidentResponder: false, readOnlyAnalyst: false },
      { name: 'Assign Roles', securityAdmin: true, complianceOfficer: false, incidentResponder: false, readOnlyAnalyst: false },
    ]
  },
  {
    category: 'Compliance & Audit',
    items: [
      { name: 'View Audit Logs', securityAdmin: true, complianceOfficer: true, incidentResponder: false, readOnlyAnalyst: true },
      { name: 'Generate Compliance Reports', securityAdmin: true, complianceOfficer: true, incidentResponder: false, readOnlyAnalyst: false },
      { name: 'Configure Compliance Rules', securityAdmin: true, complianceOfficer: true, incidentResponder: false, readOnlyAnalyst: false },
    ]
  },
];

export function RolesPermissions() {
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Sidebar />
      <div className="lg:ml-64 transition-all duration-300">
        <Navbar />
        <main className="pt-20 p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold mb-2">Roles & Permissions</h1>
              <p className="text-muted-foreground">
                Configure role-based access control for your team
              </p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Role
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Roles</p>
                  <h3 className="text-2xl font-semibold">{roles.length}</h3>
                  <p className="text-xs text-muted-foreground mt-1">4 custom roles</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Assigned Users</p>
                  <h3 className="text-2xl font-semibold">19</h3>
                  <p className="text-xs text-success mt-1">All roles active</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-warning/20 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Permissions</p>
                  <h3 className="text-2xl font-semibold">23</h3>
                  <p className="text-xs text-muted-foreground mt-1">Across 5 categories</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Configured Roles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-input-background/30 hover:bg-input-background/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-medium">{role.name}</h4>
                          {!role.editable && (
                            <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                              Built-in
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{role.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{role.users} users</p>
                        <p className="text-xs text-muted-foreground">assigned</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled={!role.editable}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" disabled={!role.editable}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Permission Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-medium">Permission</th>
                      <th className="text-center p-3 font-medium">Security Admin</th>
                      <th className="text-center p-3 font-medium">Compliance Officer</th>
                      <th className="text-center p-3 font-medium">Incident Responder</th>
                      <th className="text-center p-3 font-medium">Read-Only</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map((category, categoryIndex) => (
                      <>
                        <tr key={`category-${categoryIndex}`} className="bg-input-background/30">
                          <td colSpan={5} className="p-3 font-semibold text-sm">
                            {category.category}
                          </td>
                        </tr>
                        {category.items.map((permission, permIndex) => (
                          <tr key={`perm-${categoryIndex}-${permIndex}`} className="border-b border-border hover:bg-input-background/20">
                            <td className="p-3 text-sm">{permission.name}</td>
                            <td className="p-3 text-center">
                              {permission.securityAdmin ? (
                                <CheckCircle className="w-5 h-5 text-success mx-auto" />
                              ) : (
                                <XCircle className="w-5 h-5 text-muted-foreground mx-auto" />
                              )}
                            </td>
                            <td className="p-3 text-center">
                              {permission.complianceOfficer ? (
                                <CheckCircle className="w-5 h-5 text-success mx-auto" />
                              ) : (
                                <XCircle className="w-5 h-5 text-muted-foreground mx-auto" />
                              )}
                            </td>
                            <td className="p-3 text-center">
                              {permission.incidentResponder ? (
                                <CheckCircle className="w-5 h-5 text-success mx-auto" />
                              ) : (
                                <XCircle className="w-5 h-5 text-muted-foreground mx-auto" />
                              )}
                            </td>
                            <td className="p-3 text-center">
                              {permission.readOnlyAnalyst ? (
                                <CheckCircle className="w-5 h-5 text-success mx-auto" />
                              ) : (
                                <XCircle className="w-5 h-5 text-muted-foreground mx-auto" />
                              )}
                            </td>
                          </tr>
                        ))}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
