import { createClient as createClientJS } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ✅ Singleton pattern — prevents creating a new client on every render/call
let _client: ReturnType<typeof createClientJS<Database>> | null = null;

export const createClient = () => {
  if (!_client) {
    _client = createClientJS<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        // Persist session in localStorage for fast restore
        persistSession: true,
        // Auto-refresh token before expiry — no manual refresh needed
        autoRefreshToken: true,
        // Detect session in URL fragments (for OAuth flows)
        detectSessionInUrl: true,
        // Store session using localStorage key
        storageKey: 'secureauth-session',
      },
    });
  }
  return _client;
};

export const supabase = createClient();
