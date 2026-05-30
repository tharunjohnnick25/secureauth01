/**
 * Enterprise Risk Scoring & Adaptive Authentication Engine
 * 
 * Aggregates all security signals, behavioral scores, and device/location trust levels 
 * into a single normalized Risk Score (0-100) and decides adaptive step-up triggers.
 */

export interface SecuritySignals {
  user_id: string;
  isNewDevice: boolean;
  isNewCountry: boolean;
  isAbnormalTyping: boolean;
  failedAttempts: number;
  isVpnDetected: boolean;
  isSuspiciousIp: boolean;
  impossibleTravel: boolean;
  typingMatchScore: number; // 0-100
  deviceTrustScore: number; // 0-100
  locationTrustScore: number; // 0-100
  anomalyScore: number; // 0-100
}

export type SecurityAction = 'ALLOW' | 'REQUIRE_OTP' | 'REQUIRE_MFA' | 'BLOCK';

export interface EvaluationReport {
  score: number;
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  action: SecurityAction;
  factors: Array<{ code: string; weight: number; label: string }>;
  recommendations: string[];
  timestamp: string;
}

export class RiskScoringAI {
  // Enterprise Standard Security Weights
  private static readonly WEIGHTS = {
    NEW_DEVICE: 20,
    NEW_COUNTRY: 35,
    ABNORMAL_TYPING: 25,
    FAILED_MFA: 40,
    VPN_USAGE: 15,
    SUSPICIOUS_IP: 30,
    IMPOSSIBLE_TRAVEL: 45,
  };

  /**
   * Evaluates aggregate signals and returns a comprehensive risk report.
   */
  public static evaluateRisk(signals: SecuritySignals): EvaluationReport {
    let score = 0;
    const factors: EvaluationReport['factors'] = [];
    const recommendations: string[] = [];

    // 1. Core Threat Factors Weight Aggregation
    if (signals.impossibleTravel) {
      score += this.WEIGHTS.IMPOSSIBLE_TRAVEL;
      factors.push({ code: 'IMPOSSIBLE_TRAVEL', weight: this.WEIGHTS.IMPOSSIBLE_TRAVEL, label: 'Impossible geographic travel detected' });
      recommendations.push('Enforce immediate administrator notification and lock geofenced accounts');
    }

    if (signals.isNewDevice) {
      score += this.WEIGHTS.NEW_DEVICE;
      factors.push({ code: 'NEW_DEVICE', weight: this.WEIGHTS.NEW_DEVICE, label: 'Unrecognized device hardware fingerprint' });
      recommendations.push('Prompt user to confirm new device enrollment and verify via email link');
    }

    if (signals.isNewCountry) {
      score += this.WEIGHTS.NEW_COUNTRY;
      factors.push({ code: 'NEW_COUNTRY', weight: this.WEIGHTS.NEW_COUNTRY, label: 'First access attempt from foreign country' });
      recommendations.push('Enforce standard step-up Multi-Factor Authentication');
    }

    if (signals.isAbnormalTyping || signals.typingMatchScore < 70) {
      const weight = Math.round(this.WEIGHTS.ABNORMAL_TYPING * (1 - (signals.typingMatchScore / 100)));
      score += weight;
      factors.push({ code: 'ABNORMAL_TYPING', weight, label: `Keystroke biometrics mismatch (Rhythm match: ${signals.typingMatchScore}%)` });
      recommendations.push('Collect additional keystroke telemetry or require facial authentication');
    }

    if (signals.failedAttempts > 0) {
      // Scale failed login penalty up to max 40
      const weight = Math.min(this.WEIGHTS.FAILED_MFA, signals.failedAttempts * 15);
      score += weight;
      factors.push({ code: 'FAILED_LOGINS', weight, label: `Multiple failed authentication attempts (${signals.failedAttempts} occurrences)` });
      recommendations.push('Temporarily lock primary access password and alert cybersecurity team');
    }

    if (signals.isVpnDetected) {
      score += this.WEIGHTS.VPN_USAGE;
      factors.push({ code: 'VPN_DETECTED', weight: this.WEIGHTS.VPN_USAGE, label: 'Login origin resolved to active VPN node' });
      recommendations.push('Restrict access to low-confidentiality modules');
    }

    if (signals.isSuspiciousIp) {
      score += this.WEIGHTS.SUSPICIOUS_IP;
      factors.push({ code: 'SUSPICIOUS_IP', weight: this.WEIGHTS.SUSPICIOUS_IP, label: 'IP resolved to suspicious proxy or blacklisted hosting block' });
      recommendations.push('Perform immediate endpoint system health check');
    }

    // Adjust score based on auxiliary trust scores
    // Add additional variance based on general anomaly models
    if (signals.anomalyScore > 60) {
      score += 15;
      factors.push({ code: 'STATISTICAL_OUTLIER', weight: 15, label: 'Contextual features mismatch baseline centroid' });
    }

    // Normalize final score from 0 to 100
    const finalScore = Math.min(100, Math.max(0, score));

    // 2. Risk Level Categorization
    // 0-30 Low, 31-60 Medium, 61-80 High, 81-100 Critical
    let level: EvaluationReport['level'] = 'LOW';
    let action: SecurityAction = 'ALLOW';

    if (finalScore >= 81) {
      level = 'CRITICAL';
      action = 'BLOCK';
    } else if (finalScore >= 61) {
      level = 'HIGH';
      action = 'REQUIRE_MFA';
    } else if (finalScore >= 31) {
      level = 'MEDIUM';
      action = 'REQUIRE_OTP';
    } else {
      level = 'LOW';
      action = 'ALLOW';
    }

    // Inject recommendations based on risk action levels
    if (action === 'BLOCK') {
      recommendations.unshift('BLOCK ACCESS: Terminate all active sessions immediately and notify Security Response');
    } else if (action === 'REQUIRE_MFA') {
      recommendations.unshift('STEP-UP VERIFICATION: Prompt user for full TOTP Authenticator confirmation');
    } else if (action === 'REQUIRE_OTP') {
      recommendations.unshift('OTP VERIFICATION: Send 6-digit OTP to registered identity email');
    }

    return {
      score: finalScore,
      level,
      action,
      factors,
      recommendations: recommendations.length > 0 ? recommendations : ['No immediate security action required'],
      timestamp: new Date().toISOString()
    };
  }
}
