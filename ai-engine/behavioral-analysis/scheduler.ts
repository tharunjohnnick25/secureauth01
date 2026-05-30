/**
 * User Behavior Profile compiler
 * 
 * Aggregates raw history logs (login events, office access logs, attendance timestamps) 
 * into standardized behavioral baselines stored in JSONB.
 */

export interface RawTelemetryLog {
  timestamp: string;
  ip: string;
  locationCity?: string;
  locationCountry?: string;
  isSuccess: boolean;
  deviceHash: string;
  officeAccessType?: 'ENTRY' | 'EXIT';
}

export interface CompiledBehaviorProfile {
  user_id: string;
  commonHours: number[]; // top 3 active hour blocks (0-23)
  loginFrequencyDaily: number; // average attempts per day
  preferredLocations: string[]; // country/city list
  trustedDeviceHashes: string[]; // device hashes
  attendanceHabits: {
    avgCheckInHour: number;
    avgShiftDurationHours: number;
  };
  lastUpdated: string;
}

export class BehaviorProfilerAI {
  /**
   * Translates raw historical access logs into a standardized behavioral baseline profile.
   */
  public static compileProfile(
    userId: string,
    logs: RawTelemetryLog[]
  ): CompiledBehaviorProfile {
    if (!logs || logs.length === 0) {
      return {
        user_id: userId,
        commonHours: [9, 13, 17], // Corporate default anchors
        loginFrequencyDaily: 1.5,
        preferredLocations: [],
        trustedDeviceHashes: [],
        attendanceHabits: { avgCheckInHour: 9.0, avgShiftDurationHours: 8.5 },
        lastUpdated: new Date().toISOString()
      };
    }

    // 1. Calculate preferred login hours
    const hourCounts: Record<number, number> = {};
    logs.forEach(log => {
      const h = new Date(log.timestamp).getHours();
      hourCounts[h] = (hourCounts[h] || 0) + 1;
    });

    const sortedHours = Object.keys(hourCounts)
      .map(Number)
      .sort((a, b) => hourCounts[b] - hourCounts[a]);
    
    // Pick the top 3 most common hours
    const commonHours = sortedHours.slice(0, 3);
    if (commonHours.length === 0) commonHours.push(9, 13, 17);

    // 2. Map preferred locations
    const locCounts: Record<string, number> = {};
    logs.forEach(log => {
      if (log.locationCity) {
        const key = `${log.locationCity}, ${log.locationCountry || ''}`;
        locCounts[key] = (locCounts[key] || 0) + 1;
      }
    });

    const preferredLocations = Object.keys(locCounts)
      .sort((a, b) => locCounts[b] - locCounts[a])
      .slice(0, 5);

    // 3. Compile trusted device hashes
    const devCounts: Record<string, number> = {};
    logs.forEach(log => {
      if (log.deviceHash) {
        devCounts[log.deviceHash] = (devCounts[log.deviceHash] || 0) + 1;
      }
    });

    // Devices used at least twice are considered trusted baseline
    const trustedDeviceHashes = Object.keys(devCounts).filter(hash => devCounts[hash] >= 2);

    // 4. attendance/check-in habits
    // Filter office entries to estimate check-in and shift averages
    const entryLogs = logs.filter(log => log.officeAccessType === 'ENTRY');
    const avgCheckInHour = entryLogs.length > 0
      ? entryLogs.reduce((acc, log) => acc + new Date(log.timestamp).getHours(), 0) / entryLogs.length
      : 9.0;

    // Daily login frequency calculation
    const uniqueDays = new Set(logs.map(log => log.timestamp.split('T')[0])).size;
    const loginFrequencyDaily = uniqueDays > 0 ? logs.length / uniqueDays : 1.0;

    return {
      user_id: userId,
      commonHours,
      loginFrequencyDaily: Math.round(loginFrequencyDaily * 10) / 10,
      preferredLocations,
      trustedDeviceHashes: trustedDeviceHashes.length > 0 ? trustedDeviceHashes : Array.from(new Set(logs.map(l => l.deviceHash))),
      attendanceHabits: {
        avgCheckInHour: Math.round(avgCheckInHour * 10) / 10,
        avgShiftDurationHours: 8.5 // Standard baseline fallback
      },
      lastUpdated: new Date().toISOString()
    };
  }
}
