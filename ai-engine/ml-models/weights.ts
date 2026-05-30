/**
 * Machine Learning Model Settings & Threshold Configurations
 * 
 * Stores local thresholds, Bayesian weights, and outlines configurations preparing the app 
 * for downstream neural networks (TensorFlow / PyTorch / LSTM / Transformer sequence pipelines).
 */

export interface ModelThresholdConfig {
  typingConfidenceThreshold: number; // minimum Cosine Similarity to trust typing
  deviceTrustThreshold: number;      // minimum similarity to auto-trust hardware
  impossibleTravelSpeedLimitMPH: number; // commercial aviation standard threshold (mph)
  bayesianPriorCompromise: number;   // corporate background compromise rate P(C)
  anomalyZScoreLimit: number;        // outlier detection standard deviation boundary
  rateLimitAttemptsWindow: number;   // rate limiting attempts range
}

export const ML_CONFIG: ModelThresholdConfig = {
  typingConfidenceThreshold: 70, 
  deviceTrustThreshold: 92,
  impossibleTravelSpeedLimitMPH: 550,
  bayesianPriorCompromise: 0.02, // 2% background threat probability
  anomalyZScoreLimit: 2.5, // outlier limit
  rateLimitAttemptsWindow: 5
};

/**
 * FUTURE DEEP LEARNING (DL) ARCHITECTURE INTERFACE
 * 
 * Prepares raw user sequence telemetry data vectors.
 * Downstream deep learning python servers can ingest these configurations to train:
 * - LSTM (Long Short-Term Memory) sequential keystroke rhythm classification
 * - Transformer behavioral sequence anomaly detectors
 */
export interface DeepLearningInputSequence {
  userId: string;
  sequenceLength: number;
  telemetryFeatures: Array<{
    timestamp: string;
    keystrokeRhythmVector: number[]; // 10-dimensional key-event sequence
    mouseTransitionVelocity: number;  // mouse trajectory velocity
    actionCode: number;              // standardized activity event enumeration
  }>;
}

export class DeepLearningScaffold {
  /**
   * Helper to format raw database telemetry into standard sequential floats for DL servers.
   */
  public static serializeSequence(
    userId: string,
    historyEvents: any[]
  ): DeepLearningInputSequence {
    const telemetryFeatures = historyEvents.map(ev => ({
      timestamp: ev.created_at || new Date().toISOString(),
      keystrokeRhythmVector: ev.typingMetrics?.map((m: any) => m.dwellTime) || [80, 120, 100],
      mouseTransitionVelocity: Number(ev.mouseVelocity) || 1.2,
      actionCode: ev.action === 'login_attempt' ? 1 : 2
    }));

    return {
      userId,
      sequenceLength: telemetryFeatures.length,
      telemetryFeatures
    };
  }
}
