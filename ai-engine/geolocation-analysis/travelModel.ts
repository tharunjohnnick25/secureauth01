/**
 * Geolocation Intelligence Model
 * 
 * Tracks geographical changes, geofence alignment, and transitions to compute Great-Circle Great Haversine
 * distance changes. Escalates threats if logins require speeds exceeding 550 mph (Impossible Travel).
 */

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

export interface LocationLoginRecord {
  timestamp: string;
  coordinates: LocationCoordinates;
  ip: string;
}

export class GeolocationAI {
  private static readonly EARTH_RADIUS_KM = 6371;

  /**
   * Compares the current login geolocations against historical sessions.
   * Returns a Location Trust Score (0-100) and details abnormal geographic changes.
   */
  public static calculateLocationTrust(
    current: LocationCoordinates,
    history: LocationLoginRecord[],
    officeGeofences?: LocationCoordinates[]
  ): { score: number; impossibleTravel: boolean; vpnDetected: boolean; reasons: string[] } {
    const reasons: string[] = [];
    let impossibleTravel = false;
    let vpnDetected = false;

    if (!current.latitude || !current.longitude) {
      return { score: 70, impossibleTravel: false, vpnDetected: false, reasons: ['Missing geolocation parameters'] };
    }

    // 1. Geofence Alignment Check (Office alignment boost)
    let alignedWithOffice = false;
    if (officeGeofences && officeGeofences.length > 0) {
      for (const office of officeGeofences) {
        const dist = this.calculateHaversineDistance(current, office);
        if (dist <= 0.5) { // within 500 meters
          alignedWithOffice = true;
          break;
        }
      }
    }

    if (history.length === 0) {
      return {
        score: alignedWithOffice ? 100 : 90,
        impossibleTravel: false,
        vpnDetected: false,
        reasons: alignedWithOffice ? ['Directly inside registered office geofence'] : ['First login from location']
      };
    }

    // 2. Impossible Travel Velocity Audit
    const lastSession = history[0];
    if (lastSession.coordinates.latitude && lastSession.coordinates.longitude) {
      const distanceKM = this.calculateHaversineDistance(current, lastSession.coordinates);
      
      const timeDiffHours = (new Date().getTime() - new Date(lastSession.timestamp).getTime()) / (1000 * 60 * 60);
      const velocityKPH = timeDiffHours > 0 ? distanceKM / timeDiffHours : 0;
      const velocityMPH = velocityKPH * 0.621371;

      // Commercial flight threshold: 550 mph (885 kph)
      if (velocityMPH > 550 && distanceKM > 200) {
        impossibleTravel = true;
        reasons.push(
          `Impossible travel detected: User logged in from ${lastSession.coordinates.city || 'Coordinates A'} and ${current.city || 'Coordinates B'} in ${timeDiffHours.toFixed(2)} hours, requiring speed of ${Math.round(velocityMPH)} mph`
        );
      } else if (distanceKM > 1000 && timeDiffHours < 2) {
        // High displacement in a short window
        reasons.push(`High geographic displacement anomaly: ${Math.round(distanceKM)} km shift in ${Math.round(timeDiffHours * 60)} minutes`);
      }
    }

    // 3. Location trust score allocation
    let score = 100;

    if (impossibleTravel) {
      score -= 55;
    } else if (reasons.length > 0) {
      score -= 25;
    }

    // Deduct slightly if far from typical hubs (if history contains multiple events)
    let matchesHistory = false;
    history.slice(0, 10).forEach(rec => {
      const dist = this.calculateHaversineDistance(current, rec.coordinates);
      if (dist < 100) matchesHistory = true; // logged in from within 100km previously
    });

    if (!matchesHistory && !alignedWithOffice) {
      score -= 15;
      reasons.push('Login location outside common geographical baseline hubs');
    }

    // 4. office geofence security adjustments
    if (alignedWithOffice) {
      score = Math.min(100, score + 15);
    }

    return {
      score: Math.min(100, Math.max(0, score)),
      impossibleTravel,
      vpnDetected,
      reasons
    };
  }

  /**
   * Great-Circle Distance via Haversine Formula
   */
  public static calculateHaversineDistance(loc1: LocationCoordinates, loc2: LocationCoordinates): number {
    const dLat = this.deg2rad(loc2.latitude - loc1.latitude);
    const dLon = this.deg2rad(loc2.longitude - loc1.longitude);

    const lat1Rad = this.deg2rad(loc1.latitude);
    const lat2Rad = this.deg2rad(loc2.latitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKM = this.EARTH_RADIUS_KM * c;

    return distanceKM;
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
