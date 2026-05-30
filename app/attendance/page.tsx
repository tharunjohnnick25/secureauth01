'use client';

import React, { useEffect, useState } from 'react';
import { DataGridPage } from '@/components/pages/DataGridPage';
import { DashboardService } from '@/lib/services/dashboard';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

export default function Page() {
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await DashboardService.getAttendance();
        setAttendanceData(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const columns = [
    { 
      key: 'user', 
      label: 'Employee Name',
      render: (_: any, row: any) => (
        <div className="flex flex-col">
          <span className="font-medium text-white">{row.users?.full_name || 'System User'}</span>
          <span className="text-xs text-gray-500">{row.users?.email}</span>
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (val: string) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          val === 'SUCCESS' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
        }`}>
          {val === 'SUCCESS' ? 'Authorized' : 'Denied'}
        </span>
      )
    },
    { 
      key: 'created_at', 
      label: 'Check In Time',
      render: (val: string) => val ? format(new Date(val), 'MMM d, h:mm a') : 'N/A'
    },
    { 
      key: 'location', 
      label: 'Location',
      render: (val: any) => val ? `${val.city || 'Unknown'}, ${val.country || 'XX'}` : 'Unknown'
    },
    { 
      key: 'ip_address', 
      label: 'Network IP'
    }
  ];

  if (loading) {
    return (
       <div className="min-h-screen bg-[#020617] flex items-center justify-center">
         <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
       </div>
    );
  }

  return (
    <DataGridPage 
      title="Attendance & Login" 
      description="Monitor daily attendance and active user sessions in real-time."
      columns={columns}
      data={attendanceData}
      primaryAction={{ label: 'Export Report', onClick: () => console.log('Exporting...') }}
    />
  );
}