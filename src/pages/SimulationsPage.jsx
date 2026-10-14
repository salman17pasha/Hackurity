import { useState } from 'react'
import { 
  FlaskConical, 
  ArrowLeft, 
  AlertTriangle, 
  ShieldAlert, 
  RefreshCw, 
  Lock, 
  Zap, 
  Bug, 
  CheckCircle2, 
  FileWarning, 
  ArrowRight,
  UserCheck
} from 'lucide-react'
import { useRouter } from '../context/RouterContext'
import { useAuth } from '../context/AuthContext'
import { useAudit } from '../context/AuditContext'

export default function SimulationsPage() {
  const { navigate } = useRouter()
  const { user, switchRole } = useAuth()
  const { logs, tamperRecord, restoreRecord, resetAllRecords, lastVerificationResult } = useAudit()

  const [selectedLogId, setSelectedLogId] = useState(logs[0]?.id || 'LOG-1001')
  const [tamperType, setTamperType] = useState('fir_dismiss')
  const [successNotice, setSuccessNotice] = useState('')

  const isAdmin = user?.role === 'Admin'
  const activeLog = logs.find(l => l.id === selectedLogId) || logs[0]

  // If unauthorized normal user tries to access
  if (!isAdmin) {
    return (
      <div className="min-h-screen cyber-grid py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex items-center justify-center">
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-red-900/60 shadow-crimson-glow text-center max-w-lg">
          <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-500/50 flex items-center justify-center text-red-400 mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100">
            Access Restricted: Level-5 Clearance Required
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-2">
            The Tamper Simulation module contains active adversarial penetration controls restricted to Administrators.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => switchRole('Admin')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-mono text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-glow transition-all"
            >
              Elevate Role to Admin
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-mono text-xs bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleExecuteTamper = () => {
    let modifications = {}

    if (tamperType === 'fir_dismiss') {
      modifications = {
        accused: "Arjun R. Sharma [CHARGES EXPUNGED]",
        charges: "NONE - Retrospectively Cleared by Insider Query",
        bailStatus: "GRANTED - Case Terminated Unilaterally"
      }
    } else if (tamperType === 'land_theft') {
      modifications = {
        grantee: "Offshore Shell Syndicate Corp",
        considerationInr: "1,000",
        location: "Whitefield Tech Corridor [Boundary Redrawn]"
      }
    } else if (tamperType === 'treasury_divert') {
      modifications = {
        recipientAccount: "ANON-SWISS-SECRET-ACCOUNT-771",
        amountInr: "990,000,000",
        budgetHead: "UNAUTHORIZED-DIVERSION"
      }
    } else {
      modifications = {
        status: "FORGED_RECORD_TAMPERED",
        auditChecksum: "COMPROMISED"
      }
    }

    tamperRecord(selectedLogId, modifications)
    setSuccessNotice(`Malicious payload injected into ${selectedLogId}! Observe retroactive failure across the mesh.`)
  }

  const handleReset = () => {
    resetAllRecords()
    setSuccessNotice('Blockchain restored to 100% verified pristine genesis state.')
  }

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
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold text-slate-100">
                Adversarial Tamper Simulation Lab
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/70 border border-amber-500/40 text-amber-300">
                HACKATHON EVALUATION
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Simulate rogue DB administrator SQL mutations to prove immediate mathematical detection.
            </p>
          </div>

          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl text-xs font-mono bg-slate-900 border border-slate-700 hover:border-emerald-500/40 text-slate-200 hover:text-emerald-400 transition-all flex items-center space-x-2"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Reset Chain to Clean State</span>
          </button>
        </div>
      </div>

      {/* Success / Alert Banner */}
      {successNotice && (
        <div className="mb-6 p-4 rounded-xl bg-cyan-950/60 border border-cyan-500/50 text-cyan-200 text-xs font-mono flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{successNotice}</span>
          </div>
          <button
            onClick={() => setSuccessNotice('')}
            className="text-slate-400 hover:text-slate-200 ml-4"
          >
            &times;
          </button>
        </div>
      )}

      {/* Simulation Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
        
        {/* Left Col: Tamper Injection Control Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-sm space-y-5">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
              <FlaskConical className="w-5 h-5 text-amber-400" />
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                Select Compromise Vector
              </h2>
            </div>

            {/* Target Block Selector */}
            <div>
              <label className="block text-slate-300 mb-1.5 font-bold">
                Target Record to Corrupt:
              </label>
              <select
                value={selectedLogId}
                onChange={(e) => setSelectedLogId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 text-slate-100 rounded-xl outline-none"
              >
                {logs.map((log) => (
                  <option key={log.id} value={log.id}>
                    {log.id} (#{log.blockHeight}) - {log.department}: {log.title} {log.isTampered ? '[ALREADY TAMPERED]' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Attack Mutation Type */}
            <div>
              <label className="block text-slate-300 mb-1.5 font-bold">
                Adversary Attack Type:
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
                  <input
                    type="radio"
                    name="tamperType"
                    value="fir_dismiss"
                    checked={tamperType === 'fir_dismiss'}
                    onChange={() => setTamperType('fir_dismiss')}
                    className="text-amber-500"
                  />
                  <div>
                    <div className="font-bold text-slate-200">Judiciary FIR Erasure / Dismissal</div>
                    <div className="text-[11px] text-slate-400">Silently alters accused name, wipes out charges, and grants bail without judge consent.</div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
                  <input
                    type="radio"
                    name="tamperType"
                    value="land_theft"
                    checked={tamperType === 'land_theft'}
                    onChange={() => setTamperType('land_theft')}
                    className="text-amber-500"
                  />
                  <div>
                    <div className="font-bold text-slate-200">Land Title Transfer Hijack</div>
                    <div className="text-[11px] text-slate-400">Modifies grantee to offshore shell company and slashes recorded transaction value to INR 1,000.</div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
                  <input
                    type="radio"
                    name="tamperType"
                    value="treasury_divert"
                    checked={tamperType === 'treasury_divert'}
                    onChange={() => setTamperType('treasury_divert')}
                    className="text-amber-500"
                  />
                  <div>
                    <div className="font-bold text-slate-200">Treasury Disbursal Diversion</div>
                    <div className="text-[11px] text-slate-400">Reroutes INR 990M agricultural subsidy tranche to anonymous foreign escrow wallet.</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Execute Tamper Button */}
            <div className="pt-2">
              <button
                onClick={handleExecuteTamper}
                className="w-full py-3.5 rounded-xl font-bold bg-red-600 hover:bg-red-500 text-white shadow-crimson-glow transition-all flex items-center justify-center space-x-2"
              >
                <Bug className="w-4 h-4" />
                <span>Inject Malicious Modification into Local Database</span>
              </button>
            </div>

          </div>

          {/* Quick Verification Redirection Banner */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="text-slate-300">
              Want to see the cryptographic alert in action?
            </div>
            <button
              onClick={() => navigate('/dashboard/verify')}
              className="px-4 py-2 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 transition-colors flex items-center space-x-1"
            >
              <span>Run Verification Engine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Col: Current Target Status Card */}
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl bg-slate-900/90 border backdrop-blur-sm ${
            activeLog?.isTampered ? 'border-red-500/60 shadow-crimson-glow' : 'border-slate-800'
          }`}>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider pb-3 border-b border-slate-800 flex items-center justify-between">
              <span>Target Record State</span>
              {activeLog?.isTampered ? (
                <span className="text-red-400 font-bold">🔴 COMPROMISED</span>
              ) : (
                <span className="text-emerald-400 font-bold">🟢 UNTOUCHED</span>
              )}
            </h3>

            <div className="mt-4 space-y-3">
              <div>
                <div className="text-slate-500 text-[10px]">RECORD ID</div>
                <div className="text-slate-200">{activeLog?.id} (Block #{activeLog?.blockHeight})</div>
              </div>

              <div>
                <div className="text-slate-500 text-[10px]">DEPARTMENT</div>
                <div className="text-slate-200">{activeLog?.department}</div>
              </div>

              <div>
                <div className="text-slate-500 text-[10px]">CURRENT SHA-256 HASH</div>
                <div className="text-cyan-300 break-all text-[11px] mt-0.5">
                  {activeLog?.currentHash}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <div className="text-slate-500 text-[10px] mb-1">ACTIVE DATABASE PAYLOAD</div>
                <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-300 text-[10px] max-h-56 overflow-y-auto">
                  {JSON.stringify(activeLog?.payload, null, 2)}
                </pre>
              </div>

              {activeLog?.isTampered && (
                <button
                  onClick={() => restoreRecord(activeLog.id)}
                  className="w-full mt-2 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 transition-colors"
                >
                  Restore This Record Only
                </button>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  )
}
