/**
 * Typing Biometrics ML Model
 * 
 * Analyzes keystroke timing dynamics to verify identity using vector cosine similarity
 * on dwell times (hold times), flight latencies (transition times), and typing speeds.
 */

export interface KeystrokeEvent {
  key: string;
  pressTime: number;
  releaseTime: number;
  dwellTime: number;  // hold time: releaseTime - pressTime
  flightTime: number; // transition latency: pressTime_n - releaseTime_n-1
}

export interface TypingProfile {
  avgDwellTime: number;
  avgFlightTime: number;
  typingSpeedWPM: number;
  rhythmVector: number[]; // relative key transition weightings
  digramLatencies: Record<string, number>; // common letter pairings (e.g. "th", "in", "er")
}

export class TypingBiometricsAI {
  /**
   * Compares the current typing keystrokes against a user's compiled historical profile.
   * Returns a Behavior Match Score from 0 to 100.
   */
  public static calculateMatchScore(
    events: KeystrokeEvent[],
    baseline: TypingProfile
  ): number {
    if (!events || events.length < 4 || !baseline) {
      return 50; // Neutral score if data is insufficient
    }

    // 1. Calculate current aggregates
    const totalDwell = events.reduce((acc, ev) => acc + ev.dwellTime, 0);
    const avgDwell = totalDwell / events.length;

    const flights = events.map(ev => ev.flightTime).filter(f => f > 0);
    const avgFlight = flights.length > 0 ? flights.reduce((acc, f) => acc + f, 0) / flights.length : 150;

    // Calculate typing speed (WPM estimation)
    // 1 word = 5 characters on average. Total time in minutes.
    const startTime = events[0].pressTime;
    const endTime = events[events.length - 1].releaseTime;
    const totalTimeMin = (endTime - startTime) / 60000;
    const currentWPM = totalTimeMin > 0 ? (events.length / 5) / totalTimeMin : 40;

    // 2. Compute feature vectors for similarity comparison
    // Vector 1 (Current): [avgDwell, avgFlight, currentWPM]
    // Vector 2 (Baseline): [avgDwellTime, avgFlightTime, typingSpeedWPM]
    const currentVector = [avgDwell, avgFlight, currentWPM];
    const baselineVector = [baseline.avgDwellTime, baseline.avgFlightTime, baseline.typingSpeedWPM];

    // Compute cosine similarity between overall timing vectors
    const cosineSim = this.computeCosineSimilarity(currentVector, baselineVector);

    // 3. Digram Latency Match (if baseline has common latencies recorded)
    let digramMatchCount = 0;
    let digramDiffSum = 0;

    for (let i = 1; i < events.length; i++) {
      const char1 = events[i - 1].key.toLowerCase();
      const char2 = events[i].key.toLowerCase();
      const pair = `${char1}${char2}`;

      if (baseline.digramLatencies && baseline.digramLatencies[pair] !== undefined) {
        const currentLatency = events[i].pressTime - events[i - 1].releaseTime;
        const expectedLatency = baseline.digramLatencies[pair];

        const difference = Math.abs(currentLatency - expectedLatency);
        const matchPct = Math.max(0, 1 - (difference / Math.max(expectedLatency, 1)));
        
        digramDiffSum += matchPct;
        digramMatchCount++;
      }
    }

    const digramScore = digramMatchCount > 0 ? (digramDiffSum / digramMatchCount) : cosineSim;

    // Weighted final match score: 60% macro timings (cosine similarity), 40% micro pairings (digram latencies)
    const rawMatchPercentage = (cosineSim * 0.6) + (digramScore * 0.4);
    
    // Convert to 0-100 range and round
    const matchScore = Math.round(Math.min(100, Math.max(0, rawMatchPercentage * 100)));

    return matchScore;
  }

  /**
   * Generates a new compiled Typing Profile from multiple typing samples.
   */
  public static compileProfile(samples: KeystrokeEvent[][]): TypingProfile {
    const flatEvents = samples.flat();
    if (flatEvents.length === 0) {
      return { avgDwellTime: 80, avgFlightTime: 120, typingSpeedWPM: 50, rhythmVector: [1, 1, 1], digramLatencies: {} };
    }

    const avgDwellTime = flatEvents.reduce((acc, ev) => acc + ev.dwellTime, 0) / flatEvents.length;
    
    const flights = flatEvents.map(ev => ev.flightTime).filter(f => f > 0);
    const avgFlightTime = flights.length > 0 ? flights.reduce((acc, f) => acc + f, 0) / flights.length : 120;

    // Calculate words per minute
    let wpmSum = 0;
    samples.forEach(sample => {
      if (sample.length < 2) return;
      const tMin = (sample[sample.length - 1].releaseTime - sample[0].pressTime) / 60000;
      if (tMin > 0) wpmSum += (sample.length / 5) / tMin;
    });
    const typingSpeedWPM = samples.length > 0 ? Math.round(wpmSum / samples.length) : 55;

    // Map digram latencies
    const digrams: Record<string, number[]> = {};
    samples.forEach(sample => {
      for (let i = 1; i < sample.length; i++) {
        const p = `${sample[i-1].key.toLowerCase()}${sample[i].key.toLowerCase()}`;
        const lat = sample[i].pressTime - sample[i-1].releaseTime;
        if (!digrams[p]) digrams[p] = [];
        digrams[p].push(lat);
      }
    });

    const digramLatencies: Record<string, number> = {};
    Object.keys(digrams).forEach(pair => {
      const vals = digrams[pair];
      // Limit to pairings with at least 2 instances to avoid outliers
      if (vals.length >= 2) {
        digramLatencies[pair] = vals.reduce((a, b) => a + b, 0) / vals.length;
      }
    });

    return {
      avgDwellTime,
      avgFlightTime,
      typingSpeedWPM: Math.max(20, typingSpeedWPM),
      rhythmVector: [avgDwellTime, avgFlightTime, typingSpeedWPM],
      digramLatencies
    };
  }

  /**
   * Vector Mathematics Cosine Similarity Helper
   */
  private static computeCosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}
