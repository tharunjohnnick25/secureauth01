'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export function useRealtimeData<T>(
  table: string, 
  queryBuilder?: (supabase: any) => any,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const supabase = createClient();

  const fetchData = async () => {
    setLoading(true);
    try {
      let query;
      if (queryBuilder) {
        query = queryBuilder(supabase.from(table));
      } else {
        query = supabase.from(table).select('*');
      }
      
      const { data: result, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setData(result || []);
    } catch (err: any) {
      setError(err);
      console.error(`Error fetching ${table}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Use a unique channel name to avoid "already subscribed" errors 
    // when multiple hooks subscribe to the same table on the same page
    const channelId = Math.random().toString(36).substring(7);
    const channel = supabase
      .channel(`public:${table}:${channelId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: table },
        (payload) => {
          console.log(`Realtime update for ${table}:`, payload);
          if (payload.eventType === 'INSERT') {
            setData((prev) => [payload.new as T, ...prev]);
            // Optional: Show toast for important tables
            if (table === 'alerts') {
               toast.warning('New security alert detected!');
            }
          } else if (payload.eventType === 'UPDATE') {
            setData((prev) => 
              prev.map((item: any) => 
                item.id === payload.new.id ? { ...item, ...payload.new } : item
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setData((prev) => prev.filter((item: any) => item.id === payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, ...dependencies]);

  return { data, loading, error, refetch: fetchData };
}
