import { 
  FileText, 
  Link as LinkIcon, 
  ShieldCheck, 
  ShieldAlert, 
  Settings, 
  FlaskConical, 
  Lock,
  Radio
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from '../context/RouterContext'
import { useAudit } from '../context/AuditContext'
import CyberCard from '../components/ui/CyberCard'

export default function DashboardHome() {
  const { user, switchRole } = useAuth()
  const { navigate } = useRouter()
  const { logs, lastVerificationResult, isStreaming, setIsStreaming } = useAudit()

  const isAdmin = user?.role === 'Admin'
  const isTampered = lastVerificationResult.status === 'TAMPERED'
  const latestBlock = logs.length > 0 ? logs[logs.length - 1] : null
  const blockCount = logs.length

  return (
    <div className="min-h-screen cyber-grid py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Top Welcome & Session Telemetry Banner */}
      <div className="mb-8 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div>
            <div className="flex items-center space-x-3">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300">
                ACTIVE SOC OPERATOR
              </span>
              <span className={`text-xs font-mono px-2.5 py-0.5 rounded-full border ${
                isAdmin 
                  ? 'bg-purple-950/60 border-purple-500/40 text-purple-300' 
                  : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              }`}>
                ROLE: {user?.role || 'Guest'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-2">
              Welcome back, {user?.name || 'Authorized Auditor'}
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Active Session: <span className="text-cyan-300">{user?.ip}</span> // Clearance: <span className="text-emerald-400">{user?.clearance}</span>
            </p>
          </div>

          {/* Quick Role Toggle Bar for Reviewers */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 text-xs font-mono">
              <span className="text-slate-500 px-2 text-[11px]">Role Switch:</span>
              <button
                onClick={() => switchRole('Admin')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  isAdmin 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => switchRole('Normal User')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  !isAdmin 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Normal User
              </button>
            </div>

            {/* Live Streaming Toggle */}
            <button
              onClick={() => setIsStreaming(!isStreaming)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono border transition-all flex items-center space-x-2 ${
                isStreaming
                  ? 'bg-cyan-950/70 border-cyan-500/60 text-cyan-300 shadow-cyan-glow'
                  : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${isStreaming ? 'animate-pulse text-cyan-400' : ''}`} />
              <span>{isStreaming ? 'Live Stream: ON' : 'Live Stream: Paused'}</span>
            </button>
          </div>

        </div>

        {/* Real-time System Metrics Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-500 text-[10px] uppercase">Active Block Height</div>
            <div className="text-lg font-bold text-slate-100 mt-0.5">#{latestBlock?.blockHeight || 1006}</div>
            <div className="text-[10px] text-cyan-400">Total Logs: {blockCount}</div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-500 text-[10px] uppercase">Chain Integrity State</div>
            <div className={`text-lg font-bold mt-0.5 flex items-center space-x-1.5 ${
              isTampered ? 'text-red-400' : 'text-emerald-400'
            }`}>
              {isTampered ? (
                <>
                  <ShieldAlert className="w-4 h-4 shrink-0 animate-pulse" />
                  <span>TAMPER DETECTED</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>100% VERIFIED</span>
                </>
              )}
            </div>
            <div className="text-[10px] text-slate-500">
              {isTampered ? 'Root Discrepancy Found' : 'NIST SP 800-57 Compliant'}
            </div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-500 text-[10px] uppercase">Smart Contract Anchor</div>
            <div className="text-xs font-mono text-cyan-300 truncate mt-1">
              0x9e7a...491b8f
            </div>
            <div className="text-[10px] text-emerald-400">Ethereum L2 Verified</div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-500 text-[10px] uppercase">Consensus Verification</div>
            <div className="text-lg font-bold text-slate-100 mt-0.5">12 / 12 Nodes</div>
            <div className="text-[10px] text-slate-400">Latency: 4.2ms</div>
          </div>
        </div>

      </div>

      {/* Main Interactive Card Grid Layout */}
      <div className="mb-6">
        <h2 className="text-lg font-bold font-mono text-slate-200 mb-1">
          Operations Center Modules
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Click any card to launch its dedicated operational workspace.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Live Log Stream Card */}
          <CyberCard
            title="Live Log Stream"
            subtitle="Real-time Government Ingestion"
            badge={`${blockCount} BLOCKS`}
            badgeVariant="cyan"
            icon={FileText}
            accentColor="cyan"
            footerText="Inspect Live Log Stream"
            onClick={() => navigate('/dashboard/logs')}
          >
            <p className="text-xs text-slate-400 mb-3">
              Stream immutable audit events from Judiciary FIRs, Land Registry mutations, and Treasury disbursements with live keyword filtering.
            </p>
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 font-mono text-[11px] space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Latest Ingested:</span>
                <span className="text-cyan-300 font-bold">{latestBlock?.id}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Department:</span>
                <span className="text-slate-200">{latestBlock?.department}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Streaming State:</span>
                <span className={isStreaming ? 'text-emerald-400' : 'text-amber-400'}>
                  {isStreaming ? 'Active (Auto-polling)' : 'Paused'}
                </span>
              </div>
            </div>
          </CyberCard>

          {/* Card 2: Cryptographic Hash-Chain Card */}
          <CyberCard
            title="Hash-Chain Inspector"
            subtitle="SHA-256 Sequential Graph"
            badge="BLOCK HEIGHT"
            badgeVariant="cyan"
            icon={LinkIcon}
            accentColor="cyan"
            footerText="Inspect Cryptographic Chain"
            onClick={() => navigate('/dashboard/hash-chain')}
          >
            <p className="text-xs text-slate-400 mb-3">
              Forensic inspection of cryptographic SHA-256 linkage connecting each block to its predecessor from Genesis to the active tip.
            </p>
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 font-mono text-[11px] space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Chain Length:</span>
                <span className="text-cyan-300 font-bold">#{latestBlock?.blockHeight} Blocks</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Genesis Seed:</span>
                <span className="text-slate-300">00000000...0000</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Continuity:</span>
                <span className={isTampered ? 'text-red-400' : 'text-emerald-400'}>
                  {isTampered ? 'Broken Chain Detected' : '100% Intact Linkage'}
                </span>
              </div>
            </div>
          </CyberCard>

          {/* Card 3: Verification Engine Card */}
          <CyberCard
            title="Verification Engine"
            subtitle="Merkle Proof Auditor"
            badge={isTampered ? 'TAMPER ALERT' : 'CHAIN VALID'}
            badgeVariant={isTampered ? 'red' : 'emerald'}
            icon={isTampered ? ShieldAlert : ShieldCheck}
            accentColor={isTampered ? 'red' : 'emerald'}
            footerText="Run Integrity Verification"
            onClick={() => navigate('/dashboard/verify')}
          >
            <p className="text-xs text-slate-400 mb-3">
              Cross-reference local state logs against the anchored smart contract Merkle root. Run mathematical proofs to detect unauthorized alterations.
            </p>
            <div className={`p-3 rounded-lg border font-mono text-[11px] space-y-1 ${
              isTampered 
                ? 'bg-red-950/40 border-red-500/40 text-red-300' 
                : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
            }`}>
              <div className="flex justify-between">
                <span>Engine Status:</span>
                <span className="font-bold">{isTampered ? '🔴 TAMPER DETECTED' : '🟢 INTEGRITY VALID'}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Last Scan:</span>
                <span className="text-slate-300">{new Date(lastVerificationResult.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Anchor Match:</span>
                <span>{isTampered ? 'Mismatch Found' : 'Verified Exact'}</span>
              </div>
            </div>
          </CyberCard>

          {/* Card 4: Settings & Session Card */}
          <CyberCard
            title="Settings & Session"
            subtitle="Identity & Security Policy"
            badge={user?.role}
            badgeVariant="cyan"
            icon={Settings}
            accentColor="cyan"
            footerText="Manage Preferences & Session"
            onClick={() => navigate('/dashboard/settings')}
          >
            <p className="text-xs text-slate-400 mb-3">
              Active security session metrics, GovNet IP binding, encryption key fingerprints, SOC dark-mode toggle, and role management.
            </p>
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 font-mono text-[11px] space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Client IP:</span>
                <span className="text-cyan-300 truncate max-w-[150px]">{user?.ip}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Session Token:</span>
                <span className="text-slate-300">{user?.token}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Crypto Cipher:</span>
                <span className="text-slate-300">AES-256-GCM</span>
              </div>
            </div>
          </CyberCard>

          {/* Card 5: Tamper Simulation Card (Admin Only) */}
          {isAdmin ? (
            <CyberCard
              title="Tamper Simulation"
              subtitle="Hackathon Adversary Testing"
              badge="ADMIN EXCLUSIVE"
              badgeVariant="amber"
              icon={FlaskConical}
              accentColor="amber"
              footerText="Launch Simulation Sandbox"
              onClick={() => navigate('/dashboard/simulations')}
            >
              <p className="text-xs text-slate-400 mb-3">
                Simulate insider database attacks by modifying FIR defendants or land deeds. Test retroactive alert detection across the sentinel mesh.
              </p>
              <div className="bg-amber-950/40 p-3 rounded-lg border border-amber-500/40 font-mono text-[11px] space-y-1 text-amber-300">
                <div className="flex justify-between">
                  <span>Adversary Lab:</span>
                  <span className="font-bold">READY</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Attack Types:</span>
                  <span className="text-slate-300">FIR Alteration, Deed Theft</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Current State:</span>
                  <span className={isTampered ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                    {isTampered ? 'Tampered Record Active' : 'Normal / Clean'}
                  </span>
                </div>
              </div>
            </CyberCard>
          ) : (
            /* Restricted Card for Normal User */
            <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/60 opacity-75 relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-lg bg-slate-950 text-slate-500 border border-slate-800">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-400">
                        Tamper Simulation
                      </h3>
                      <p className="text-xs font-mono text-slate-500">
                        Admin Clearance Required
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-950 text-slate-500 border border-slate-800 uppercase">
                    LOCKED
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Simulation controls are restricted to administrators with Level-5 clearance. Switch role to Admin to unlock.
                </p>
              </div>

              <button
                onClick={() => switchRole('Admin')}
                className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono border border-slate-700 transition-colors"
              >
                Switch to Admin to Access
              </button>
            </div>
          )}

        </div>
      </div>

    </div>
  )
}
