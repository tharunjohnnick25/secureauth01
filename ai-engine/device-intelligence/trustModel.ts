/**
 * Device Trust AI Model
 * 
 * Inspects screen, browser engine details, timezone variables, languages, core architecture,
 * and graphics hardware configurations to output a structured Device Trust Score (0-100).
 */

export interface DeviceFingerprintDetails {
  userAgent: string;
  os: string;
  browser: string;
  screenResolution: string;
  timezone: string;
  language: string;
  gpu?: string;
  memory?: number;
  cores?: number;
  canvasHash?: string;
}

export interface TrustedDeviceRecord {
  fingerprintHash: string;
  details: DeviceFingerprintDetails;
  trustScore: number;
  lastUsed: string;
}

export class DeviceTrustAI {
  /**
   * Generates a Trust Score from 0 to 100 based on comparison to user's trusted devices.
   */
  public static calculateTrustScore(
    current: DeviceFingerprintDetails,
    trustedDevices: TrustedDeviceRecord[]
  ): { score: number; matchFound: boolean; isSuspicious: boolean; reasons: string[] } {
    const reasons: string[] = [];
    
    // Initial headless/virtualization check
    const { suspicious: isBasicSuspicious, reasons: basicReasons } = this.auditHardware(current);
    reasons.push(...basicReasons);

    if (trustedDevices.length === 0) {
      // No history of trusted devices yet. Return mid-level score (first enrollment)
      return {
        score: isBasicSuspicious ? 30 : 80,
        matchFound: false,
        isSuspicious: isBasicSuspicious,
        reasons: isBasicSuspicious ? reasons : ['First-time device enrollment context']
      };
    }

    // Compare against the user's list of trusted devices
    let bestSimilarity = 0;
    let matchingRecord: TrustedDeviceRecord | null = null;

    trustedDevices.forEach(record => {
      const similarity = this.compareFingerprints(current, record.details);
      if (similarity > bestSimilarity) {
        bestSimilarity = similarity;
        matchingRecord = record;
      }
    });

    let score = Math.round(bestSimilarity * 100);

    // Apply severity deductions for hardware inconsistencies
    if (isBasicSuspicious) {
      score = Math.max(0, score - 40);
    }

    // If matching canvas exists but browser changes, flag anomaly
    if (matchingRecord && (matchingRecord as TrustedDeviceRecord).details.canvasHash === current.canvasHash) {
      if (matchingRecord && (matchingRecord as TrustedDeviceRecord).details.browser !== current.browser) {
        score = Math.max(10, score - 30);
        reasons.push('Fingerprint cloning signature detected (canvas match with mismatched browser engine)');
      }
    }

    // High consistency: similarity > 92% -> Match Found
    const matchFound = bestSimilarity >= 0.92;

    return {
      score: Math.min(100, Math.max(0, score)),
      matchFound,
      isSuspicious: isBasicSuspicious || reasons.length > 0 || score < 60,
      reasons: reasons.length > 0 ? reasons : (matchFound ? [] : ['Unrecognized hardware footprint configuration'])
    };
  }

  /**
   * Deep comparison between two device fingerprints
   */
  private static compareFingerprints(f1: DeviceFingerprintDetails, f2: DeviceFingerprintDetails): number {
    let matches = 0;
    let totalFields = 0;

    const strictFields: (keyof DeviceFingerprintDetails)[] = [
      'os',
      'browser',
      'screenResolution',
      'timezone',
      'language',
      'gpu',
      'memory',
      'cores',
      'canvasHash'
    ];

    strictFields.forEach(field => {
      if (f1[field] !== undefined || f2[field] !== undefined) {
        totalFields++;
        if (f1[field] === f2[field]) {
          matches++;
        }
      }
    });

    return totalFields > 0 ? matches / totalFields : 0;
  }

  /**
   * Evaluates hardware and OS context features to detect bots, scrapers, or low-trust environments.
   */
  private static auditHardware(details: DeviceFingerprintDetails): { suspicious: boolean; reasons: string[] } {
    const reasons: string[] = [];
    const ua = details.userAgent || '';

    // 1. Headless browser engine patterns
    if (
      ua.includes('HeadlessChrome') || 
      ua.includes('Puppeteer') || 
      ua.includes('Selenium') || 
      ua.includes('Playwright')
    ) {
      reasons.push('Headless automated browser engine flagged');
    }

    // 2. Resource configuration mismatch (e.g. headless setups report 0 cores or memory)
    if (details.cores !== undefined && details.cores <= 1) {
      reasons.push('Single core rendering setup (virtualization or scraper profile)');
    }
    if (details.memory !== undefined && details.memory < 2) {
      reasons.push('Insufficient RAM profile (scraping context flagged)');
    }

    // 3. UserAgent vs timezone mismatch
    // (e.g., typical corporate standard user doesn't log in with UTC unless geolocated in UTC zone)

    return {
      suspicious: reasons.length > 0,
      reasons
    };
  }
}
