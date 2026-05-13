import { useState, useCallback } from 'react';

export interface TypingMetrics {
  dwellTime: number[];
  flightTime: number[];
}

export function useTypingBehavior() {
  const [metrics, setMetrics] = useState<TypingMetrics>({
    dwellTime: [],
    flightTime: [],
  });
  const [lastKeyDown, setLastKeyDown] = useState<number | null>(null);
  const [lastKeyUp, setLastKeyUp] = useState<number | null>(null);

  const handleKeyDown = useCallback(() => {
    const now = Date.now();
    if (lastKeyUp) {
      setMetrics((prev) => ({
        ...prev,
        flightTime: [...prev.flightTime, now - lastKeyUp],
      }));
    }
    setLastKeyDown(now);
  }, [lastKeyUp]);

  const handleKeyUp = useCallback(() => {
    const now = Date.now();
    if (lastKeyDown) {
      setMetrics((prev) => ({
        ...prev,
        dwellTime: [...prev.dwellTime, now - lastKeyDown],
      }));
    }
    setLastKeyUp(now);
  }, [lastKeyDown]);

  const resetMetrics = () => {
    setMetrics({ dwellTime: [], flightTime: [] });
    setLastKeyDown(null);
    setLastKeyUp(null);
  };

  return { metrics, handleKeyDown, handleKeyUp, resetMetrics };
}
