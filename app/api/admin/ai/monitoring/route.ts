import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { ThreatIntelEngine } from '@/ai-engine/security-analysis/threat-intel';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    // 1. Fetch recent risk assessments
    const { data: recentRisks } = await supabase
      .from('ai_risk_scores')
      .select('*, users(email)')
      .order('created_at', { ascending: false })
      .limit(20);

    // 2. Fetch unresolved anomalies
    const { data: anomalies } = await supabase
      .from('anomaly_logs')
      .select('*, users(email)')
      .eq('is_resolved', false)
      .order('created_at', { ascending: false });

    // 3. Fetch security events for Threat Intel engine
    const { data: events } = await supabase
      .from('login_logs')
      .select('*')
      .limit(100);

    const threatProfile = ThreatIntelEngine.analyzeThreats((events || []).map(e => ({
      id: e.id,
      type: 'LOGIN',
      severity: e.risk_level as any,
      ip_address: e.ip_address
    })));

    return NextResponse.json({
      recentRisks,
      activeAnomalies: anomalies,
      threatProfile,
      stats: {
          totalCritical: (recentRisks || []).filter(r => r.risk_level === 'CRITICAL').length,
          avgRiskScore: (recentRisks || []).reduce((acc, r) => acc + r.score, 0) / (recentRisks?.length || 1),
      }
    });
  } catch (error) {
    console.error('AI Monitoring error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
