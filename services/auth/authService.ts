// @ts-nocheck
import { User } from '@/types/auth';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// JWT secret for signing access tokens (should be stored securely)
const JWT_SECRET = process.env.JWT_SECRET!;
// Access token expires in 15 minutes, refresh token in 7 days
const ACCESS_TOKEN_TTL = 15 * 60; // seconds
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60; // seconds

interface TokenSet {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  /**
   * Perform email/password login using Supabase auth.
   * Returns a token set and the user profile.
   */
  static async loginWithEmail(email: string, password: string): Promise<{ user: User; tokens: TokenSet }> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data?.session) {
      throw new Error(error?.message ?? 'Invalid credentials');
    }
    const user = await AuthService.fetchUserProfile(data.user.id);
    const tokens = AuthService.createTokenSet(user.id);
    // Store refresh token securely server‑side (e.g., in DB). For now we set httpOnly cookie.
    AuthService.setRefreshCookie(tokens.refreshToken);
    return { user, tokens };
  }

  /**
   * OAuth login entry point – called after Supabase OAuth redirect.
   * `provider` is "google" or "github".
   */
  static async handleOAuthCallback(provider: string): Promise<{ user: User; tokens: TokenSet }> {
    // Supabase automatically handles the OAuth flow. After redirect, the session is available.
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
      throw new Error('OAuth session not found');
    }
    const supabaseUser = data.session.user;
    const user = await AuthService.upsertOAuthUser(supabaseUser, provider);
    const tokens = AuthService.createTokenSet(user.id);
    AuthService.setRefreshCookie(tokens.refreshToken);
    return { user, tokens };
  }

  /**
   * Log out the current user – clears cookies and revokes Supabase session.
   */
  static async logout(): Promise<void> {
    await supabase.auth.signOut();
    AuthService.clearRefreshCookie();
  }

  /**
   * Refresh access token using refresh token stored in httpOnly cookie.
   */
  static async refreshAccessToken(): Promise<string> {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;
    if (!refreshToken) throw new Error('Refresh token missing');
    let payload: JwtPayload;
    try {
      payload = verify(refreshToken, JWT_SECRET) as JwtPayload;
    } catch {
      throw new Error('Invalid refresh token');
    }
    // Issue new access token
    const newAccess = sign({ sub: payload.sub }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL });
    return newAccess;
  }

  // ---------- internal helpers ----------

  private static async fetchUserProfile(userId: string): Promise<User> {
    // Assume a Supabase RPC or direct query to fetch extended profile
    const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
    if (error) throw new Error('User profile not found');
    return data as User;
  }

  private static async upsertOAuthUser(supabaseUser: any, provider: string): Promise<User> {
    // Basic upsert – map fields to our `users` table.
    const { email, id, user_metadata } = supabaseUser;
    const profile = {
      id,
      email,
      avatar_url: user_metadata?.avatar_url ?? null,
      full_name: user_metadata?.full_name ?? null,
      provider,
      role: 'USER', // defaults, later admin can elevate.
    };
    const { data, error } = await supabase.from('users').upsert(profile, { onConflict: 'id' }).single();
    if (error) throw new Error('Failed to upsert OAuth user');
    return data as User;
  }

  private static createTokenSet(userId: string): TokenSet {
    const accessToken = sign({ sub: userId }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL });
    const refreshToken = sign({ sub: userId, jti: uuidv4() }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_TTL });
    return { accessToken, refreshToken };
  }

  private static setRefreshCookie(refreshToken: string) {
    // Using Next.js `cookies` API sets httpOnly, Secure, SameSite=Strict cookie.
    cookies().set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: REFRESH_TOKEN_TTL,
      path: '/',
    });
  }

  private static clearRefreshCookie() {
    cookies().delete('refresh_token');
  }
}
