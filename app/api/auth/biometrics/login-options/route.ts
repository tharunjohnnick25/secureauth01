import { createServerSupabaseClient } from '@/lib/supabase/server';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { NextRequest, NextResponse } from 'next/server';

const rpID = process.env.NEXT_PUBLIC_RP_ID || 'localhost';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const supabase = await createServerSupabaseClient();

    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { data: credentials } = await supabase
      .from('user_credentials')
      .select('credential_id, transports')
      .eq('user_id', user.id);

    const options = await generateAuthenticationOptions({
      rpID,
      allowCredentials: credentials?.map(c => ({
        id: c.credential_id,
        type: 'public-key',
        transports: c.transports,
      })),
      userVerification: 'preferred',
    });

    return NextResponse.json(options);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
