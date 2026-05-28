'use client';

import { SettingsLayout } from '@/components/pages/SettingsLayout';

export default function Page() {
  return (
    <SettingsLayout 
      title="Roles & Permissions" 
      description="Configure granular RBAC controls for the organization."
      sections={[
        {
          title: 'Default Role Settings',
          description: 'Permissions assigned to new users by default.',
          fields: [
            { label: 'Default Role', type: 'select', options: ['Employee', 'Contractor', 'Guest'] },
            { label: 'Auto-approve Standard Access', type: 'toggle', value: true },
          ]
        },
        {
          title: 'Admin Overrides',
          description: 'Special permission behaviors.',
          fields: [
            { label: 'Require MFA for Admins', type: 'toggle', value: true },
            { label: 'Session Timeout (Minutes)', type: 'text', value: '30' },
          ]
        }
      ]}
    />
  );
}