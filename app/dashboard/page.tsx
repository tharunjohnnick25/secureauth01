'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import RiskDashboard from '@/components/dashboard/RiskDashboard';

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen w-full bg-[var(--color-cyber-dark)] text-white p-6 md:p-12">
        <header className="mb-10 flex justify-between items-end border-b border-white/10 pb-4">
          <div>
            <h1 className="text-4xl font-bold font-cyber text-glow">Control Center</h1>
            <p className="text-gray-400 mt-2">Security Analytics & Session Overview</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm px-3 py-1 bg-[var(--color-cyber-green)]/10 text-[var(--color-cyber-green)] rounded-full border border-[var(--color-cyber-green)]/30 shadow-[0_0_10px_rgba(0,255,102,0.2)]">System Active</span>
          </div>
        </header>

        <RiskDashboard />
      </div>
    </AuthGuard>
  );
}
