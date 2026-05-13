import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    // 1. Domain Restriction
    if (!email.endsWith('@gmail.com')) {
      return NextResponse.json({ error: 'Only @gmail.com accounts are allowed' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    // 2. Sign up with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        }
      }
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Profile creation is handled by Supabase trigger `handle_new_user`
    // but we can add additional metadata here if needed.

    return NextResponse.json({ 
      message: 'Registration successful! Please check your email for verification.',
      user: data.user 
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
