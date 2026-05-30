'use client';

import React, { useEffect, useState } from 'react';
import { DataGridPage } from '@/components/pages/DataGridPage';
import { DashboardService } from '@/lib/services/dashboard';
import { Loader2 } from 'lucide-react';

export default function Page() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await DashboardService.getDepartments();
        setData(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
       <div className="min-h-screen bg-[#020617] flex items-center justify-center">
         <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
       </div>
    );
  }

  return (
    <DataGridPage 
      title="Departments" 
      description="Manage enterprise departments and access controls."
      columns={[
        { key: 'name', label: 'Department Name' },
        { key: 'head', label: 'Department Head' },
        { key: 'employees', label: 'Total Employees' },
        { 
          key: 'risk', 
          label: 'Avg Risk Score',
          render: (val: string) => (
             <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
               val === 'Low' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : val === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
             }`}>
               {val}
             </span>
          )
        }
      ]}
      data={data}
      primaryAction={{ label: 'Add Department', onClick: () => console.log('Add') }}
    />
  );
}