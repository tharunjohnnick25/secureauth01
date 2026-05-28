import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// This is the generic client for both browser and server-side components (when used in non-SSR context)
// For Next.js App Router SSR, use createBrowserClient or createServerClient from @supabase/ssr
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
