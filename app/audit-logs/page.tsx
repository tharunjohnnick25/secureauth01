'use client';

import { DataGridPage } from '@/components/pages/DataGridPage';

export default function Page() {
  return (
    <DataGridPage 
      title="Audit Logs" 
      description="Immutable ledger of system events."
      columns={[
        { key: 'event', label: 'Event Type' },
        { key: 'user', label: 'User / Actor' },
        { key: 'resource', label: 'Resource' },
        { key: 'time', label: 'Timestamp' }
      ]}
      data={[
        { event: 'USER_LOGIN', user: 'admin@mail.com', resource: 'Dashboard UI', time: '10:45:12 AM' },
        { event: 'POLICY_UPDATE', user: 'admin@mail.com', resource: 'MFA Requirements', time: '09:12:00 AM' },
        { event: 'ACCESS_DENIED', user: 'unknown_ip', resource: 'API /v1/users', time: '08:30:45 AM' },
        { event: 'USER_CREATED', user: 'system', resource: 'Employee Profile', time: '07:15:22 AM' },
      ]}
      primaryAction={{ label: 'Export Logs', onClick: () => console.log('Export') }}
    />
  );
}