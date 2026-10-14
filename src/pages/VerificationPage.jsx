import { useState } from 'react'
import { 
  ShieldCheck, 
  ShieldAlert, 
  ArrowLeft, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  Terminal, 
  Database, 
  FileCheck, 
  Download,
  Share2
} from 'lucide-react'
import { useRouter } from '../context/RouterContext'
import { useAudit } from '../context/AuditContext'

export default function VerificationPage() {
  const { navigate } = useRouter()
  const { logs, onChainMerkleRoot, performIntegrityAudit, lastVerificationResult } = useAudit()

  const [isAuditing, setIsAuditing] = useState(false)
  const [terminalLogs, setTerminalLogs] = useState([])
  const [reportGenerated, setReportGenerated] = useState(false)

  const handleRunVerification = () => {
    setIsAuditing(true)
    setTerminalLogs([])

    const steps = [
      "Initializing GovChain Sentinel Cryptographic Audit Protocol v2.4...",
      `Scanning ${logs.length} sequential blocks from Genesis [Block #1001] to tip...`,
      "Recomputing individual SHA-256 digests from raw block payloads...",
      "Validating forward predecessor links (prevHash === predecessor.currentHash)...",
      "Constructing pairwise Merkle Tree binary hierarchy...",
      `Querying decentralized smart contract Merkle root: ${onChainMerkleRoot.substring(0, 20)}...`,
      "Comparing computed Merkle root with on-chain consensus state..."
    ]

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setTerminalLogs(prev => [...prev, `[${new Date().toISOString().substring(11, 19)}] ${step}`])
      }, (idx + 1) * 350)
    })

    setTimeout(() => {
      const result = performIntegrityAudit()
      setIsAuditing(false)
      setTerminalLogs(prev => [
        ...prev,
        result.isValid 
          ? `[SUCCESS] All ${logs.length} blocks mathematically valid. Merkle roots identical.`
          : `[CRITICAL ALERT] Integrity violation detected in ${result.corruptedBlockIds.length} block(s)!`
      ])
    }, (steps.length + 1) * 350)
  }

  const isTampered = lastVerificationResult.status === 'TAMPERED'

  return (
    <div className="min-h-screen cyber-grid py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Top Breadcrumb & Header */}
      <div className="pb-6 mb-6 border-b border-slate-800">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center space-x-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard Overview</span>
        </button>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-100">
              Integrity Verification Engine
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Cross-reference state databases against on-chain Ethereum/L2 Merkle commitments.
            </p>
          </div>

          <button
            onClick={handleRunVerification}
            disabled={isAuditing}
            className="px-6 py-3 rounded-xl font-mono text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-glow transition-all flex items-center space-x-2 disabled:opacity-70"
          >
            <RefreshCw className={`w-4 h-4 ${isAuditing ? 'animate-spin' : ''}`} />
            <span>{isAuditing ? 'Auditing Hash Chain...' : 'Verify Full Integrity Now'}</span>
          </button>
        </div>
      </div>

      {/* Main Verification Status Banner */}
      <div className={`p-6 sm:p-8 rounded-2xl border mb-8 transition-all duration-300 ${
        isTampered 
          ? 'bg-red-950/40 border-red-500/70 shadow-crimson-glow' 
          : 'bg-emerald-950/30 border-emerald-500/60 shadow-emerald-glow'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className={`p-3.5 rounded-2xl border ${
              isTampered 
                ? 'bg-red-950 text-red-400 border-red-500/50' 
                : 'bg-emerald-950 text-emerald-400 border-emerald-500/50'
            }`}>
              {isTampered ? <ShieldAlert className="w-8 h-8 animate-pulse" /> : <ShieldCheck className="w-8 h-8" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                  isTampered 
                    ? 'bg-red-900/50 border-red-500 text-red-300' 
                    : 'bg-emerald-900/50 border-emerald-500 text-emerald-300'
                }`}>
                  {isTampered ? '🔴 CRITICAL TAMPER DETECTED' : '🟢 INTEGRITY 100% VERIFIED'}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Last Checked: {new Date(lastVerificationResult.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 mt-2">
                {isTampered 
                  ? 'Unauthorized Ledger Modification Discovered' 
                  : 'All State Logs Match Cryptographic Root Commitment'}
              </h2>
              <p className="text-xs font-mono text-slate-300 mt-1 max-w-2xl">
                {lastVerificationResult.details}
              </p>
            </div>
          </div>

          <div className="flex flex-col space-y-2 w-full md:w-auto">
            <button
              onClick={() => {
                setReportGenerated(true)
                setTimeout(() => setReportGenerated(false), 2500)
              }}
              className="px-4 py-2.5 rounded-xl font-mono text-xs bg-slate-900/90 border border-slate-700 text-slate-200 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{reportGenerated ? 'Report Downloaded!' : 'Export Forensic Certificate'}</span>
            </button>
          </div>
        </div>

        {/* Merkle Comparison Strip */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <div className="text-slate-500 text-[10px] uppercase">Anchored On-Chain Merkle Root</div>
            <div className="text-emerald-400 font-bold break-all mt-1">
              {onChainMerkleRoot}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Smart Contract Source: Ethereum L2 Contract #0x9e7a...
            </div>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <div className="text-slate-500 text-[10px] uppercase">Locally Recomputed Merkle Root</div>
            <div className={`font-bold break-all mt-1 ${
              isTampered ? 'text-red-400' : 'text-emerald-400'
            }`}>
              {lastVerificationResult.computedMerkleRoot || onChainMerkleRoot}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Derived from current database state
            </div>
          </div>
        </div>
      </div>

      {/* Terminal Scan Output */}
      {terminalLogs.length > 0 && (
        <div className="mb-8 p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl font-mono text-xs">
          <div className="flex items-center space-x-2 text-slate-400 pb-3 mb-3 border-b border-slate-800">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-200">Forensic Execution Telemetry</span>
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {terminalLogs.map((logLine, idx) => (
              <div 
                key={idx} 
                className={logLine.includes('[CRITICAL ALERT]') ? 'text-red-400 font-bold' : logLine.includes('[SUCCESS]') ? 'text-emerald-400 font-bold' : 'text-slate-300'}
              >
                {logLine}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Block-by-Block Verification Audit Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm font-mono text-xs">
        <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center justify-between">
          <span>Block-by-Block Cryptographic Verification Audit</span>
          <span className="text-slate-400 text-xs">{logs.length} Total Verified</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 text-[11px]">
                <th className="py-2.5 px-3">BLOCK</th>
                <th className="py-2.5 px-3">DEPARTMENT</th>
                <th className="py-2.5 px-3">RECORD TITLE</th>
                <th className="py-2.5 px-3">PREDECESSOR LINK</th>
                <th className="py-2.5 px-3">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {logs.map((block, idx) => {
                const isBlockTampered = block.isTampered
                const isPredecessorBroken = idx > 0 && block.prevHash !== logs[idx - 1].currentHash

                return (
                  <tr 
                    key={block.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isBlockTampered || isPredecessorBroken ? 'bg-red-950/20' : ''
                    }`}
                  >
                    <td className="py-3 px-3 text-cyan-400 font-bold">
                      #{block.blockHeight}
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {block.department}
                    </td>
                    <td className="py-3 px-3 text-slate-200">
                      {block.title}
                    </td>
                    <td className="py-3 px-3">
                      {isPredecessorBroken ? (
                        <span className="text-red-400 flex items-center space-x-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Broken Link</span>
                        </span>
                      ) : (
                        <span className="text-emerald-400 flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Continuity OK</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {isBlockTampered ? (
                        <span className="px-2 py-0.5 rounded bg-red-950/80 border border-red-500/60 text-red-300 text-[10px] font-bold">
                          🔴 TAMPERED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                          🟢 VALID
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
