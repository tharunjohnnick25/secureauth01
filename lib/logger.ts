type Level = 'debug' | 'info' | 'warn' | 'error';

const isProduction = process.env.NODE_ENV === 'production';

export function log(level: Level, scope: string, message: string, meta?: Record<string, unknown>) {
  try {
    const entry = { level, scope, message, meta: meta ?? {}, ts: new Date().toISOString() };

    if (isProduction) {
      // In production, keep logs minimal and avoid leaking secrets.
      if (level === 'error' || level === 'warn') {
        // send to a server-side logging endpoint or external provider
        // For now, fallback to console.error for critical logs.
        console.error(JSON.stringify(entry));
      } else {
        // reduce console noise in production
        // no-op or send to external provider
      }
    } else {
      // Development friendly logging
      if (level === 'error') console.error(`[${scope}] ${message}`, meta ?? {});
      else if (level === 'warn') console.warn(`[${scope}] ${message}`, meta ?? {});
      else if (level === 'debug') console.debug(`[${scope}] ${message}`, meta ?? {});
      else console.info(`[${scope}] ${message}`, meta ?? {});
    }
  } catch (e) {
    // Swallow logging errors to avoid interfering with app flow
    // eslint-disable-next-line no-console
    console.error('Logger failure', e);
  }
}
