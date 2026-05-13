export interface DeviceFingerprint {
  userAgent: string;
  language: string;
  screenResolution: string;
  timezone: string;
  hardwareConcurrency: number;
  deviceMemory?: number;
  touchSupport: boolean;
}

export function getDeviceFingerprint(): DeviceFingerprint {
  if (typeof window === 'undefined') {
    return {
      userAgent: '',
      language: '',
      screenResolution: '',
      timezone: '',
      hardwareConcurrency: 0,
      touchSupport: false,
    };
  }

  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
    deviceMemory: (navigator as any).deviceMemory || 0,
    touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
  };
}
