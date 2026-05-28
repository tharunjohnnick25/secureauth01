'use client';

import Link from 'next/link'
import { ShieldAlert, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 text-center max-w-lg">
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 rounded-3xl bg-red-600/20 flex items-center justify-center border border-red-500/30 shadow-2xl shadow-red-500/20 animate-bounce">
            <ShieldAlert className="w-12 h-12 text-red-500" />
          </div>
        </div>

        <h1 className="text-6xl font-bold mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
          404
        </h1>
        <h2 className="text-2xl font-semibold mb-6 text-gray-200">
          Access Denied: Invalid Route Detected
        </h2>
        <p className="text-gray-400 mb-10 leading-relaxed">
          The requested system module is either offline, deprecated, or your current access tokens are insufficient for this endpoint. Please return to the security dashboard.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="min-w-[200px] flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Return to Safety
            </Button>
          </Link>
          <Link href="/support-tickets">
            <Button variant="outline" size="lg" className="min-w-[200px] border-white/10 hover:bg-white/5">
              Report System Bug
            </Button>
          </Link>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Core Systems: Operational
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Endpoint: Error
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
