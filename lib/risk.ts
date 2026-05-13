export interface RiskInput {
  ip: string;
  location: {
    country: string;
    city: string;
    lat: number;
    lng: number;
  };
  fingerprint: {
    browser: string;
    os: string;
    screen: string;
    hash: string;
  };
  typingMetrics: {
    dwellTime: number;
    flightTime: number;
    accuracy: number;
  };
  history?: {
    lastIp: string;
    lastLat: number;
    lastLng: number;
    lastLogin: string;
    trustedDevices: string[];
  };
}

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export function calculateRiskScore(input: RiskInput): { score: number; level: RiskLevel; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // 1. Device Trust (High Weight)
  if (input.history?.trustedDevices && !input.history.trustedDevices.includes(input.fingerprint.hash)) {
    score += 40;
    reasons.push('Unrecognized device detected');
  }

  // 2. IP Anomaly
  if (input.history?.lastIp && input.history.lastIp !== input.ip) {
    score += 15;
    reasons.push('New IP address');
  }

  // 3. Location & Impossible Travel (Highest Weight)
  if (input.history?.lastLat && input.history?.lastLng) {
    const distance = calculateDistance(
      input.history.lastLat,
      input.history.lastLng,
      input.location.lat,
      input.location.lng
    );

    const timeDiffHours = (new Date().getTime() - new Date(input.history.lastLogin).getTime()) / (1000 * 60 * 60);
    const speed = distance / timeDiffHours;

    if (speed > 800) { // Over 800 km/h (Commercial Jet Speed)
      score += 60;
      reasons.push('Impossible travel detected');
    } else if (distance > 500) {
      score += 20;
      reasons.push('Significant location change');
    }
  }

  // 4. Typing Behavior Biometrics
  if (input.typingMetrics.accuracy < 0.7) {
    score += 10;
    reasons.push('Unusual typing accuracy');
  }
  
  if (input.typingMetrics.dwellTime > 200 || input.typingMetrics.dwellTime < 50) {
    score += 10;
    reasons.push('Typing cadence anomaly');
  }

  // Determine Level
  let level: RiskLevel = 'low';
  if (score >= 70) level = 'critical';
  else if (score >= 40) level = 'high';
  else if (score >= 20) level = 'medium';

  return { score, level, reasons };
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function shouldTriggerBiometrics(level: RiskLevel): boolean {
  return level === 'high' || level === 'critical' || level === 'medium';
}
