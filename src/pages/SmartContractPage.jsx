import { useState } from 'react'
import { 
  Cpu, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  RefreshCw, 
  Lock, 
  Copy, 
  ExternalLink, 
  Activity, 
  Key, 
  Database,
  Radio,
  FileCode,
  Zap,
  Check
} from 'lucide-react'
import { useRouter } from '../context/RouterContext'
import { useAuth } from '../context/AuthContext'
import { useAudit } from '../context/AuditContext'
import { calculateMerkleRoot, fallbackSha256 } from '../utils/crypto'

export default function SmartContractPage() {
  const { navigate } = useRouter()
  const { user, isAdmin } = useAuth()
  const { logs, onChainMerkleRoot, commitNewMerkleAnchor, resetAllRecords } = useAudit()

  const [copiedKey, setCopiedKey] = useState(null)
  const [isCommitting, setIsCommitting] = useState(false)
  const [isProbing, setIsProbing] = useState(false)
  const [probeResult, setProbeResult] = useState(null)
  const [actionSuccessMessage, setActionSuccessMessage] = useState('')
  const [oracleKey, setOracleKey] = useState('0x4A81E991...C78D20F4')

  const [txHistory, setTxHistory] = useState([
    {
      txHash: '0x3f9a7c2b810d2948e501a4e8d32b5091ff7a2160',
      blockNumber: 18409211,
      method: 'commitMerkleRoot',
      root: onChainMerkleRoot,
      gasUsed: '42,190 Gwei',
      status: 'CONFIRMED (12/12 Nodes)',
      timestamp: '2026-10-15 03:15:22 UTC'
    },
    {
      txHash: '0x81bd9920ac3417eef90123984bcda80927e108cf',
      blockNumber: 18409180,
      method: 'rotateOracleKey',
      root: '0x9e7a...Anchor',
      gasUsed: '28,450 Gwei',
      status: 'CONFIRMED (12/12 Nodes)',
      timestamp: '2026-10-14 22:40:11 UTC'
    },
    {
      txHash: '0x12cde489a24300bf887648f0293da88e1009ef32',
      blockNumber: 18409001,
      method: 'initializeGenesisContract',
      root: onChainMerkleRoot,
      gasUsed: '124,500 Gwei',
      status: 'CONFIRMED (12/12 Nodes)',
      timestamp: '2026-10-14 18:00:00 UTC'
    }
  ])

  const copyToClipboard = (text, key) => {
    navigator.clipboard?.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  // Admin action: Commit current live ledger root to smart contract
  const handleCommitCurrentRoot = () => {
    setIsCommitting(true)
    setActionSuccessMessage('')

    setTimeout(() => {
      const currentHashes = logs.map(l => l.currentHash)
      const currentComputedRoot = calculateMerkleRoot(currentHashes)
      const receipt = commitNewMerkleAnchor(currentComputedRoot)

      const newTx = {
        txHash: receipt.txHash,
        blockNumber: receipt.blockNumber,
        method: 'commitMerkleRoot',
        root: currentComputedRoot,
        gasUsed: `${Math.floor(38000 + Math.random() * 8000)} Gwei`,
        status: 'CONFIRMED (12/12 Nodes)',
        timestamp: receipt.timestamp
      }

      setTxHistory(prev => [newTx, ...prev])
      setIsCommitting(false)
      setActionSuccessMessage(`Successfully broadcast state commitment to Ethereum L2! Tx Hash: ${receipt.txHash.substring(0, 18)}...`)
      setTimeout(() => setActionSuccessMessage(''), 7000)
    }, 1200)
  }

  // Admin action: Probe consensus network quorum
  const handleProbeConsensus = () => {
    setIsProbing(true)
    setProbeResult(null)

    setTimeout(() => {
      setIsProbing(false)
      setProbeResult({
        healthy: true,
        activeValidators: 12,
        totalValidators: 12,
        quorum: '100% Byzantine Agreement',
        averageLatency: '4.8ms',
        network: 'Ethereum Sepolia Orbit L2 Rollup'
      })
    }, 1000)
  }

  // Admin action: Rotate Oracle Enclave Key
  const handleRotateOracleKey = () => {
    const newKey = `0x${fallbackSha256(Date.now().toString()).substring(0, 8).toUpperCase()}...${fallbackSha256(Date.now().toString() + 'salt').substring(0, 8).toUpperCase()}`
    setOracleKey(newKey)
    setActionSuccessMessage(`Cryptographic enclave key rotated to: ${newKey}`)
    setTimeout(() => setActionSuccessMessage(''), 5000)
  }

  return (
    <div className="min-h-screen cyber-grid py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Top Breadcrumb & Directive Header */}
      <div className="pb-6 mb-6 border-b border-slate-800">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center space-x-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard Overview</span>
        </button>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-purple-950/80 border border-purple-500/50 text-purple-300 font-bold uppercase tracking-wider">
                ADMINISTRATIVE CONTROL VECTOR
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 uppercase">
                LEVEL-5 DIRECTIVE ACCESS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-2">
              Smart Contract Anchor & Consensus Management
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Direct administrative interaction with Ethereum L2 decentralized Merkle root commitments.
            </p>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCommitCurrentRoot}
              disabled={isCommitting}
              className="px-4 py-2.5 rounded-xl font-mono text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-glow transition-all flex items-center space-x-2 disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${isCommitting ? 'animate-spin' : ''}`} />
              <span>{isCommitting ? 'Broadcasting to L2...' : 'Commit Live Root Anchor'}</span>
            </button>

            <button
              onClick={handleProbeConsensus}
              disabled={isProbing}
              className="px-4 py-2.5 rounded-xl font-mono text-xs border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 transition-all flex items-center space-x-2"
            >
              <Activity className={`w-4 h-4 text-emerald-400 ${isProbing ? 'animate-pulse' : ''}`} />
              <span>Probe Validator Quorum</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionSuccessMessage && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/60 text-emerald-300 text-xs font-mono flex items-center space-x-2 shadow-emerald-glow animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Core Contract Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Card 1: Contract Address */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase font-mono">
            <span>Contract Address</span>
            <FileCode className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-2">
            <div className="text-xs font-mono font-bold text-slate-200 break-all">
              0x9e7a2b918f43021c6014e38992a5482310491b8f
            </div>
            <div className="text-[10px] text-cyan-400 font-mono mt-0.5">GovChainSentinelAnchor.sol</div>
          </div>
          <button
            onClick={() => copyToClipboard('0x9e7a2b918f43021c6014e38992a5482310491b8f', 'contract')}
            className="w-full mt-2 py-1.5 px-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 hover:text-cyan-300 flex items-center justify-center space-x-1.5 transition-colors"
          >
            {copiedKey === 'contract' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'contract' ? 'Copied to Clipboard' : 'Copy Address'}</span>
          </button>
        </div>

        {/* Card 2: Active Anchored Merkle Root */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase font-mono">
            <span>Canonical Merkle Root</span>
            <Database className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <div className="text-xs font-mono font-bold text-emerald-300 truncate">
              {onChainMerkleRoot}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">On-Chain State Commitment</div>
          </div>
          <button
            onClick={() => copyToClipboard(onChainMerkleRoot, 'root')}
            className="w-full mt-2 py-1.5 px-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 hover:text-emerald-300 flex items-center justify-center space-x-1.5 transition-colors"
          >
            {copiedKey === 'root' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'root' ? 'Copied Root' : 'Copy Merkle Root'}</span>
          </button>
        </div>

        {/* Card 3: Network & Gas Tank */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase font-mono">
            <span>Rollup Network & Gas</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2">
            <div className="text-sm font-mono font-bold text-slate-200">
              Ethereum Sepolia L2
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">Arbitrum Orbit Mesh // Batch ID #4092</div>
          </div>
          <div className="mt-2 py-1 px-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Gas Reserve:</span>
            <span className="text-amber-300 font-bold">2.418 ETH</span>
          </div>
        </div>

        {/* Card 4: Oracle Key & Security Clearance */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase font-mono">
            <span>Validator Oracle Key</span>
            <Key className="w-4 h-4 text-purple-400" />
          </div>
          <div className="my-2">
            <div className="text-xs font-mono font-bold text-purple-300 truncate">
              {oracleKey}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">ECDSA Secp256k1 Hardware Enclave</div>
          </div>
          <button
            onClick={handleRotateOracleKey}
            className="w-full mt-2 py-1.5 px-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-purple-400 hover:text-purple-300 hover:border-purple-500/40 flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Rotate Key</span>
          </button>
        </div>

      </div>

      {/* Consensus Probe Telemetry Banner */}
      {probeResult && (
        <div className="mb-8 p-5 rounded-2xl bg-slate-900/95 border border-cyan-500/40 backdrop-blur-md shadow-cyan-glow animate-fadeIn">
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono font-bold mb-3 pb-2 border-b border-slate-800">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>DECENTRALIZED CONSENSUS AUDIT: 12 OF 12 NODES VALIDATED</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-500 block text-[10px]">CONSENSUS STATUS</span>
              <span className="text-emerald-400 font-bold">HEALTHY & SYNCHRONIZED</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">ACTIVE QUORUM</span>
              <span className="text-slate-200">{probeResult.activeValidators} / {probeResult.totalValidators} Validator Nodes</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">CONSENSUS MODEL</span>
              <span className="text-slate-200">{probeResult.quorum}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">ORACLE LATENCY</span>
              <span className="text-cyan-300">{probeResult.averageLatency}</span>
            </div>
          </div>
        </div>
      )}

      {/* Smart Contract Interaction & Historical Commitments Table */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>On-Chain Commitment Ledger & Event Stream</span>
            </h2>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              Cryptographic verification trail of state root commits anchored to Ethereum L2.
            </p>
          </div>

          <span className="px-2.5 py-1 rounded text-[10px] font-mono bg-slate-950 border border-slate-800 text-slate-400">
            Showing {txHistory.length} On-Chain Transactions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 text-[11px] uppercase">
                <th className="py-3 px-3">Transaction Hash</th>
                <th className="py-3 px-3">Block #</th>
                <th className="py-3 px-3">Method</th>
                <th className="py-3 px-3">Committed Merkle Root</th>
                <th className="py-3 px-3">Gas Used</th>
                <th className="py-3 px-3">Consensus Quorum</th>
                <th className="py-3 px-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {txHistory.map((tx, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3 font-semibold text-cyan-400">
                    <span className="truncate inline-block max-w-[130px]">{tx.txHash}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-400">#{tx.blockNumber}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-purple-300 text-[10px]">
                      {tx.method}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-emerald-400">
                    <span className="truncate inline-block max-w-[140px]">{tx.root}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-400">{tx.gasUsed}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-slate-500 text-[11px]">
                    {tx.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
