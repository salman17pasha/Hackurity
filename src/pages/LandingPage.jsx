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
  GitCommit,
  Bot,
  Sparkles
} from 'lucide-react'
import { useRouter } from '../context/RouterContext'
import { useAudit } from '../context/AuditContext'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

export default function LandingPage() {
  const { navigate } = useRouter()
  const { user } = useAuth()
  const { logs } = useAudit()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('problem') // 'problem' | 'solution' | 'architecture'

  const handleLaunchDashboard = () => {
    if (!user) {
      navigate('/login')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="relative min-h-screen cyber-grid pb-20">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 cyber-radial-overlay pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        
        {/* Citizen Security Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono mb-8 shadow-cyan-glow">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>{t('landingHeroBadge')}</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-100 max-w-5xl mx-auto leading-tight sm:leading-none">
          {t('landingHeroTitle1')} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
            {t('landingHeroTitle2')}
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed">
          {t('landingHeroSubtitle')}
        </p>

        {/* Primary CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-mono text-sm font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-glow transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>{t('landingCtaAccess')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleLaunchDashboard}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-mono text-sm font-semibold bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>{t('landingCtaDashboard')}</span>
          </button>

          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-sentinel-ai'))}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-mono text-sm font-semibold bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 shadow-cyan-glow transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>{t('landingCtaAi')}</span>
          </button>
        </div>

        {/* Live Network Telemetry Strip */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-slate-900/70 border border-slate-800/80 p-4 rounded-xl text-left backdrop-blur-sm">
            <div className="text-[11px] font-mono text-slate-400 uppercase">{t('landingStatBlocks')}</div>
            <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
              2,841,920
            </div>
            <div className="text-[10px] text-emerald-400 mt-1 flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5" />
              {t('landingStatBlocksSub')}
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800/80 p-4 rounded-xl text-left backdrop-blur-sm">
            <div className="text-[11px] font-mono text-slate-400 uppercase">{t('landingStatSpeed')}</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
              &lt; 4.2 ms
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {t('landingStatSpeedSub')}
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800/80 p-4 rounded-xl text-left backdrop-blur-sm">
            <div className="text-[11px] font-mono text-slate-400 uppercase">{t('landingStatNodes')}</div>
            <div className="text-2xl font-bold font-mono text-cyan-300 mt-1">
              12 Nodes
            </div>
            <div className="text-[10px] text-cyan-400 mt-1">
              {t('landingStatNodesSub')}
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800/80 p-4 rounded-xl text-left backdrop-blur-sm">
            <div className="text-[11px] font-mono text-slate-400 uppercase">{t('landingStatContinuity')}</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
              100.00%
            </div>
            <div className="text-[10px] text-emerald-400 mt-1">
              {t('landingStatContinuitySub')}
            </div>
          </div>
        </div>
      </section>

      {/* Problem vs Solution Interactive Overview Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100">
            {t('landingProblemVsSolution')}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            {t('landingProblemVsSolutionDesc')}
          </p>

          {/* Selector Tabs */}
          <div className="mt-8 inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs">
            <button
              onClick={() => setActiveTab('problem')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === 'problem'
                  ? 'bg-red-950/70 text-red-400 border border-red-500/40 shadow-crimson-glow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t('landingTabProblem')}
            </button>
            <button
              onClick={() => setActiveTab('solution')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === 'solution'
                  ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-500/40 shadow-emerald-glow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t('landingTabSolution')}
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === 'architecture'
                  ? 'bg-cyan-950/70 text-cyan-400 border border-cyan-500/40 shadow-cyan-glow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t('landingTabArch')}
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
                {t('landingProb1Title')}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {t('landingProb1Desc')}
              </p>
            </div>

            <div className="bg-slate-900/90 border border-red-900/40 p-6 rounded-2xl relative overflow-hidden group hover:border-red-500/50 transition-all">
              <div className="w-10 h-10 rounded-lg bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400 mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">
                {t('landingProb2Title')}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {t('landingProb2Desc')}
              </p>
            </div>

            <div className="bg-slate-900/90 border border-red-900/40 p-6 rounded-2xl relative overflow-hidden group hover:border-red-500/50 transition-all">
              <div className="w-10 h-10 rounded-lg bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400 mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">
                {t('landingProb3Title')}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {t('landingProb3Desc')}
              </p>
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
                {t('landingSol1Title')}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {t('landingSol1Desc')}
              </p>
            </div>

            <div className="bg-slate-900/90 border border-emerald-900/40 p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/50 transition-all">
              <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">
                {t('landingSol2Title')}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {t('landingSol2Desc')}
              </p>
            </div>

            <div className="bg-slate-900/90 border border-emerald-900/40 p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/50 transition-all">
              <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">
                {t('landingSol3Title')}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {t('landingSol3Desc')}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="bg-slate-900/90 border border-cyan-900/40 p-8 rounded-2xl animate-fadeIn">
            <h3 className="text-lg font-bold text-cyan-300 mb-4 font-mono">
              {t('landingArchTitle')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="text-xs font-mono text-cyan-400 mb-2">{t('landingArchStep1')}</div>
                <div className="text-sm font-semibold text-slate-200">{t('landingArchStep1Title')}</div>
                <p className="text-xs text-slate-400 mt-2">
                  {t('landingArchStep1Desc')}
                </p>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="text-xs font-mono text-cyan-400 mb-2">{t('landingArchStep2')}</div>
                <div className="text-sm font-semibold text-slate-200">{t('landingArchStep2Title')}</div>
                <p className="text-xs text-slate-400 mt-2">
                  {t('landingArchStep2Desc')}
                </p>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="text-xs font-mono text-cyan-400 mb-2">{t('landingArchStep3')}</div>
                <div className="text-sm font-semibold text-slate-200">{t('landingArchStep3Title')}</div>
                <p className="text-xs text-slate-400 mt-2">
                  {t('landingArchStep3Desc')}
                </p>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="text-xs font-mono text-cyan-400 mb-2">{t('landingArchStep4')}</div>
                <div className="text-sm font-semibold text-slate-200">{t('landingArchStep4Title')}</div>
                <p className="text-xs text-slate-400 mt-2">
                  {t('landingArchStep4Desc')}
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
                  {t('landingSnapshotTitle')}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                  CHAIN SYNCED
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {t('landingSnapshotSubtitle')}
              </p>
            </div>

            <button
              onClick={() => navigate('/dashboard/logs')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 transition-colors cursor-pointer"
            >
              {t('landingOpenLogsBtn')}
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
            {t('landingBottomCtaTitle')}
          </h2>
          <p className="mt-3 text-sm text-slate-400 max-w-xl mx-auto">
            {t('landingBottomCtaSubtitle')}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3.5 rounded-xl font-mono text-sm font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-glow transition-all cursor-pointer"
            >
              {t('landingCtaAccess')}
            </button>
            <button
              onClick={() => navigate('/dashboard/verify')}
              className="px-8 py-3.5 rounded-xl font-mono text-sm font-semibold bg-slate-900 border border-slate-700 hover:border-emerald-500/50 text-emerald-400 transition-all cursor-pointer"
            >
              {t('cardVerifyFooter')}
            </button>
          </div>
        </div>
      </section>

    </div>
  )
}
