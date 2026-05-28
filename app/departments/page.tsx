'use client';

import { DataGridPage } from '@/components/pages/DataGridPage';

export default function Page() {
  return (
    <DataGridPage 
      title="Departments" 
      description="Manage enterprise departments and access controls."
      columns={[
        { key: 'name', label: 'Department Name' },
        { key: 'head', label: 'Department Head' },
        { key: 'employees', label: 'Total Employees' },
        { key: 'risk', label: 'Avg Risk Score' }
      ]}
      data={[
        { name: 'Engineering', head: 'Alice Johnson', employees: 142, risk: 'Low' },
        { name: 'Human Resources', head: 'Sarah Connor', employees: 24, risk: 'Low' },
        { name: 'Finance', head: 'John Smith', employees: 35, risk: 'Medium' },
        { name: 'Sales', head: 'Bob Williams', employees: 89, risk: 'High' },
      ]}
      primaryAction={{ label: 'Add Department', onClick: () => console.log('Add') }}
    />
  );
}