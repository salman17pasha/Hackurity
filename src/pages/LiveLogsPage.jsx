import { useState, useMemo } from 'react'
import { 
  FileText, 
  Search, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Radio
} from 'lucide-react'
import { useRouter } from '../context/RouterContext'
import { useAudit } from '../context/AuditContext'

export default function LiveLogsPage() {
  const { navigate } = useRouter()
  const { logs, isStreaming, setIsStreaming } = useAudit()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDept, setSelectedDept] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [expandedLogId, setExpandedLogId] = useState(null)
  const [copiedNotification, setCopiedNotification] = useState(null)

  const departments = ['All', 'Judiciary', 'Land Registry', 'State Treasury', 'Civil Registry', 'Customs & Ports', 'Urban Infrastructure']

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch = 
        log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.currentHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
        JSON.stringify(log.payload).toLowerCase().includes(searchTerm.toLowerCase())

      const matchesDept = selectedDept === 'All' || log.department === selectedDept
      const matchesStatus = 
        selectedStatus === 'All' || 
        (selectedStatus === 'Tampered' && log.isTampered) ||
        (selectedStatus === 'Anchored' && !log.isTampered)

      return matchesSearch && matchesDept && matchesStatus
    })
  }, [logs, searchTerm, selectedDept, selectedStatus])

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text)
    setCopiedNotification(text)
    setTimeout(() => setCopiedNotification(null), 2000)
  }

  return (
    <div className="min-h-screen cyber-grid py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
        <div>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center space-x-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard Overview</span>
          </button>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-extrabold text-slate-100">
              Live Government Audit Logs
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-cyan-950/70 border border-cyan-500/40 text-cyan-300">
              {filteredLogs.length} Records
            </span>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Real-time streaming ledger of sovereign state actions, FIR amendments, and land mutations.
          </p>
        </div>

        {/* Live Stream Action */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`px-4 py-2 rounded-xl text-xs font-mono border transition-all flex items-center space-x-2 ${
              isStreaming
                ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300 shadow-cyan-glow'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isStreaming ? 'animate-pulse text-cyan-400' : ''}`} />
            <span>{isStreaming ? 'Live Polling: ACTIVE' : 'Resume Live Ingestion'}</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Control Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-6 shadow-md backdrop-blur-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Keyword Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by FIR ID, parcel ID, actor, or hash..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-cyan-500/80 text-slate-100 rounded-xl text-xs font-mono outline-none"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 focus:border-cyan-500/80 text-slate-100 rounded-xl text-xs font-mono outline-none cursor-pointer"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  Department: {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 focus:border-cyan-500/80 text-slate-100 rounded-xl text-xs font-mono outline-none cursor-pointer"
            >
              <option value="All">All States (Anchored & Tampered)</option>
              <option value="Anchored">Only Anchored (Verified)</option>
              <option value="Tampered">Only Tampered (Alerts)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Logs Table / List */}
      <div className="space-y-3 font-mono">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl">
            <FileText className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <div className="text-sm font-semibold text-slate-400">No matching log records found</div>
            <div className="text-xs text-slate-600 mt-1">Try relaxing your search query or department filter.</div>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isExpanded = expandedLogId === log.id

            return (
              <div
                key={log.id}
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  log.isTampered
                    ? 'bg-red-950/30 border-red-500/60 shadow-crimson-glow'
                    : 'bg-slate-900/80 border-slate-800/80 hover:border-cyan-500/40'
                }`}
              >
                {/* Log Header Row */}
                <div
                  onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                  className="p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-center space-x-3">
                    <span className="px-2.5 py-1 rounded bg-slate-950 text-cyan-400 border border-slate-800 text-xs font-bold">
                      #{log.blockHeight}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-slate-100">
                          {log.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {log.department}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 flex flex-wrap items-center gap-3">
                        <span>ID: <code className="text-slate-300">{log.id}</code></span>
                        <span>Time: {log.timestamp}</span>
                        <span>Actor: {log.actor}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 self-end lg:self-auto">
                    {/* Status Badge */}
                    <div className="flex items-center">
                      {log.isTampered ? (
                        <span className="px-2.5 py-1 rounded-md text-xs bg-red-950/70 border border-red-500/60 text-red-300 flex items-center space-x-1.5 animate-pulse">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                          <span>TAMPERED</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md text-xs bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 flex items-center space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>ANCHORED</span>
                        </span>
                      )}
                    </div>

                    {/* Expand/Collapse Chevron */}
                    <button className="text-slate-400 hover:text-slate-200">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 bg-slate-950/70 text-xs space-y-4">
                    
                    {/* Cryptographic Linkage Strip */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                        <div className="text-slate-500 text-[10px] uppercase">Previous Block SHA-256</div>
                        <div className="flex items-center justify-between mt-1 text-slate-300 text-[11px] truncate">
                          <code>{log.prevHash}</code>
                          <button
                            onClick={() => copyToClipboard(log.prevHash)}
                            title="Copy Hash"
                            className="ml-2 text-slate-500 hover:text-cyan-400 shrink-0"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                        <div className="text-slate-500 text-[10px] uppercase">Current Block SHA-256</div>
                        <div className="flex items-center justify-between mt-1 text-cyan-300 text-[11px] truncate">
                          <code>{log.currentHash}</code>
                          <button
                            onClick={() => copyToClipboard(log.currentHash)}
                            title="Copy Hash"
                            className="ml-2 text-slate-500 hover:text-cyan-400 shrink-0"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* On-Chain Transaction Commitment */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 text-[11px]">
                      <div className="text-slate-400">
                        Decentralized Root Tx: <code className="text-slate-300">{log.onChainTx}</code>
                      </div>
                      <span className="text-emerald-400 text-[10px] uppercase font-bold mt-1 sm:mt-0">
                        Merkle Finalized
                      </span>
                    </div>

                    {/* Formatted JSON Payload */}
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 mb-1.5 flex items-center justify-between">
                        <span>EVENT PAYLOAD BODY:</span>
                        {log.isTampered && (
                          <span className="text-red-400">⚠️ Discrepancy with original root anchor detected</span>
                        )}
                      </div>
                      <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-300 text-[11px] overflow-x-auto">
                        {JSON.stringify(log.payload, null, 2)}
                      </pre>
                    </div>

                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

    </div>
  )
}
