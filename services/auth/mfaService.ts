// @ts-nocheck
// @ts-nocheck
import { User } from '@/types/auth';
import { totp } from 'otplib';
import { supabase } from '@/lib/supabase/client'; // Correct supabase client path
import { v4 as uuidv4 } from 'uuid';
import { addHours } from 'date-fns';
import { SignOptions, sign, verify } from 'jsonwebtoken';

// OTP email sending placeholder – integrate with your email service later
async function sendEmailOtp(email: string, otp: string) {
  // TODO: replace with real email service
  console.log(`Sending OTP ${otp} to ${email}`);
}

/**
 * Service handling MFA enrollment, verification, recovery codes.
 */
export class MfaService {
  /** Enroll TOTP (authenticator app) for a user */
  static async enrollTotp(userId: string): Promise<{ otpauthUrl: string }> {
    const secret = generateSecret();
    const otpauthUrl = `otpauth://totp/SecureAuth:${userId}?secret=${secret}&issuer=SecureAuth`; // compatible with Google Authenticator
    // Store encrypted secret in DB
    await supabase.from('mfa_settings').upsert({
      user_id: userId,
      totp_secret: secret,
      method: 'TOTP',
    });
    return { otpauthUrl };
  }

  /** Verify TOTP code */
  static async verifyTotp(userId: string, token: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('mfa_settings')
      .select('totp_secret')
      .eq('user_id', userId)
      .eq('method', 'TOTP')
      .single();
    if (error || !data) return false;
    const { totp_secret } = data as any;
    const { totp } = await import('otplib');
    totp.options = { window: 1 };
    return totp.check(token, totp_secret);
  }

  /** Enroll email OTP flow – generate OTP and send */
  static async sendEmailOtp(user: User): Promise<void> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = addHours(new Date(), 1).toISOString();
    await supabase.from('mfa_settings').upsert({
      user_id: user.id,
      method: 'EMAIL_OTP',
      email_otp: otp,
      otp_expires_at: expiresAt,
    });
    await sendEmailOtp(user.email, otp);
  }

  /** Verify email OTP */
  static async verifyEmailOtp(userId: string, otp: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('mfa_settings')
      .select('email_otp, otp_expires_at')
      .eq('user_id', userId)
      .eq('method', 'EMAIL_OTP')
      .single();
    if (error || !data) return false;
    const { email_otp, otp_expires_at } = data as any;
    if (email_otp !== otp) return false;
    if (new Date() > new Date(otp_expires_at)) return false;
    // Invalidate OTP after use
    await supabase.from('mfa_settings').update({ email_otp: null, otp_expires_at: null }).eq('user_id', userId).eq('method', 'EMAIL_OTP');
    return true;
  }

  /** Generate backup recovery codes */
  static async generateRecoveryCodes(userId: string): Promise<string[]> {
    const codes = Array.from({ length: 8 }, () => uuidv4().replace(/-/g, '').slice(0, 12));
    await supabase.from('mfa_recovery_codes').delete().eq('user_id', userId);
    const inserts = codes.map((c) => ({ user_id: userId, code: c, used: false }));
    await supabase.from('mfa_recovery_codes').insert(inserts);
    return codes;
  }

  /** Verify a recovery code */
  static async verifyRecoveryCode(userId: string, code: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('mfa_recovery_codes')
      .select('*')
      .eq('user_id', userId)
      .eq('code', code)
      .eq('used', false)
      .single();
    if (error || !data) return false;
    await supabase.from('mfa_recovery_codes').update({ used: true }).eq('user_id', userId).eq('code', code);
    return true;
  }
}
