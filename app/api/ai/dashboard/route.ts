import { NextResponse } from 'next/server';
import { TelemetryAggregatorAI } from '@/ai-engine/analytics/telemetry';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = await TelemetryAggregatorAI.getDashboardStats();
    return NextResponse.json(stats);
  } catch (err: any) {
    console.error('Failed to compile dashboard AI telemetry: ', err.message);
    return NextResponse.json(
      { error: err.message || 'Telemetry compilation failed' },
      { status: 500 }
    );
  }
}
