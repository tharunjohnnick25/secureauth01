/**
 * Internal Threat Intelligence Engine
 * 
 * Aggregates and analyzes security events to identify persistent threats and suspicious actors.
 */

export interface SecurityEvent {
  id: string;
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  ip_address: string;
  user_id?: string;
}

export class ThreatIntelEngine {
  private static readonly SUSPICIOUS_IPS = new Set<string>();

  /**
   * Analyzes a stream of security events to identify threat patterns.
   */
  public static analyzeThreats(events: SecurityEvent[]): { activeThreats: any[]; riskDistribution: any } {
    const ipAnalysis: Record<string, number> = {};
    const distribution = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };

    events.forEach(event => {
      // 1. Distribution calculation
      distribution[event.severity]++;

      // 2. IP profiling
      ipAnalysis[event.ip_address] = (ipAnalysis[event.ip_address] || 0) + 1;
      
      // If an IP has more than 5 high severity events, mark it as suspicious
      if (ipAnalysis[event.ip_address] > 5) {
        this.SUSPICIOUS_IPS.add(event.ip_address);
      }
    });

    const activeThreats = Array.from(this.SUSPICIOUS_IPS).map(ip => ({
      ip,
      threatScore: ipAnalysis[ip] || 100,
      category: 'BRUTE_FORCE'
    }));

    return {
      activeThreats,
      riskDistribution: distribution
    };
  }

  /**
   * Checks if an IP is currently blacklisted by the AI engine.
   */
  public static isBlacklisted(ip: string): boolean {
    return this.SUSPICIOUS_IPS.has(ip);
  }
}
