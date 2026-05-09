'use client';

import { useState, useEffect } from 'react';

export function useRiskScore() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRiskData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/analytics');
      if (!res.ok) throw new Error('Failed to fetch risk data');
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiskData();
    // Poll every 30s for live risk updates
    const interval = setInterval(fetchRiskData, 30000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refetch: fetchRiskData };
}
