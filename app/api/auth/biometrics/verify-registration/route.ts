import { createServerSupabaseClient } from '@/lib/supabase/server';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { NextRequest, NextResponse } from 'next/server';

const rpID = process.env.NEXT_PUBLIC_RP_ID || 'localhost';
const origin = process.env.NEXT_PUBLIC_ORIGIN || `http://${rpID}:3000`;

export async function POST(req: NextRequest) {
  try {
    const { email, attestationResponse } = await req.json();
    const supabase = await createServerSupabaseClient();

    // 1. Get user
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    // 2. Get the challenge we sent earlier (In real app, fetch from DB/Session)
    const expectedChallenge = 'demo-challenge'; // Mocked for demonstration

    const verification = await verifyRegistrationResponse({
      response: attestationResponse,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });

    if (verification.verified && verification.registrationInfo) {
      const { credential } = verification.registrationInfo;

      // 3. Save credential to Supabase
      await supabase.from('user_credentials').insert({
        user_id: user?.id,
        credential_id: credential.id,
        public_key: Buffer.from(credential.publicKey).toString('base64'),
        counter: credential.counter,
        transports: credential.transports || [],
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
