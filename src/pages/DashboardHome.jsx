import { 
  FileText, 
  Link as LinkIcon, 
  ShieldCheck, 
  ShieldAlert, 
  Settings, 
  FlaskConical, 
  Lock,
  Radio,
  FolderUp,
  Download,
  HardDrive,
  Cpu,
  Bot,
  Sparkles
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from '../context/RouterContext'
import { useAudit } from '../context/AuditContext'
import { useLanguage } from '../context/LanguageContext'
import CyberCard from '../components/ui/CyberCard'
import { downloadMalwareCertificate } from '../utils/certificateGenerator'

export default function DashboardHome() {
  const { user, isAdmin } = useAuth()
  const { navigate } = useRouter()
  const { t } = useLanguage()
  const { 
    logs, 
    lastVerificationResult, 
    isStreaming, 
    setIsStreaming,
    openFolderModal,
    importedFolderQueue,
    importedFolderName,
    malwareIncident,
    openMalwareModal
  } = useAudit()

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
                {t('dashOperatorBadge')}
              </span>
              <span className={`text-xs font-mono px-2.5 py-0.5 rounded-full border ${
                isAdmin 
                  ? 'bg-purple-950/60 border-purple-500/40 text-purple-300' 
                  : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              }`}>
                {t('dashRolePrefix')} {user?.role || 'Guest'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-2">
              {t('dashWelcome')} {user?.name || t('dashWelcomeDefault')}
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              {t('dashSessionInfo')} <span className="text-cyan-300">{user?.ip}</span> // {t('dashClearanceInfo')} <span className="text-emerald-400">{user?.clearance}</span>
            </p>
          </div>

          {/* RBAC Enforced Telemetry & Streaming Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
              <span className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-purple-400' : 'bg-emerald-400'} animate-pulse`} />
              <span className="text-slate-400">{t('dashRbacClearance')}</span>
              <span className={isAdmin ? 'text-purple-300 font-bold' : 'text-emerald-300 font-bold'}>
                {isAdmin ? t('dashAdminAccess') : t('dashAuditorAccess')}
              </span>
            </div>

            {/* Live Streaming Toggle */}
            <button
              onClick={() => setIsStreaming(!isStreaming)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono border transition-all flex items-center space-x-2 cursor-pointer ${
                isStreaming
                  ? 'bg-cyan-950/70 border-cyan-500/60 text-cyan-300 shadow-cyan-glow'
                  : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${isStreaming ? 'animate-pulse text-cyan-400' : ''}`} />
              <span>{isStreaming ? t('dashLiveStreamOn') : t('dashLiveStreamPaused')}</span>
            </button>

            {/* Folder Import Button */}
            <button
              onClick={openFolderModal}
              className="px-3.5 py-2 rounded-xl text-xs font-mono bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 shadow-cyan-glow transition-all flex items-center space-x-2 cursor-pointer"
            >
              <FolderUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t('dashImportFolder')}</span>
            </button>
          </div>

        </div>

        {/* Real-time System Metrics Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-500 text-[10px] uppercase">{t('dashActiveBlockHeight')}</div>
            <div className="text-lg font-bold text-slate-100 mt-0.5">#{latestBlock?.blockHeight || 1006}</div>
            <div className="text-[10px] text-cyan-400">{t('dashTotalLogs')} {blockCount}</div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-500 text-[10px] uppercase">{t('dashChainState')}</div>
            <div className={`text-lg font-bold mt-0.5 flex items-center space-x-1.5 ${
              isTampered ? 'text-red-400' : 'text-emerald-400'
            }`}>
              {isTampered ? (
                <>
                  <ShieldAlert className="w-4 h-4 shrink-0 animate-pulse" />
                  <span>{t('dashTamperDetected')}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>{t('dash100Verified')}</span>
                </>
              )}
            </div>
            <div className="text-[10px] text-slate-500">
              {isTampered ? t('dashRootDiscrepancy') : t('dashNistCompliant')}
            </div>
          </div>

          <div 
            onClick={() => isAdmin && navigate('/dashboard/smart-contract')}
            className={`p-3 rounded-xl border border-slate-800 transition-all ${
              isAdmin 
                ? 'bg-slate-950/60 hover:border-purple-500/50 cursor-pointer group' 
                : 'bg-slate-950/60'
            }`}
          >
            <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase">
              <span>{t('dashContractAnchor')}</span>
              {isAdmin && <span className="text-purple-400 group-hover:underline text-[9px] font-mono">{t('dashManageContract')}</span>}
            </div>
            <div className="text-xs font-mono text-cyan-300 truncate mt-1">
              0x9e7a...491b8f
            </div>
            <div className="text-[10px] text-emerald-400">{t('dashContractStatus')}</div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-500 text-[10px] uppercase">{t('dashConsensusTitle')}</div>
            <div className="text-lg font-bold text-slate-100 mt-0.5">{t('dashConsensusNodes')}</div>
            <div className="text-[10px] text-slate-400">{t('dashConsensusLatency')}</div>
          </div>
        </div>

      </div>

      {/* Malware / Tampering Incident Alert Banner */}
      {(isTampered || malwareIncident) && (
        <div className="mb-8 p-5 rounded-2xl bg-red-950/50 border border-red-500/60 shadow-crimson-glow animate-fadeIn">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-400 shrink-0">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-950 border border-red-500 text-red-300 font-bold uppercase">
                    SEV-1 SECURITY ALERT
                  </span>
                  <span className="text-xs font-mono text-red-400">
                    {t('incidentId')} {malwareIncident?.incidentId || 'INC-2026-MAL-DETECTED'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-100 mt-1">
                  {t('incidentTitle')}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5 font-mono">
                  {malwareIncident?.threatSignature || t('incidentSubtitle')}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <button
                onClick={openMalwareModal}
                className="px-3.5 py-2 rounded-xl text-xs font-mono bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 transition-colors cursor-pointer"
              >
                {t('incidentViewCert')}
              </button>
              <button
                onClick={() => downloadMalwareCertificate(malwareIncident)}
                className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-crimson-glow transition-all flex items-center space-x-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t('incidentDownloadCert')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Imported Folder Status Strip if files exist in queue */}
      {importedFolderQueue.length > 0 && (
        <div className="mb-8 p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 text-xs font-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center space-x-3">
            <HardDrive className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <span className="text-slate-400">{t('folderQueueTitle')} </span>
              <strong className="text-cyan-300 font-bold">{importedFolderName}</strong>
              <span className="text-slate-500 ml-2">({importedFolderQueue.length} {t('folderQueueFiles')})</span>
            </div>
          </div>

          <button
            onClick={openFolderModal}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 text-[11px] transition-colors cursor-pointer"
          >
            {t('folderReviewQueue')}
          </button>
        </div>
      )}

      {/* Sentinel AI Knowledge Assistant Banner */}
      <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-slate-950/90 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center space-x-3.5">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-400 shrink-0">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-slate-100 font-mono">
                {t('aiBannerTitle')}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-cyan-950 border border-cyan-500/40 text-cyan-300 rounded">
                {t('aiBannerBadge')}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {t('aiBannerDesc')}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-sentinel-ai', { detail: { prompt: t('aiPrompt1') } }))}
            className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-cyan-950/80 border border-slate-700/80 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 text-xs font-mono transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>{t('aiPrompt1')}</span>
          </button>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-sentinel-ai', { detail: { prompt: t('aiPrompt2') } }))}
            className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-cyan-950/80 border border-slate-700/80 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 text-xs font-mono transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>{t('aiPrompt2')}</span>
          </button>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-sentinel-ai', { detail: { prompt: t('aiPrompt3') } }))}
            className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-cyan-950/80 border border-slate-700/80 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 text-xs font-mono transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>{t('aiPrompt3')}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Card Grid Layout */}
      <div className="mb-6">
        <h2 className="text-lg font-bold font-mono text-slate-200 mb-1">
          {t('dashModulesTitle')}
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          {t('dashModulesSubtitle')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Live Log Stream Card */}
          <CyberCard
            title={t('cardLogsTitle')}
            subtitle={t('cardLogsSubtitle')}
            badge={`${blockCount} ${t('cardLogsBadge')}`}
            badgeVariant="cyan"
            icon={FileText}
            accentColor="cyan"
            footerText={t('cardLogsFooter')}
            onClick={() => navigate('/dashboard/logs')}
          >
            <p className="text-xs text-slate-400 mb-3">
              {t('cardLogsDesc')}
            </p>
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 font-mono text-[11px] space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>{t('cardLogsLatest')}</span>
                <span className="text-cyan-300 font-bold">{latestBlock?.id}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{t('cardLogsDept')}</span>
                <span className="text-slate-200">{latestBlock?.department}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{t('cardLogsState')}</span>
                <span className={isStreaming ? 'text-emerald-400' : 'text-amber-400'}>
                  {isStreaming ? t('cardLogsStateActive') : t('dashLiveStreamPaused')}
                </span>
              </div>
            </div>
          </CyberCard>

          {/* Card 2: Cryptographic Hash-Chain Card */}
          <CyberCard
            title={t('cardChainTitle')}
            subtitle={t('cardChainSubtitle')}
            badge={`${logs.length} ${t('cardChainBadge')}`}
            badgeVariant="cyan"
            icon={LinkIcon}
            accentColor="cyan"
            footerText={t('cardChainFooter')}
            onClick={() => navigate('/dashboard/hash-chain')}
          >
            <p className="text-xs text-slate-400 mb-3">
              {t('cardChainDesc')}
            </p>
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 font-mono text-[11px] space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>{t('cardChainLength')}</span>
                <span className="text-cyan-300 font-bold">#{latestBlock?.blockHeight}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{t('cardChainFirst')}</span>
                <span className="text-slate-300">00000000...0000</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{t('cardChainContinuity')}</span>
                <span className={isTampered ? 'text-red-400' : 'text-emerald-400'}>
                  {isTampered ? t('cardChainBroken') : t('cardChainIntact')}
                </span>
              </div>
            </div>
          </CyberCard>

          {/* Card 3: Verification Engine Card */}
          <CyberCard
            title={t('cardVerifyTitle')}
            subtitle={t('cardVerifySubtitle')}
            badge={isTampered ? t('cardVerifyBadgeAlert') : t('cardVerifyBadgeValid')}
            badgeVariant={isTampered ? 'red' : 'emerald'}
            icon={isTampered ? ShieldAlert : ShieldCheck}
            accentColor={isTampered ? 'red' : 'emerald'}
            footerText={t('cardVerifyFooter')}
            onClick={() => navigate('/dashboard/verify')}
          >
            <p className="text-xs text-slate-400 mb-3">
              {t('cardVerifyDesc')}
            </p>
            <div className={`p-3 rounded-lg border font-mono text-[11px] space-y-1 ${
              isTampered 
                ? 'bg-red-950/40 border-red-500/40 text-red-300' 
                : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
            }`}>
              <div className="flex justify-between">
                <span>{t('cardVerifyStatus')}</span>
                <span className="font-bold">{isTampered ? t('cardVerifyTampered') : t('cardVerifyValid')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{t('cardVerifyLastScan')}</span>
                <span className="text-slate-300">{new Date(lastVerificationResult.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{t('cardVerifyMatch')}</span>
                <span>{isTampered ? t('cardVerifyMismatch') : t('cardVerifyExact')}</span>
              </div>
            </div>
          </CyberCard>

          {/* Card 4: Settings & Session Card */}
          <CyberCard
            title={t('cardSettingsTitle')}
            subtitle={t('cardSettingsSubtitle')}
            badge={user?.role}
            badgeVariant="cyan"
            icon={Settings}
            accentColor="cyan"
            footerText={t('cardSettingsFooter')}
            onClick={() => navigate('/dashboard/settings')}
          >
            <p className="text-xs text-slate-400 mb-3">
              {t('cardSettingsDesc')}
            </p>
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 font-mono text-[11px] space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>{t('cardSettingsIP')}</span>
                <span className="text-cyan-300 truncate max-w-[150px]">{user?.ip}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{t('cardSettingsToken')}</span>
                <span className="text-slate-300">{user?.token}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{t('cardSettingsCipher')}</span>
                <span className="text-slate-300">AES-256-GCM</span>
              </div>
            </div>
          </CyberCard>

          {/* Card 5: Tamper Simulation Card (Admin Only) */}
          {isAdmin ? (
            <CyberCard
              title={t('cardSimTitle')}
              subtitle={t('cardSimSubtitle')}
              badge={t('cardSimBadge')}
              badgeVariant="amber"
              icon={FlaskConical}
              accentColor="amber"
              footerText={t('cardSimFooter')}
              onClick={() => navigate('/dashboard/simulations')}
            >
              <p className="text-xs text-slate-400 mb-3">
                {t('cardSimDesc')}
              </p>
              <div className="bg-amber-950/40 p-3 rounded-lg border border-amber-500/40 font-mono text-[11px] space-y-1 text-amber-300">
                <div className="flex justify-between">
                  <span>{t('cardSimLabState')}</span>
                  <span className="font-bold">{t('cardSimReady')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>{t('cardSimTypes')}</span>
                  <span className="text-slate-300">{t('cardSimTypesList')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>{t('cardSimState')}</span>
                  <span className={isTampered ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                    {isTampered ? t('cardSimTampered') : t('cardSimNormal')}
                  </span>
                </div>
              </div>
            </CyberCard>
          ) : (
            /* Restricted Tamper Simulation Card for Citizen / Field User */
            <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/60 opacity-80 relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-lg bg-slate-950 text-slate-500 border border-slate-800">
                      <Lock className="w-5 h-5 text-amber-500/70" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-400">
                        {t('cardSimRestrictedTitle')}
                      </h3>
                      <p className="text-xs font-mono text-slate-500">
                        {t('cardSimBadge')}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-950 text-amber-400 border border-amber-900/60 uppercase">
                    RESTRICTED
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  {t('cardSimRestrictedDesc')}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-500 text-[11px] font-mono flex items-center space-x-2">
                <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{t('cardSimRestrictedNote')}</span>
              </div>
            </div>
          )}

          {/* Card 6: Smart Contract Mesh (Admin Only) */}
          {isAdmin ? (
            <CyberCard
              title={t('cardContractTitle')}
              subtitle={t('cardContractSubtitle')}
              badge={t('cardContractBadge')}
              badgeVariant="purple"
              icon={Cpu}
              accentColor="purple"
              footerText={t('cardContractFooter')}
              onClick={() => navigate('/dashboard/smart-contract')}
            >
              <p className="text-xs text-slate-400 mb-3">
                {t('cardContractDesc')}
              </p>
              <div className="bg-purple-950/40 p-3 rounded-lg border border-purple-500/40 font-mono text-[11px] space-y-1 text-purple-300">
                <div className="flex justify-between">
                  <span>{t('cardContractNetwork')}</span>
                  <span className="font-bold text-slate-200">Ethereum L2 Sepolia</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>{t('cardContractNodes')}</span>
                  <span className="text-emerald-400">{t('cardContractNodesCount')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>{t('cardContractState')}</span>
                  <span className="text-cyan-300 truncate max-w-[140px]">0x9e7a...491b8f</span>
                </div>
              </div>
            </CyberCard>
          ) : (
            /* Restricted Smart Contract Card for Normal User */
            <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/60 opacity-80 relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-lg bg-slate-950 text-slate-500 border border-slate-800">
                      <Lock className="w-5 h-5 text-purple-500/70" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-400">
                        {t('cardContractRestrictedTitle')}
                      </h3>
                      <p className="text-xs font-mono text-slate-500">
                        {t('cardContractBadge')}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-950 text-purple-400 border border-purple-900/60 uppercase">
                    RESTRICTED
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  {t('cardContractRestrictedDesc')}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-500 text-[11px] font-mono flex items-center space-x-2">
                <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{t('cardContractRestrictedNote')}</span>
              </div>
            </div>
          )}

          {/* Card 7: Sentinel Citizen AI Assistant */}
          <CyberCard
            title={t('cardAiTitle')}
            subtitle={t('cardAiSubtitle')}
            badge={t('cardAiBadge')}
            badgeVariant="cyan"
            icon={Bot}
            accentColor="cyan"
            footerText={t('cardAiFooter')}
            onClick={() => window.dispatchEvent(new CustomEvent('open-sentinel-ai'))}
          >
            <p className="text-xs text-slate-400 mb-3">
              {t('cardAiDesc')}
            </p>
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 font-mono text-[11px] space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>{t('cardAiBase')}</span>
                <span className="text-cyan-300 font-bold">README.md (v2.4-SOC)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{t('cardAiContext')}</span>
                <span className="text-emerald-400">{t('cardAiContextCount')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{t('aiBannerBadge')}:</span>
                <span className="text-cyan-400 hover:underline">{t('cardAiAction')}</span>
              </div>
            </div>
          </CyberCard>

        </div>
      </div>

    </div>
  )
}
