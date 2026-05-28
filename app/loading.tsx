export default function Loading() {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-t-2 border-l-2 border-blue-500 animate-spin" style={{ animationDuration: '0.8s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {/* Pure SVG shield icon — no lucide-react import needed in Server Component */}
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
            </svg>
          </div>
        </div>
        <h2 className="mt-4 text-sm font-semibold text-white/60 tracking-widest uppercase">Loading...</h2>
      </div>
    </div>
  );
}
