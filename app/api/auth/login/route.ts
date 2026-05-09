import { createServerSupabaseClient } from '@/lib/supabase/server';
import { calculateRiskScore } from '@/lib/risk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const supabase = await createServerSupabaseClient();

    // 1. Initial Auth Check
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const userId = authData.user.id;

    // 2. Fetch User Profile
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError || !userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    if (userProfile.status === 'locked') {
      return NextResponse.json({ error: 'Account locked' }, { status: 403 });
    }

    // 3. Risk Evaluation
    const riskData = await calculateRiskScore(req, userId);

    // 4. Record Login History
    let status = 'success';
    if (userProfile.is_mfa_enabled || riskData.riskLevel === 'high' || riskData.riskLevel === 'critical') {
      status = 'mfa_required';
    }

    await supabase.from('login_history').insert({
      user_id: userId,
      ip_address: req.headers.get('x-forwarded-for') || '127.0.0.1',
      status,
      risk_score_id: riskData.riskRecordId
    });

    // 5. Check if MFA is required
    if (status === 'mfa_required') {
      // Don't fully log them in yet, we will clear the session and return a temporary token 
      // or we just return mfa required and they hit the verify endpoint.
      // With Supabase native MFA, we should check if they have AAL2.
      
      const { data: mfaData, error: mfaError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      
      if (mfaData?.currentLevel === 'aal1') {
         return NextResponse.json({
          requiresMfa: true,
          riskLevel: riskData.riskLevel,
          message: 'MFA Verification Required'
        });
      }
    }

    // Reset failed attempts on success
    await supabase.from('users').update({ failed_login_attempts: 0 }).eq('id', userId);

    // 6. Return success
    return NextResponse.json({
      user: userProfile,
      session: authData.session,
      risk: riskData
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
