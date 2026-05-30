/**
 * Typing Biometrics Analysis Engine
 * 
 * Analyzes keystroke timing patterns to identify users and detect anomalies.
 */

export interface TypingPattern {
  key: string;
  dwellTime: number; // Time key was held down
  flightTime: number; // Time between release and next press
}

export interface TypingBaseline {
  avgDwellTime: number;
  avgFlightTime: number;
  rhythmScore: number;
  commonLatencies: Record<string, number>;
}

export class TypingBiometricsEngine {
  /**
   * Compares current typing pattern against user baseline.
   * Returns a confidence score from 0 to 1.
   */
  public static analyze(current: TypingPattern[], baseline: TypingBaseline): number {
    if (!current || current.length === 0 || !baseline) return 0;

    let dwellMatch = 0;
    let flightMatch = 0;
    
    const currentAvgDwell = current.reduce((acc, p) => acc + p.dwellTime, 0) / current.length;
    const currentAvgFlight = current.reduce((acc, p) => acc + p.flightTime, 0) / current.length;

    // 1. Dwell Time Comparison (40% weight)
    const dwellDiff = Math.abs(currentAvgDwell - baseline.avgDwellTime);
    dwellMatch = Math.max(0, 1 - (dwellDiff / baseline.avgDwellTime));

    // 2. Flight Time Comparison (40% weight)
    const flightDiff = Math.abs(currentAvgFlight - baseline.avgFlightTime);
    flightMatch = Math.max(0, 1 - (flightDiff / baseline.avgFlightTime));

    // 3. Rhythm and Latency Analysis (20% weight)
    // In a production app, we would compare specific bigram latencies here.
    
    const confidence = (dwellMatch * 0.4) + (flightMatch * 0.4) + 0.2; // Baseline confidence
    
    return Math.min(1, confidence);
  }

  /**
   * Generates a new baseline from a set of typing samples.
   */
  public static generateBaseline(samples: TypingPattern[][]): TypingBaseline {
    const allPatterns = samples.flat();
    const avgDwellTime = allPatterns.reduce((acc, p) => acc + p.dwellTime, 0) / allPatterns.length;
    const avgFlightTime = allPatterns.reduce((acc, p) => acc + p.flightTime, 0) / allPatterns.length;

    return {
      avgDwellTime,
      avgFlightTime,
      rhythmScore: 1.0,
      commonLatencies: {}
    };
  }
}
