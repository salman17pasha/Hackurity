import { useState } from 'react'
import { 
  Link as LinkIcon, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  GitCommit, 
  Info, 
  Copy,
  Hash,
  ChevronRight,
  Database
} from 'lucide-react'
import { useRouter } from '../context/RouterContext'
import { useAudit } from '../context/AuditContext'
import { useLanguage } from '../context/LanguageContext'

export default function HashChainPage() {
  const { navigate } = useRouter()
  const { logs, lastVerificationResult } = useAudit()
  const { t } = useLanguage()
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(0)
  const [copiedText, setCopiedText] = useState(null)

  const selectedBlock = logs[selectedBlockIndex] || logs[0]

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text)
    setCopiedText(text)
    setTimeout(() => setCopiedText(null), 2000)
  }

  return (
    <div className="min-h-screen cyber-grid py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Top Breadcrumb & Header */}
      <div className="pb-6 mb-6 border-b border-slate-800">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center space-x-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors mb-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('chainReturnDash')}</span>
        </button>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-100">
              {t('chainHeaderTitle')}
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              {t('chainHeaderDesc')}
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
              {t('chainLengthLabel')} <strong className="text-cyan-400">{logs.length} {t('cardLogsBadge')}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Visual Block Chain Sequence Diagram / Timeline */}
      <div className="mb-8 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-sm overflow-x-auto">
        <div className="text-xs font-mono text-slate-400 mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GitCommit className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-200">{t('chainInteractiveTitle')}</span>
          </div>
          <span className="text-slate-500 text-[11px]">{t('chainInteractiveSubtitle')}</span>
        </div>

        {/* Chain Flow Nodes */}
        <div className="flex items-center space-x-3 min-w-max py-4 px-2">
          {logs.map((block, index) => {
            const isSelected = selectedBlockIndex === index
            const isBroken = index > 0 && block.prevHash !== logs[index - 1].currentHash

            return (
              <div key={block.id} className="flex items-center">
                {/* Block Node Card */}
                <div
                  onClick={() => setSelectedBlockIndex(index)}
                  className={`p-4 rounded-xl border cursor-pointer select-none transition-all duration-200 flex flex-col justify-between w-48 ${
                    isSelected
                      ? block.isTampered || isBroken
                        ? 'bg-red-950/60 border-red-500 shadow-crimson-glow scale-105'
                        : 'bg-cyan-950/60 border-cyan-400 shadow-cyan-glow scale-105'
                      : block.isTampered || isBroken
                        ? 'bg-red-950/20 border-red-500/50 hover:border-red-400'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="font-bold text-slate-200">#{block.blockHeight}</span>
                    {block.isTampered || isBroken ? (
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    )}
                  </div>
                  <div className="text-xs font-bold text-slate-300 truncate mb-1">
                    {block.title}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 truncate">
                    {block.department}
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-cyan-400 truncate">
                    {block.currentHash.substring(0, 10)}...
                  </div>
                </div>

                {/* Connector arrow between blocks */}
                {index < logs.length - 1 && (
                  <div className="px-2 flex items-center">
                    <div className={`h-0.5 w-6 ${
                      isBroken ? 'bg-red-500 animate-pulse' : 'bg-slate-700'
                    }`} />
                    <ChevronRight className={`w-4 h-4 -ml-1 ${
                      isBroken ? 'text-red-500' : 'text-slate-600'
                    }`} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Selected Block Forensic Details Inspection */}
      {selectedBlock && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
          
          {/* Left 2 Cols: Deep Cryptographic Derivation */}
          <div className="lg:col-span-2 space-y-6">
            <div className={`p-6 rounded-2xl border bg-slate-900/90 backdrop-blur-sm ${
              selectedBlock.isTampered ? 'border-red-500/60 shadow-crimson-glow' : 'border-slate-800'
            }`}>
              
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    selectedBlock.isTampered ? 'bg-red-950 text-red-400 border border-red-500/40' : 'bg-cyan-950 text-cyan-400 border border-cyan-500/40'
                  }`}>
                    <Hash className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-100">
                      {t('chainProofTitle', { block: selectedBlock.blockHeight })}
                    </h2>
                    <p className="text-xs text-slate-400">
                      Record ID: {selectedBlock.id} // {selectedBlock.department}
                    </p>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                  selectedBlock.isTampered 
                    ? 'bg-red-950/70 border-red-500/60 text-red-300' 
                    : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                }`}>
                  {selectedBlock.isTampered ? t('chainDivergenceBadge') : t('chainSealedBadge')}
                </span>
              </div>

              {/* Plain-Language Formula Explainer */}
              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 mb-6 text-slate-300 space-y-2">
                <div className="text-[11px] font-bold text-cyan-400 uppercase">
                  {t('chainFormulaTitle')}
                </div>
                <div className="text-[11px] text-slate-300 bg-slate-900 p-2.5 rounded border border-slate-800 font-sans">
                  {t('chainFormulaNote')}
                </div>
              </div>

              {/* Hash Values Comparison */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                    <span>{t('chainPrevHashLabel')}</span>
                    <button
                      onClick={() => copyToClipboard(selectedBlock.prevHash)}
                      className="text-cyan-400 hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedText === selectedBlock.prevHash ? t('logsCopied') : t('logsCopyTooltip')}</span>
                    </button>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 break-all">
                    {selectedBlock.prevHash}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                    <span>{t('chainCurrHashLabel')}</span>
                    <button
                      onClick={() => copyToClipboard(selectedBlock.currentHash)}
                      className="text-cyan-400 hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedText === selectedBlock.currentHash ? t('logsCopied') : t('logsCopyTooltip')}</span>
                    </button>
                  </div>
                  <div className={`p-3 rounded-lg border break-all font-bold ${
                    selectedBlock.isTampered 
                      ? 'bg-red-950/50 border-red-500/80 text-red-300' 
                      : 'bg-slate-950 border-cyan-500/40 text-cyan-300'
                  }`}>
                    {selectedBlock.currentHash}
                  </div>
                </div>

                {selectedBlock.isTampered && (
                  <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 space-y-1">
                    <div className="font-bold flex items-center space-x-1.5">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span>{t('chainAnomalyTitle')}</span>
                    </div>
                    <p className="text-[11px] text-red-300/80">
                      {t('chainAnomalyDesc')}
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Right 1 Col: Metadata and Raw Payload */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider pb-3 border-b border-slate-800">
                {t('chainMetadataTitle')}
              </h3>

              <div className="space-y-2.5">
                <div>
                  <div className="text-slate-500 text-[10px]">{t('chainTime')}</div>
                  <div className="text-slate-200 mt-0.5">{selectedBlock.timestamp}</div>
                </div>

                <div>
                  <div className="text-slate-500 text-[10px]">{t('chainActor')}</div>
                  <div className="text-slate-200 mt-0.5">{selectedBlock.actor}</div>
                </div>

                <div>
                  <div className="text-slate-500 text-[10px]">{t('chainAction')}</div>
                  <div className="text-cyan-300 mt-0.5">{selectedBlock.action}</div>
                </div>

                <div>
                  <div className="text-slate-500 text-[10px]">{t('chainProofTx')}</div>
                  <div className="text-slate-300 break-all text-[10px] mt-0.5">{selectedBlock.onChainTx}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <div className="text-slate-500 text-[10px] mb-2 uppercase">{t('chainRecordPayload')}</div>
                <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-300 overflow-x-auto max-h-56">
                  {JSON.stringify(selectedBlock.payload, null, 2)}
                </pre>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  )
}
