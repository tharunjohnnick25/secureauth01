'use client';

import { DataGridPage } from '@/components/pages/DataGridPage';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { format } from 'date-fns';

export default function Page() {
  const { data: attendanceData, loading } = useRealtimeData('login_logs', (q) => 
    q.select('*, users(full_name, email)')
     .order('created_at', { ascending: false })
     .limit(100)
  );

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

  return (
    <DataGridPage 
      title="Attendance & Login" 
      description="Monitor daily attendance and active user sessions in real-time."
      columns={columns}
      data={attendanceData || []}
      primaryAction={{ label: 'Export Report', onClick: () => console.log('Exporting...') }}
    />
  );
}