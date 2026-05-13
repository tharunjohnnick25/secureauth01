import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { calculateRiskScore, shouldTriggerBiometrics } from '@/lib/risk';

export async function POST(req: NextRequest) {
  try {
    const { email, password, fingerprint, typingMetrics, location } = await req.json();

    // 1. Domain Restriction
    if (!email.endsWith('@gmail.com')) {
      return NextResponse.json({ error: 'Only @gmail.com accounts are allowed' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    // 2. Auth with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 401 });
    }

    const user = authData.user;

    // 3. Update/Track Device
    const { data: existingDevice } = await supabase
      .from('devices')
      .select('*')
      .eq('user_id', user.id)
      .eq('device_id', fingerprint.hash)
      .single();

    if (!existingDevice) {
      await supabase.from('devices').insert({
        user_id: user.id,
        device_id: fingerprint.hash,
        browser: fingerprint.browser,
        os: fingerprint.os,
        is_trusted: false, // Default to false until verified/biometric auth
      });
    } else {
      await supabase.from('devices').update({
        last_active: new Date().toISOString()
      }).eq('id', existingDevice.id);
    }

    // 4. Fetch User Profile & History for Risk Engine
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    const { data: history } = await supabase
      .from('login_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const { data: trustedDevices } = await supabase
      .from('devices')
      .select('device_id')
      .eq('user_id', user.id)
      .eq('is_trusted', true);

    // 5. Calculate Risk
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    
    const riskResult = calculateRiskScore({
      ip,
      location: location || { country: 'Unknown', city: 'Unknown', lat: 0, lng: 0 },
      fingerprint,
      typingMetrics,
      history: {
        lastIp: history?.ip_address,
        lastLat: history?.latitude,
        lastLng: history?.longitude,
        lastLogin: history?.created_at,
        trustedDevices: trustedDevices?.map(d => d.device_id) || [],
      }
    });

    // 6. Track Login Attempt & Geo Location
    const { data: historyRecord } = await supabase.from('login_history').insert({
      user_id: user.id,
      ip_address: ip,
      browser: fingerprint.browser,
      os: fingerprint.os,
      risk_score: riskResult.score,
      risk_level: riskResult.level,
      latitude: location?.latitude,
      longitude: location?.longitude,
      city: location?.city,
      country: location?.country,
      status: shouldTriggerBiometrics(riskResult.level) ? 'biometric_required' : 'success'
    }).select().single();

    if (location && historyRecord) {
      await supabase.from('geo_locations').insert({
        user_id: user.id,
        ip_address: ip,
        city: location.city,
        country: location.country,
        latitude: location.latitude,
        longitude: location.longitude,
        is_suspicious: riskResult.level === 'high' || riskResult.level === 'critical'
      });
    }

    // 7. Check if Biometrics required
    if (shouldTriggerBiometrics(riskResult.level)) {
      return NextResponse.json({
        requiresBiometric: true,
        riskLevel: riskResult.level,
        user: {
          id: user.id,
          email: user.email,
        }
      });
    }

    // 8. If low risk, trust the device automatically or after successful login
    if (riskResult.level === 'low' && !existingDevice?.is_trusted) {
        await supabase.from('devices').update({ is_trusted: true }).eq('user_id', user.id).eq('device_id', fingerprint.hash);
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: profile?.role || 'user',
      },
      session: authData.session,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
