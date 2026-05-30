// @ts-nocheck
/**
 * Offline Model Training System
 * 
 * Aggregates raw historical logs from Supabase tables (login_logs, behavior_history, devices)
 * to compile and train user baseline profiles, biometrics templates, and statistical centroids.
 */

import { supabase } from '@/lib/supabase';
import { TypingBiometricsAI, KeystrokeEvent } from '../typing-biometrics/biometrics';
import { BehaviorProfilerAI, RawTelemetryLog } from '../behavioral-analysis/scheduler';
import { OutlierDetectionAI, TelemetryFeatureVector } from '../anomaly-detection/outlierModel';

export class ModelTrainerAI {
  /**
   * Triggers periodic model retraining for a specific user.
   * Compiles new centroids, baseline schedules, and biometrics templates, writing directly to Supabase.
   */
  public static async trainUserModel(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      // 1. Fetch raw logs from Database
      const [loginLogsRes, biometricsHistoryRes] = await Promise.all([
        supabase
          .from('login_logs')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(100),
        supabase
          .from('behavioral_biometrics') // historical rolling keystrokes
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(20)
      ]);

      if (loginLogsRes.error) throw new Error(`Failed to fetch login logs: ${loginLogsRes.error.message}`);
      
      const rawLogs: any[] = loginLogsRes.data || [];
      const biometricsLogs: any[] = biometricsHistoryRes.data || [];

      // 2. Train and Compile Outlier Centroid (Anomaly Model)
      const telemetryFeatures: TelemetryFeatureVector[] = rawLogs.map(log => {
        const date = new Date(log.created_at);
        return {
          hourOfDay: date.getHours(),
          dayOfWeek: date.getDay(),
          distanceFromHome: log.location?.distanceKM || 0, // calculated from office hub
          untrustedDevicePenalty: log.status === 'FAILURE' ? 1 : 0
        };
      });

      const trainedCentroid = OutlierDetectionAI.compileCentroid(telemetryFeatures);

      // 3. Train and Compile Behavioral Baseline Profile
      const profilerTelemetry: RawTelemetryLog[] = rawLogs.map(log => ({
        timestamp: log.created_at,
        ip: log.ip_address,
        locationCity: log.location?.city,
        locationCountry: log.location?.country,
        isSuccess: log.status === 'SUCCESS',
        deviceHash: log.device_id || ''
      }));

      const trainedBehavior = BehaviorProfilerAI.compileProfile(userId, profilerTelemetry);

      // 4. Train Typing Biometrics Template (if sample data exists)
      let trainedTypingBaseline = {};
      if (biometricsLogs.length > 0) {
        // Map raw data array into samples
        const keystrokeSamples: KeystrokeEvent[][] = biometricsLogs.map(log => {
          const raw = log.raw_data as any[];
          return raw.map(k => ({
            key: k.key || 'a',
            pressTime: k.pressTime || 0,
            releaseTime: k.releaseTime || 0,
            dwellTime: k.dwellTime || 80,
            flightTime: k.flightTime || 120
          }));
        });

        trainedTypingBaseline = TypingBiometricsAI.compileProfile(keystrokeSamples);
      }

      // 5. Persist the updated models into `behavioral_profiles` table
      const { error: upsertError } = await supabase
        .from('behavioral_profiles')
        .upsert({
          user_id: userId,
          typing_baseline: trainedTypingBaseline,
          mouse_baseline: { trainedAt: new Date().toISOString() }, // placeholder
          login_patterns: {
            commonHours: trainedBehavior.commonHours,
            loginFrequencyDaily: trainedBehavior.loginFrequencyDaily,
            preferredLocations: trainedBehavior.preferredLocations,
            trustedDeviceHashes: trainedBehavior.trustedDeviceHashes,
            attendanceHabits: trainedBehavior.attendanceHabits,
            centroid: trainedCentroid
          },
          trust_score: 100.0,
          last_updated: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (upsertError) throw new Error(`Failed to save trained profile: ${upsertError.message}`);

      // Log training operational event in ML ledger
      await supabase.from('ml_predictions').insert({
        user_id: userId,
        model_name: 'TrainerPipeline',
        inputs: { logSamplesCount: rawLogs.length, biometricsCount: biometricsLogs.length },
        outputs: { status: 'SUCCESS', trainedHours: trainedBehavior.commonHours }
      });

      return {
        success: true,
        message: `Offline model training successfully calibrated for user ${userId}. Compiled ${rawLogs.length} events.`
      };
    } catch (err: any) {
      console.error('Error training models:', err.message);
      return { success: false, message: err.message || 'Model training failed' };
    }
  }
}
