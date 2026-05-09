import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function calculateRiskScore(req: NextRequest, userId: string) {
  const supabase = await createServerSupabaseClient();
  let score = 0;
  const factors: string[] = [];

  // 1. IP check
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const { data: previousLogins } = await supabase
    .from('login_history')
    .select('ip_address')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  const isNewIp = previousLogins?.every(log => log.ip_address !== ip);
  if (isNewIp) {
    score += 30;
    factors.push('New IP Address detected');
  }

  // 2. Browser & Device Check
  const userAgent = req.headers.get('user-agent') || 'unknown';
  // Here we'd parse user-agent and compare with known devices
  const { data: knownDevices } = await supabase
    .from('devices')
    .select('user_agent')
    .eq('user_id', userId);

  const isNewDevice = !knownDevices?.some(d => d.user_agent === userAgent);
  if (isNewDevice) {
    score += 40;
    factors.push('Unrecognized device');
  }

  // 3. Failed attempts check
  const { data: user } = await supabase
    .from('users')
    .select('failed_login_attempts')
    .eq('id', userId)
    .single();

  if (user && user.failed_login_attempts > 2) {
    score += 20 * user.failed_login_attempts;
    factors.push('Multiple failed login attempts');
  }

  // Cap at 100
  score = Math.min(score, 100);
  
  let riskLevel = 'low';
  if (score >= 80) riskLevel = 'critical';
  else if (score >= 50) riskLevel = 'high';
  else if (score >= 30) riskLevel = 'medium';

  // Save risk score
  const { data: riskRecord } = await supabase
    .from('risk_scores')
    .insert({
      user_id: userId,
      score,
      risk_level: riskLevel,
      factors
    })
    .select()
    .single();

  return {
    score,
    riskLevel,
    factors,
    riskRecordId: riskRecord?.id
  };
}
