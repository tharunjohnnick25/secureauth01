/**
 * AI Feature Extraction Utility
 * 
 * Extracts numerical features from raw behavior signals (typing, mouse) for AI inference.
 */

export class FeatureExtractor {
  /**
   * Extracts features from raw typing events.
   */
  public static extractTypingFeatures(events: { type: string; key: string; time: number }[]): number[] {
    const dwellTimes: number[] = [];
    const flightTimes: number[] = [];
    const keyMap = new Map<string, number>();

    events.forEach((event, i) => {
      if (event.type === 'keydown') {
        keyMap.set(event.key, event.time);
      } else if (event.type === 'keyup') {
        const downTime = keyMap.get(event.key);
        if (downTime) {
          dwellTimes.push(event.time - downTime);
          keyMap.delete(event.key);
        }
      }
      
      // Flight times logic (time between keydown n and keydown n+1)
      if (i > 0 && event.type === 'keydown') {
        flightTimes.push(event.time - events[i-1].time);
      }
    });

    // Feature set: [meanDwell, stdDwell, meanFlight, stdFlight, keyCount]
    const meanDwell = dwellTimes.reduce((a, b) => a + b, 0) / (dwellTimes.length || 1);
    const meanFlight = flightTimes.reduce((a, b) => a + b, 0) / (flightTimes.length || 1);

    return [
      meanDwell,
      meanFlight,
      dwellTimes.length
    ];
  }

  /**
   * Extracts features from mouse movement telemetry.
   */
  public static extractMouseFeatures(movements: { x: number; y: number; t: number }[]): number[] {
    if (movements.length < 2) return [0, 0, 0];

    const velocities: number[] = [];
    const accelerations: number[] = [];

    for (let i = 1; i < movements.length; i++) {
      const d = Math.sqrt(Math.pow(movements[i].x - movements[i-1].x, 2) + Math.pow(movements[i].y - movements[i-1].y, 2));
      const dt = (movements[i].t - movements[i-1].t) || 1;
      const v = d / dt;
      velocities.push(v);
      
      if (i > 1) {
          const dv = v - velocities[i-2];
          accelerations.push(dv / dt);
      }
    }

    const meanV = velocities.reduce((a, b) => a + b, 0) / velocities.length;
    const maxV = Math.max(...velocities);
    const meanA = accelerations.reduce((a, b) => a + b, 0) / (accelerations.length || 1);

    return [meanV, maxV, meanA];
  }
}
