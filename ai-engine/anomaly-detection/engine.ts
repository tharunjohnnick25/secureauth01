/**
 * Anomaly Detection Engine
 * 
 * Uses statistical methods to detect outliers in user behavior and login patterns.
 */

export interface LoginEvent {
  timestamp: string;
  success: boolean;
  ip: string;
  location: string;
}

export class AnomalyDetectionEngine {
  /**
   * Detects unusual login hours based on historical data.
   */
  public static detectTimeAnomaly(history: LoginEvent[]): { isAnomaly: boolean; confidence: number } {
    if (history.length < 5) return { isAnomaly: false, confidence: 0 };

    const hours = history.map(h => new Date(h.timestamp).getHours());
    
    // Calculate mean and standard deviation of login hours
    const mean = hours.reduce((a, b) => a + b) / hours.length;
    const sqDiffs = hours.map(h => Math.pow(h - mean, 2));
    const stdDev = Math.sqrt(sqDiffs.reduce((a, b) => a + b) / hours.length);

    const currentHour = new Date().getHours();
    const zScore = Math.abs(currentHour - mean) / (stdDev || 1);

    // If more than 2 standard deviations away, it's an anomaly
    return {
      isAnomaly: zScore > 2.5,
      confidence: Math.min(1, zScore / 5)
    };
  }

  /**
   * Detects brute force attempts or rapid login spikes.
   */
  public static detectVolumetricAnomaly(recentEvents: LoginEvent[]): { isAnomaly: boolean; severity: 'MEDIUM' | 'HIGH' } {
    const failedOnes = recentEvents.filter(e => !e.success);
    
    if (failedOnes.length > 10) return { isAnomaly: true, severity: 'HIGH' };
    if (failedOnes.length > 5) return { isAnomaly: true, severity: 'MEDIUM' };
    
    return { isAnomaly: false, severity: 'MEDIUM' };
  }
}
