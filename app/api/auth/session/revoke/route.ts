import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();
    const supabase = await createServerSupabaseClient();

    // In a real Supabase setup, you might revoke the JWT or delete the session from public.sessions
    // and also potentially call supabase.auth.admin.signOut(userId) if you have the userId.
    
    // For our custom tracking:
    const { error } = await supabase
      .from('sessions')
      .update({ is_active: false })
      .eq('id', sessionId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
