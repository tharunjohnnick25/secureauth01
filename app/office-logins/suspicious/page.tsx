'use client';

import React, { useEffect, useState } from 'react';
import { DataGridPage } from '@/components/pages/DataGridPage';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { Loader2, AlertTriangle, MapPin } from 'lucide-react';

export default function SuspiciousLocationsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: logs } = await supabase
          .from('anomaly_logs')
          .select('*, users(full_name, email)')
          .eq('type', 'IMPOSSIBLE_TRAVEL')
          .order('created_at', { ascending: false });
        setData(logs || []);
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
         <Loader2 className="w-8 h-8 animate-spin text-red-500" />
       </div>
    );
  }

  return (
    <DataGridPage 
      title="Suspicious Geolocation Activity" 
      description="Critical list of logins detected from high-risk countries or involving impossible travel between offices."
      columns={[
        { 
          key: 'user', 
          label: 'Employee',
          render: (_, row) => (
            <div className="flex flex-col">
              <span className="font-medium text-white">{row.users?.full_name || 'System User'}</span>
              <span className="text-xs text-gray-500">{row.users?.email}</span>
            </div>
          )
        },
        { 
          key: 'details', 
          label: 'Anomaly Details',
          render: (val) => (
            <div className="flex items-center gap-2 text-red-400">
               <AlertTriangle className="w-4 h-4" />
               <span>{val?.message || 'Geographic Anomaly'}</span>
            </div>
          )
        },
        { 
          key: 'severity', 
          label: 'Severity',
          render: (val) => (
             <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20`}>
               {val}
             </span>
          )
        },
        { 
          key: 'created_at', 
          label: 'Detected At',
          render: (val) => format(new Date(val), 'MMM d, h:mm a')
        }
      ]}
      data={data}
    />
  );
}
