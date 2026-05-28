'use client';

import { DataGridPage } from '@/components/pages/DataGridPage';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { Button } from '@/components/Button';
import { CheckCircle, XCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

export default function AccessRequestsPage() {
  const supabase = createClient();
  const { data: requests, loading, refetch } = useRealtimeData('employee_requests', (q) => 
    q.select('*, users(full_name, email)')
     .order('created_at', { ascending: false })
  );

  const handleAction = async (requestId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const { error } = await (supabase
        .from('employee_requests') as any)
        .update({ 
          status: status.toLowerCase(), 
          updated_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (error) throw error;
      toast.success(`Request ${status.toLowerCase()} successfully`);
      refetch();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const columns = [
    { 
      key: 'user', 
      label: 'Employee',
      render: (_: any, row: any) => (
        <div className="flex flex-col">
          <span className="font-medium text-white">{row.users?.full_name || 'System User'}</span>
          <span className="text-xs text-gray-500">{row.users?.email}</span>
        </div>
      )
    },
    { 
      key: 'reason', 
      label: 'Justification',
      render: (val: string) => <span className="text-gray-400 text-xs italic">"{val || 'No reason provided'}"</span>
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (val: string) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          val === 'approved' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
          val === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
          'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
        }`}>
          {val}
        </span>
      )
    },
    { 
      key: 'created_at', 
      label: 'Requested',
      render: (val: string) => val ? formatDistanceToNow(new Date(val), { addSuffix: true }) : 'N/A'
    },
    { 
      key: 'actions', 
      label: 'Management',
      render: (_: any, row: any) => (
        <div className="flex gap-2">
          {row.status === 'pending' && (
            <>
              <Button 
                size="sm" 
                className="h-8 bg-green-600 hover:bg-green-500 text-xs gap-1"
                onClick={() => handleAction(row.id, 'APPROVED')}
              >
                <CheckCircle className="w-3.5 h-3.5" /> Approve
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs gap-1"
                onClick={() => handleAction(row.id, 'REJECTED')}
              >
                <XCircle className="w-3.5 h-3.5" /> Reject
              </Button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <DataGridPage 
      title="Access Requests" 
      description="Review and process employee access token requests for sensitive portals."
      columns={columns}
      data={requests || []}
    />
  );
}
