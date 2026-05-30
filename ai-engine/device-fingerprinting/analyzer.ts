/**
 * Device Fingerprinting AI
 * 
 * Generates and analyzes unique device signatures to identify cloned or suspicious devices.
 */



export interface FingerprintDetails {
  userAgent: string;
  os: string;
  browser: string;
  screenResolution: string;
  timezone: string;
  language: string;
  gpu?: string;
  memory?: number;
  cores?: number;
  canvas?: string; // Canvas fingerprinting data
}

export class DeviceFingerprintAI {
  /**
   * Generates a unique hash for a device based on its hardware and software characteristics.
   */
  public static generateHash(details: FingerprintDetails): string {
    const data = JSON.stringify({
      ua: details.userAgent,
      res: details.screenResolution,
      tz: details.timezone,
      lang: details.language,
      gpu: details.gpu,
      mem: details.memory,
      cores: details.cores,
      canvas: details.canvas
    });

    // Simple hash (using plain JS or crypto if available in env)
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Compares two fingerprints and returns a similarity score (0-1).
   */
  public static compare(f1: FingerprintDetails, f2: FingerprintDetails): number {
    let matches = 0;
    const fields: (keyof FingerprintDetails)[] = ['os', 'browser', 'screenResolution', 'timezone', 'language', 'gpu', 'memory', 'cores'];
    
    fields.forEach(field => {
      if (f1[field] === f2[field]) matches++;
    });

    return matches / fields.length;
  }

  /**
   * Detects if the device environment looks suspicious (e.g., headless browser, virtualization).
   */
  public static isSuspicious(details: FingerprintDetails): { suspicious: boolean; reasons: string[] } {
    const reasons: string[] = [];
    
    // 1. Headless Detection
    if (details.userAgent.includes('Headless') || details.userAgent.includes('Electron')) {
      reasons.push('Headless browser or non-standard environment detected');
    }

    // 2. Resource Anomaly
    if (details.memory && details.memory < 1) {
      reasons.push('Unusually low device memory reported');
    }

    // 3. Inconsistent User Agent vs Reality (Can be expanded)
    
    return {
      suspicious: reasons.length > 0,
      reasons
    };
  }
}
