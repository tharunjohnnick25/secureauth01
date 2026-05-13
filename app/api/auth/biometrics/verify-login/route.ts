import { createServerSupabaseClient } from '@/lib/supabase/server';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import { NextRequest, NextResponse } from 'next/server';

const rpID = process.env.NEXT_PUBLIC_RP_ID || 'localhost';
const origin = process.env.NEXT_PUBLIC_ORIGIN || `http://${rpID}:3000`;

export async function POST(req: NextRequest) {
  try {
    const { email, assertionResponse } = await req.json();
    const supabase = await createServerSupabaseClient();

    // 1. Get user and credential
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    const { data: credential } = await supabase
      .from('user_credentials')
      .select('*')
      .eq('credential_id', assertionResponse.id)
      .single();

    if (!credential) {
      return NextResponse.json({ error: 'Credential not found' }, { status: 404 });
    }

    const expectedChallenge = 'demo-challenge'; // Mocked

    const verification = await verifyAuthenticationResponse({
      response: assertionResponse,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator: {
        credentialID: credential.credential_id,
        credentialPublicKey: Buffer.from(credential.public_key, 'base64'),
        counter: credential.counter,
      },
    });

    if (verification.verified) {
      // Update counter
      await supabase
        .from('user_credentials')
        .update({ counter: verification.authenticationInfo.newCounter })
        .eq('credential_id', credential.credential_id);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
