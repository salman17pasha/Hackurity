import { useState } from 'react'
import { 
  ShieldCheck, 
  ShieldAlert, 
  Database, 
  Link as LinkIcon, 
  Cpu, 
  Lock, 
  FileCheck, 
  ArrowRight, 
  Zap, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Terminal,
  Activity,
  ServerOff,
  GitCommit
} from 'lucide-react'
import { useRouter } from '../context/RouterContext'
import { useAudit } from '../context/AuditContext'

export default function LandingPage() {
  const { navigate } = useRouter()
  const { logs } = useAudit()
  const [activeTab, setActiveTab] = useState('problem') // 'problem' | 'solution' | 'architecture'

  return (
    <div className="relative min-h-screen cyber-grid pb-20">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 cyber-radial-overlay pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        
        {/* Security Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono mb-8 shadow-cyan-glow">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>NATIONAL CYBER COMPLIANCE MESH // ETHEREUM L2 ROOT ANCHORED</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-100 max-w-5xl mx-auto leading-tight sm:leading-none">
          Cryptographic Integrity for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
            Sovereign Government Logs
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed">
          Eliminate insider manipulation, retroactive record alteration, and database corruption in Judiciary FIRs, Land Registries, and Treasury flows using immutable SHA-256 hash chains and decentralized Merkle root anchoring.
        </p>

        {/* Primary CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-mono text-sm font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-glow transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
          >
            <span>Access Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-mono text-sm font-semibold bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-all flex items-center justify-center space-x-2"
          >
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>Launch SOC Dashboard</span>
          </button>
        </div>

        {/* Live Network Telemetry Strip */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-slate-900/70 border border-slate-800/80 p-4 rounded-xl text-left backdrop-blur-sm">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Anchored Audit Blocks</div>
            <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
              2,841,920
            </div>
            <div className="text-[10px] text-emerald-400 mt-1 flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5" />
              +14 ingested / min
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800/80 p-4 rounded-xl text-left backdrop-blur-sm">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Tamper Detection Latency</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
              &lt; 4.2 ms
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Instant retroactive flag
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800/80 p-4 rounded-xl text-left backdrop-blur-sm">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Decentralized Validators</div>
            <div className="text-2xl font-bold font-mono text-cyan-300 mt-1">
              12 Federal Nodes
            </div>
            <div className="text-[10px] text-cyan-400 mt-1">
              Zero single point failure
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800/80 p-4 rounded-xl text-left backdrop-blur-sm">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Hash Chain Continuity</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
              100.00%
            </div>
            <div className="text-[10px] text-emerald-400 mt-1">
              Unbroken cryptographic seal
            </div>
          </div>
        </div>
      </section>

      {/* Problem vs Solution Interactive Overview Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100">
            The Centralized Vulnerability vs. Cryptographic Mesh
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Why legacy municipal SQL databases fail under insider compromise, and how mathematical proofs guarantee public trust.
          </p>

          {/* Selector Tabs */}
          <div className="mt-8 inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs">
            <button
              onClick={() => setActiveTab('problem')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'problem'
                  ? 'bg-red-950/70 text-red-400 border border-red-500/40 shadow-crimson-glow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              The Vulnerability (Legacy Servers)
            </button>
            <button
              onClick={() => setActiveTab('solution')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'solution'
                  ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-500/40 shadow-emerald-glow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              The Cryptographic Solution
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'architecture'
                  ? 'bg-cyan-950/70 text-cyan-400 border border-cyan-500/40 shadow-cyan-glow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Verification Pipeline
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'problem' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
            <div className="bg-slate-900/90 border border-red-900/40 p-6 rounded-2xl relative overflow-hidden group hover:border-red-500/50 transition-all">
              <div className="w-10 h-10 rounded-lg bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400 mb-4">
                <ServerOff className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">
                Silent SQL Row Modification
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                A privileged rogue system administrator can execute direct <code className="text-red-400">UPDATE fir_records SET status='DISMISSED'</code> commands on internal servers. Without cryptographic binding, logs show no forensic trail.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800/80 font-mono text-xs text-red-400/90">
                Threat: Unchecked Administrative Privilege
              </div>
            </div>

            <div className="bg-slate-900/90 border border-red-900/40 p-6 rounded-2xl relative overflow-hidden group hover:border-red-500/50 transition-all">
              <div className="w-10 h-10 rounded-lg bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400 mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">
                Retroactive Land Mutation Theft
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Land survey records altered years after execution to reassign ownership deeds. Centralized log backup archives are often overwritten or synchronized blindly from the compromised source database.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800/80 font-mono text-xs text-red-400/90">
                Threat: Historical Deed Tampering
              </div>
            </div>

            <div className="bg-slate-900/90 border border-red-900/40 p-6 rounded-2xl relative overflow-hidden group hover:border-red-500/50 transition-all">
              <div className="w-10 h-10 rounded-lg bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400 mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">
                Unverifiable Public Audits
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Citizens and compliance officers are forced to blindly trust the government database server itself. There is no external, tamper-resistant mathematical proof of record veracity.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800/80 font-mono text-xs text-red-400/90">
                Threat: Asymmetric Trust & Zero Accountability
              </div>
            </div>
          </div>
        )}

        {activeTab === 'solution' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
            <div className="bg-slate-900/90 border border-emerald-900/40 p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/50 transition-all">
              <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4">
                <LinkIcon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">
                Sequential SHA-256 Hash Chain
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Every log event cryptographically embeds the SHA-256 digest of the previous record. Modifying even one comma in an old record alters its hash and instantly snaps the chain continuity forward.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800/80 font-mono text-xs text-emerald-400/90">
                Defense: Mathematical Forward Dependency
              </div>
            </div>

            <div className="bg-slate-900/90 border border-emerald-900/40 p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/50 transition-all">
              <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">
                Merkle Tree Batch Commitments
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Log batches are hashed pairwise into a single 32-byte Merkle root. This root is periodically committed to a decentralized smart contract, providing cryptographic finality without high gas costs.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800/80 font-mono text-xs text-emerald-400/90">
                Defense: On-Chain Root Anchor
              </div>
            </div>

            <div className="bg-slate-900/90 border border-emerald-900/40 p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/50 transition-all">
              <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">
                Zero-Trust Verification Engine
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Any external auditor or citizen can download the chain, re-calculate the hashes in real time, and verify against the blockchain root. Any tampered block turns crimson immediately.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800/80 font-mono text-xs text-emerald-400/90">
                Defense: Public Mathematical Verification
              </div>
            </div>
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="bg-slate-900/90 border border-cyan-900/40 p-8 rounded-2xl animate-fadeIn">
            <h3 className="text-lg font-bold text-cyan-300 mb-4 font-mono">
              End-to-End Cryptographic Audit Ingestion Mesh
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="text-xs font-mono text-cyan-400 mb-2">STAGE 01 // EVENT INGESTION</div>
                <div className="text-sm font-semibold text-slate-200">Department Action</div>
                <p className="text-xs text-slate-400 mt-2">
                  Officer files Judiciary FIR, Land deed mutation, or Treasury disbursal via authenticated digital signature.
                </p>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="text-xs font-mono text-cyan-400 mb-2">STAGE 02 // SHA-256 BONDING</div>
                <div className="text-sm font-semibold text-slate-200">Hash-Chain Linkage</div>
                <p className="text-xs text-slate-400 mt-2">
                  Event payload is formatted and combined with predecessor's SHA-256 hash: <code className="text-cyan-300">H(prev || payload)</code>.
                </p>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="text-xs font-mono text-cyan-400 mb-2">STAGE 03 // MERKLE ROOTING</div>
                <div className="text-sm font-semibold text-slate-200">Smart Contract Anchor</div>
                <p className="text-xs text-slate-400 mt-2">
                  Tree root is posted on-chain with immutable timestamp, permanently locking the sequence in history.
                </p>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="text-xs font-mono text-cyan-400 mb-2">STAGE 04 // CONTINUOUS AUDIT</div>
                <div className="text-sm font-semibold text-slate-200">Sentinel Verification</div>
                <p className="text-xs text-slate-400 mt-2">
                  Real-time worker nodes recalculate hashes continuously. If a record is altered, crimson alerts trigger in &lt;10ms.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Live Sample Logs Snapshot Card */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-bold text-slate-200">
                  Live Log Stream Snapshot
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                  CHAIN SYNCED
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Streaming sample blocks currently anchored across Judiciary and Land Registry nodes.
              </p>
            </div>

            <button
              onClick={() => navigate('/dashboard/logs')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 transition-colors"
            >
              Open Full Log Stream &rarr;
            </button>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            {logs.slice(0, 3).map((log) => (
              <div 
                key={log.id} 
                className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 hover:border-cyan-500/40 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
              >
                <div className="flex items-center space-x-3">
                  <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 text-[10px]">
                    BLOCK #{log.blockHeight}
                  </span>
                  <span className="text-slate-300 font-semibold">{log.title}</span>
                  <span className="text-slate-500 text-[11px] hidden sm:inline">[{log.department}]</span>
                </div>

                <div className="flex items-center space-x-4 text-slate-400 text-[11px]">
                  <span>SHA-256: <code className="text-cyan-300">{log.currentHash.substring(0, 16)}...</code></span>
                  <span className="text-emerald-400 flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="mt-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-cyan-950/30 via-slate-900 to-slate-950 border border-cyan-500/30 shadow-cyan-glow">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Ready to inspect the Cryptographic Audit Mesh?
          </h2>
          <p className="mt-3 text-sm text-slate-400 max-w-xl mx-auto">
            Log in with administrator or field auditor credentials to audit logs, inspect sequential SHA-256 chains, or run tamper simulations.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3.5 rounded-xl font-mono text-sm font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-glow transition-all"
            >
              Access Portal Now
            </button>
            <button
              onClick={() => navigate('/dashboard/verify')}
              className="px-8 py-3.5 rounded-xl font-mono text-sm font-semibold bg-slate-900 border border-slate-700 hover:border-emerald-500/50 text-emerald-400 transition-all"
            >
              Test Verification Engine
            </button>
          </div>
        </div>
      </section>

    </div>
  )
}
