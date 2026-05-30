/**
 * Local Outlier Anomaly ML Model
 * 
 * Implements multi-variate anomaly detection (Z-score and Euclidean distance from historical centroids)
 * designed to simulate Isolation Forest / Local Outlier Factor without external packages.
 */

export interface TelemetryFeatureVector {
  hourOfDay: number;    // 0 to 23
  dayOfWeek: number;    // 0 to 6 (Sunday-Saturday)
  distanceFromHome: number; // km
  untrustedDevicePenalty: number; // 0 (trusted) or 1 (untrusted)
}

export interface OutlierProfileCentroid {
  meanHour: number;
  meanDay: number;
  meanDistance: number;
  stdDevHour: number;
  stdDevDistance: number;
  sampleSize: number;
}

export class OutlierDetectionAI {
  /**
   * Evaluates the feature vector against the user's historical baseline.
   * Returns a normalized Anomaly Score (0 to 100).
   */
  public static calculateAnomalyScore(
    current: TelemetryFeatureVector,
    baseline: OutlierProfileCentroid | null
  ): { score: number; isAnomaly: boolean; confidence: number; factors: string[] } {
    const factors: string[] = [];

    if (!baseline || baseline.sampleSize < 4) {
      // Not enough data to compute outlier distances. Default low risk.
      return { score: 10, isAnomaly: false, confidence: 0, factors: ['Establishing behavioral baseline'] };
    }

    // 1. Time Anomaly Heuristic (Standard Deviation Deviation Z-Score)
    // Hour space is cyclical (0-23). We calculate shortest circular distance.
    const hourDiff = this.getCircularDifference(current.hourOfDay, baseline.meanHour, 24);
    const hourZScore = baseline.stdDevHour > 0 ? Math.abs(hourDiff) / baseline.stdDevHour : 0;

    let timeAnomaly = false;
    if (hourZScore > 2.5) {
      timeAnomaly = true;
      factors.push(`Atypical login hour: Z-score is ${hourZScore.toFixed(2)} (logs occur at unusual times)`);
    }

    // 2. Proximity Anomaly Heuristic
    const distDiff = Math.abs(current.distanceFromHome - baseline.meanDistance);
    const distZScore = baseline.stdDevDistance > 0 ? distDiff / baseline.stdDevDistance : 0;

    let locationAnomaly = false;
    if (distZScore > 3.0 && current.distanceFromHome > 150) {
      locationAnomaly = true;
      factors.push(`Unusual geographic range: Z-score of ${distZScore.toFixed(2)} (${Math.round(current.distanceFromHome)} km from typical core)`);
    }

    // 3. Multi-variate Outlier Index (Euclidean Distance from Centroid)
    // Normalize coordinates: Hour (0-1), Day (0-1), Distance (scaled), Device Penalty (0-1)
    const normCurrent = [
      current.hourOfDay / 24,
      current.dayOfWeek / 7,
      Math.min(1000, current.distanceFromHome) / 1000,
      current.untrustedDevicePenalty
    ];

    const normCentroid = [
      baseline.meanHour / 24,
      baseline.meanDay / 7,
      Math.min(1000, baseline.meanDistance) / 1000,
      0 // Trusted device baseline anchor
    ];

    let distanceSquareSum = 0;
    for (let i = 0; i < normCurrent.length; i++) {
      distanceSquareSum += Math.pow(normCurrent[i] - normCentroid[i], 2);
    }
    const euclideanDistance = Math.sqrt(distanceSquareSum);

    // Max theoretical distance in normalized 4D space is 2.0. Scale anomaly index accordingly.
    const anomalyIndex = euclideanDistance / 2.0;
    let score = Math.round(anomalyIndex * 100);

    // Dynamic scaling based on Z-Score flags
    if (timeAnomaly) score = Math.max(score, 45);
    if (locationAnomaly) score = Math.max(score, 60);
    if (current.untrustedDevicePenalty > 0) {
      score = Math.min(100, score + 20);
      factors.push('Login event initiated from unrecognized hardware token');
    }

    const finalScore = Math.min(100, Math.max(0, score));
    const isAnomaly = finalScore >= 60;

    return {
      score: finalScore,
      isAnomaly,
      confidence: Math.min(1.0, isAnomaly ? (finalScore / 100) * 1.2 : finalScore / 100),
      factors
    };
  }

  /**
   * Generates a new Outlier Profile Centroid from historical login coordinates.
   */
  public static compileCentroid(history: TelemetryFeatureVector[]): OutlierProfileCentroid {
    const sampleSize = history.length;
    if (sampleSize === 0) {
      return { meanHour: 12, meanDay: 3, meanDistance: 0, stdDevHour: 3, stdDevDistance: 10, sampleSize: 0 };
    }

    const meanHour = history.reduce((acc, h) => acc + h.hourOfDay, 0) / sampleSize;
    const meanDay = history.reduce((acc, h) => acc + h.dayOfWeek, 0) / sampleSize;
    const meanDistance = history.reduce((acc, h) => acc + h.distanceFromHome, 0) / sampleSize;

    // Standard deviation computations
    const hourVariance = history.reduce((acc, h) => acc + Math.pow(this.getCircularDifference(h.hourOfDay, meanHour, 24), 2), 0) / sampleSize;
    const stdDevHour = Math.sqrt(hourVariance) || 2.0;

    const distVariance = history.reduce((acc, h) => acc + Math.pow(h.distanceFromHome - meanDistance, 2), 0) / sampleSize;
    const stdDevDistance = Math.sqrt(distVariance) || 25.0;

    return {
      meanHour,
      meanDay,
      meanDistance,
      stdDevHour,
      stdDevDistance,
      sampleSize
    };
  }

  /**
   * Helper to handle shortest circular paths on coordinate dials (like hours)
   */
  private static getCircularDifference(val1: number, val2: number, modulo: number): number {
    const diff = Math.abs(val1 - val2) % modulo;
    return diff > modulo / 2 ? modulo - diff : diff;
  }
}
