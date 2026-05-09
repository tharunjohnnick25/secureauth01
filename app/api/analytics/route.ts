import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Auth check using session
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch Risk Scores
    const { data: riskScores, error: riskError } = await supabase
      .from('risk_scores')
      .select('*')
      .eq('user_id', userId)
      .order('evaluated_at', { ascending: false })
      .limit(10);

    // Fetch Alerts
    const { data: alerts, error: alertError } = await supabase
      .from('alerts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    // Fetch Login History
    const { data: loginHistory, error: historyError } = await supabase
      .from('login_history')
      .select('ip_address, status, created_at, failure_reason')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (riskError || alertError || historyError) {
      throw new Error('Database error fetching analytics');
    }

    // Calculate aggregated metrics
    const currentRisk = riskScores?.[0] || { score: 0, risk_level: 'low' };
    const avgRisk = riskScores && riskScores.length > 0 
      ? riskScores.reduce((acc, curr) => acc + curr.score, 0) / riskScores.length 
      : 0;

    const failedLogins = loginHistory?.filter(h => h.status === 'failed').length || 0;

    return NextResponse.json({
      currentRisk,
      avgRisk,
      failedLogins,
      alerts,
      recentHistory: loginHistory,
      riskTrend: riskScores?.reverse() || []
    });

  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
