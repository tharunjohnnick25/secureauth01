/**
 * Training Data Generator
 * 
 * Extracts historical logs from the database to create training datasets for the local AI.
 */

export interface RawLog {
  id: string;
  user_id: string;
  success: boolean;
  dwellTime?: number;
  flightTime?: number;
  ip_address?: string;
}

export class DataGenerator {
  /**
   * Transforms raw database logs into a normalized dataset for training.
   */
  public static generateDataset(logs: RawLog[]): any {
    const dataset = logs.map(log => ({
      label: log.success ? 1 : 0,
      features: [
        log.dwellTime || 0,
        log.flightTime || 0,
        // add more features extracted from logs
      ]
    }));

    return {
      samples: dataset.length,
      data: dataset,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Exports dataset to JSON or CSV for local training.
   */
  public static export(dataset: any, format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(dataset, null, 2);
    }
    // implementation for CSV export
    return '';
  }
}
