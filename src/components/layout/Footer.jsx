import { ShieldCheck, Database, Cpu, Activity, Lock } from 'lucide-react'
import { useRouter } from '../../context/RouterContext'
import { useAudit } from '../../context/AuditContext'

export default function Footer() {
  const { navigate } = useRouter()
  const { logs } = useAudit()
  const latestBlockHeight = logs.length > 0 ? logs[logs.length - 1].blockHeight : 1006

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90 text-slate-400 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top SOC Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-8 mb-8 border-b border-slate-800/60 font-mono text-xs">
          <div className="flex items-center space-x-3 bg-slate-900/40 p-3 rounded-lg border border-slate-800">
            <Activity className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <div className="text-slate-500 text-[10px] uppercase">Node Consensus</div>
              <div className="text-slate-200 font-semibold">12 Federal Nodes (100%)</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-slate-900/40 p-3 rounded-lg border border-slate-800">
            <Database className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-slate-500 text-[10px] uppercase">Chain Block Height</div>
              <div className="text-slate-200 font-semibold">#{latestBlockHeight} Active</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-slate-900/40 p-3 rounded-lg border border-slate-800">
            <Cpu className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <div className="text-slate-500 text-[10px] uppercase">Cryptographic Engine</div>
              <div className="text-slate-200 font-semibold">SHA-256 + Merkle Tree</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-slate-900/40 p-3 rounded-lg border border-slate-800">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-slate-500 text-[10px] uppercase">Compliance Mandate</div>
              <div className="text-slate-200 font-semibold">SOC-2 Type II Verified</div>
            </div>
          </div>
        </div>

        {/* Links and Disclaimers */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="text-sm font-bold text-slate-200 tracking-wider">
              GOVCHAIN <span className="text-cyan-400 font-mono">SENTINEL</span>
            </div>
            <p className="text-xs text-slate-500 max-w-xl">
              Decentralized state audit trail mesh preventing retroactive tampering of Judiciary FIRs, Land Mutations, and Treasury disbursements via cryptographic root proofs.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-400">
            <button onClick={() => navigate('/')} className="hover:text-cyan-400 transition-colors">
              Platform Architecture
            </button>
            <button onClick={() => navigate('/login')} className="hover:text-cyan-400 transition-colors">
              Secure Access
            </button>
            <button onClick={() => navigate('/dashboard')} className="hover:text-cyan-400 transition-colors">
              SOC Overview
            </button>
            <button onClick={() => navigate('/dashboard/verify')} className="hover:text-cyan-400 transition-colors">
              Verification Engine
            </button>
          </div>
        </div>

        {/* Security watermark */}
        <div className="mt-8 pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-600">
          <div className="flex items-center space-x-2">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>CONFIDENTIAL // AUTHORIZED GOVERNMENT CLEARANCE USE ONLY</span>
          </div>
          <div>© 2026 GovChain Sentinel Cyber Defense Taskforce</div>
        </div>

      </div>
    </footer>
  )
}
