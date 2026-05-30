/**
 * AI Risk Scoring Engine
 * 
 * Calculates trust and risk scores based on multiple security signals.
 * Purely local heuristics and anomaly detection - NO EXTERNAL APIs.
 */

export interface AISignals {
  user_id: string;
  ip: string;
  userAgent: string;
  fingerprint: string;
  location: {
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    isp?: string;
  };
  behavioral: {
    typingConfidence: number;
    mouseConfidence: number;
    interactionPatterns: number;
  };
  history: {
    lastIp?: string;
    lastLogin?: string;
    lastLatitude?: number;
    lastLongitude?: number;
    trustedFingerprints: string[];
    failedAttemptsCount: number;
  };
  network: {
    isVPN: boolean;
    isTor: boolean;
    isProxy: boolean;
  };
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface RiskReport {
  score: number;
  level: RiskLevel;
  factors: Array<{ code: string; weight: number; label: string }>;
  timestamp: string;
}

export class AIRiskScorer {
  private static readonly WEIGHTS = {
    NEW_DEVICE: 20,
    IP_CHANGE: 10,
    IMPOSSIBLE_TRAVEL: 40,
    BEHAVIORAL_MISMATCH: 25,
    SUSPICIOUS_IP: 30,
    VPN_DETECTED: 15,
    TOR_DETECTED: 50,
    UNUSUAL_HOURS: 10,
    FAILED_ATTEMPTS: 15,
  };

  public static calculate(signals: AISignals): RiskReport {
    let score = 0;
    const factors: RiskReport['factors'] = [];

    // 1. Device Fingerprint Analysis
    if (!signals.history.trustedFingerprints.includes(signals.fingerprint)) {
      score += this.WEIGHTS.NEW_DEVICE;
      factors.push({ code: 'NEW_DEVICE', weight: this.WEIGHTS.NEW_DEVICE, label: 'Unrecognized device fingerprint' });
    }

    // 2. Network Intelligence
    if (signals.network.isTor) {
      score += this.WEIGHTS.TOR_DETECTED;
      factors.push({ code: 'TOR_DETECTED', weight: this.WEIGHTS.TOR_DETECTED, label: 'Login via Tor network detected' });
    } else if (signals.network.isVPN) {
      score += this.WEIGHTS.VPN_DETECTED;
      factors.push({ code: 'VPN_DETECTED', weight: this.WEIGHTS.VPN_DETECTED, label: 'VPN or Proxy usage detected' });
    }

    // 3. Geolocation & Impossible Travel
    if (signals.history.lastLatitude && signals.history.lastLongitude && signals.location.latitude && signals.location.longitude) {
      const distance = this.calculateDistance(
        signals.history.lastLatitude,
        signals.history.lastLongitude,
        signals.location.latitude,
        signals.location.longitude
      );

      const timeDiffHours = (new Date().getTime() - new Date(signals.history.lastLogin!).getTime()) / (1000 * 60 * 60);
      const speed = timeDiffHours > 0 ? distance / timeDiffHours : 0;

      if (speed > 850) { // Commercial flight speed threshold
        score += this.WEIGHTS.IMPOSSIBLE_TRAVEL;
        factors.push({ code: 'IMPOSSIBLE_TRAVEL', weight: this.WEIGHTS.IMPOSSIBLE_TRAVEL, label: 'Impossible travel speed detected' });
      } else if (distance > 500 && timeDiffHours < 2) {
        score += 20;
        factors.push({ code: 'GEO_ANOMALY', weight: 20, label: 'Significant location shift detected' });
      }
    }

    // 4. Behavioral Biometrics Confidence
    const avgBehaviorConfidence = (signals.behavioral.typingConfidence + signals.behavioral.mouseConfidence) / 2;
    if (avgBehaviorConfidence < 0.6) {
      score += this.WEIGHTS.BEHAVIORAL_MISMATCH;
      factors.push({ code: 'BEHAVIORAL_MISMATCH', weight: this.WEIGHTS.BEHAVIORAL_MISMATCH, label: 'Behavioral biometrics signature mismatch' });
    }

    // 5. Failed Attempts Heuristics
    if (signals.history.failedAttemptsCount > 3) {
      score += this.WEIGHTS.FAILED_ATTEMPTS;
      factors.push({ code: 'BRUTE_FORCE_RISK', weight: this.WEIGHTS.FAILED_ATTEMPTS, label: 'Multiple failed login attempts detected' });
    }

    // Normalize score to 0-100
    const finalScore = Math.min(100, Math.max(0, score));

    // Determine Risk Level
    let level: RiskLevel = 'LOW';
    if (finalScore >= 70) level = 'CRITICAL';
    else if (finalScore >= 40) level = 'HIGH';
    else if (finalScore >= 20) level = 'MEDIUM';

    return {
      score: finalScore,
      level,
      factors,
      timestamp: new Date().toISOString(),
    };
  }

  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}
