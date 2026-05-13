import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.user) {
      const email = data.user.email;
      
      // Enforce @gmail.com domain
      if (email && !email.endsWith('@gmail.com')) {
        await supabase.auth.signOut();
        return NextResponse.redirect(`${origin}/login?error=Only @gmail.com accounts are permitted`);
      }

      // Ensure user profile exists (trigger usually handles this, but safety check)
      await supabase.from('users').upsert({
        id: data.user.id,
        email: email,
        updated_at: new Date().toISOString(),
      });

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=Authentication failed`);
}
