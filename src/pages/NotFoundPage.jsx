import { 
  ShieldAlert, 
  ArrowLeft, 
  Home, 
  Terminal, 
  FileQuestion, 
  AlertTriangle,
  Lock,
  Compass
} from 'lucide-react'
import { useRouter } from '../context/RouterContext'

export default function NotFoundPage() {
  const { currentPath, navigate } = useRouter()

  return (
    <div className="min-h-screen cyber-grid py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 cyber-radial-overlay pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10 text-center">
        
        {/* Glowing Top Shield / Alert Icon */}
        <div className="inline-flex p-4 rounded-3xl bg-red-950/60 border border-red-500/50 text-red-400 shadow-crimson-glow mb-6 animate-pulse">
          <ShieldAlert className="w-12 h-12" />
        </div>

        {/* Security Badge */}
        <div className="mb-4 inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-red-500/40 text-red-400 text-xs font-mono shadow-sm">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>ROUTING EXCEPTION // ANOMALOUS ENDPOINT</span>
        </div>

        {/* Prominent Error Code Heading */}
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-100 font-mono">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-red-500">
            404
          </span>
        </h1>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-2 font-mono tracking-tight">
          404 - Page Not Found
        </h2>

        {/* Description */}
        <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-lg mx-auto font-normal leading-relaxed">
          The requested cryptographic route <code className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 font-mono text-xs break-all">{currentPath || '/unknown'}</code> does not exist on the Sentinel audit mesh, has been moved, or was purged from the routing ledger.
        </p>

        {/* Simulated SOC Security Terminal Output */}
        <div className="mt-6 p-4 rounded-xl bg-slate-950/90 border border-slate-800/90 text-left font-mono text-xs max-w-xl mx-auto shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-500 text-[11px]">
            <div className="flex items-center space-x-2">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>ROUTER TELEMETRY DIAGNOSTIC</span>
            </div>
            <span className="text-red-400 font-bold">STATUS: 0x404_PAGE_NOT_FOUND</span>
          </div>
          <div className="space-y-1 text-slate-400 text-[11px]">
            <div><span className="text-cyan-400">&gt;</span> Resolution Path: <span className="text-slate-200">{currentPath || '*'}</span></div>
            <div><span className="text-cyan-400">&gt;</span> Cryptographic Anchor: <span className="text-red-400">UNMATCHED_BLOCK_DIGEST</span></div>
            <div><span className="text-cyan-400">&gt;</span> Consensus Verification: <span className="text-amber-400">No active state contract bound to this route</span></div>
            <div><span className="text-cyan-400">&gt;</span> Directive: <span className="text-emerald-400">Fail-safe fallback recommended &rarr; Return to Landing Page</span></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-mono text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-glow transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
          >
            <Home className="w-4 h-4 text-slate-950" />
            <span>Return to Landing Page</span>
          </button>

          <button
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-mono text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-all flex items-center justify-center space-x-2"
          >
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>Access Portal Login</span>
          </button>
        </div>

        {/* Footer Audit Meta */}
        <div className="mt-10 text-xs font-mono text-slate-600">
          GovChain Sentinel Security Protocol // All unmapped requests logged for intrusion monitoring
        </div>

      </div>
    </div>
  )
}
