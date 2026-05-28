'use client';

import { DataGridPage } from '@/components/pages/DataGridPage';

export default function Page() {
  return (
    <DataGridPage 
      title="API Integrations" 
      description="Manage API endpoints, Webhooks, and third-party apps."
      columns={[
        { key: 'name', label: 'Integration Name' },
        { key: 'type', label: 'Type' },
        { key: 'status', label: 'Status' },
        { key: 'lastSync', label: 'Last Sync' }
      ]}
      data={[
        { name: 'Okta SSO', type: 'Identity', status: 'Active', lastSync: '1 min ago' },
        { name: 'Slack Alerts', type: 'Webhook', status: 'Active', lastSync: '10 mins ago' },
        { name: 'Splunk SIEM', type: 'Log Forwarding', status: 'Error', lastSync: '2 hours ago' },
        { name: 'Workday HRIS', type: 'Directory', status: 'Active', lastSync: 'Yesterday' },
      ]}
      primaryAction={{ label: 'New Integration', onClick: () => console.log('New') }}
    />
  );
}