import { useState, useEffect } from 'react'
import { 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  FileText, 
  Lock, 
  User, 
  Key, 
  Shield, 
  Clock, 
  FileCheck2,
  ExternalLink,
  AlertCircle
} from 'lucide-react'
import { useRouter } from '../context/RouterContext'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

export default function LoginSuccessPage() {
  const { user } = useAuth()
  const { navigate } = useRouter()
  const { t } = useLanguage()
  const [agreed, setAgreed] = useState(false)
  const [hasScrolledTerms, setHasScrolledTerms] = useState(false)

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  if (!user) {
    return null
  }

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      setHasScrolledTerms(true)
    }
  }

  const handleContinue = () => {
    if (agreed) {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen cyber-grid py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 cyber-radial-overlay pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        
        {/* Top Header Card */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-400 shadow-emerald-glow mb-3 animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-emerald-500/40 text-emerald-300 text-xs font-mono mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>SESSION ATTESTED // DIGITALLY SEALED</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            {t('loginSuccessTitle')}
          </h1>
          <p className="mt-1 text-xs font-mono text-slate-400">
            {t('loginSuccessSubtitle')}
          </p>
        </div>

        {/* Authenticated User Session Card */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-xl font-mono text-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-950/70 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-200 text-sm">{user.name}</div>
                <div className="text-slate-400 text-[11px]">{user.email}</div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                user.role === 'Admin' 
                  ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300 shadow-cyan-glow' 
                  : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
              }`}>
                {user.role} CLEARANCE
              </span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400">
            <div>
              <span className="text-slate-500">Node IP:</span>{' '}
              <span className="text-slate-300">{user.ip || '10.42.18.99 (GovNet-VPC)'}</span>
            </div>
            <div>
              <span className="text-slate-500">Session Token:</span>{' '}
              <span className="text-cyan-300 break-all">{user.token || '0x8fa1...d90b4e'}</span>
            </div>
          </div>
        </div>

        {/* Privacy Policy & Terms Container */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-2xl relative">
          
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2 text-slate-200 font-mono text-xs font-bold uppercase tracking-wider">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>{t('loginTermsTitle')}</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              Protocol v2.4-GOV
            </span>
          </div>

          {/* Scrollable Terms Content */}
          <div 
            onScroll={handleScroll}
            className="max-h-60 sm:max-h-64 overflow-y-auto pr-2 space-y-4 text-xs font-mono text-slate-300 leading-relaxed rounded-xl p-4 bg-slate-950/80 border border-slate-800/90"
          >
            <div>
              <h3 className="font-bold text-cyan-300 text-xs uppercase mb-1">
                1. Sovereign Data Privacy & Governance Protocol
              </h3>
              <p className="text-slate-400 text-[11px]">
                GovChain Sentinel processes government audit event streams, judicial records, land deeds, and public fund releases under strict National Sovereign Data Protection standards. All telemetry transmitted to this workstation is protected end-to-end.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-cyan-300 text-xs uppercase mb-1">
                2. Tamper-Proof Digital Seals & Verification
              </h3>
              <p className="text-slate-400 text-[11px]">
                By entering the Sentinel environment, you acknowledge that every audit log entry is bound via sequential SHA-256 digital seals and binary Merkle tree root commitments anchored to decentralized public smart contracts.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-cyan-300 text-xs uppercase mb-1">
                3. Operational Access, Security Clearance & Authorization
              </h3>
              <p className="text-slate-400 text-[11px]">
                Access to the Sentinel dashboard is role-segregated. Administrator credentials permit full access to safety simulation labs and certification generation. Citizen auditor accounts retain full read-only verification privileges.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-cyan-300 text-xs uppercase mb-1">
                4. Continuous Public Transparency Agreement
              </h3>
              <p className="text-slate-400 text-[11px]">
                Your auditor actions, including log inspection and verification engine executions, are committed to the forensic audit log.
              </p>
            </div>
          </div>

          {/* Interactive Checkbox Section */}
          <div className="mt-4 pt-4 border-t border-slate-800">
            <label className="flex items-start space-x-3 cursor-pointer group select-none">
              <input
                type="checkbox"
                id="termsCheckbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-500/40 cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-300 group-hover:text-slate-100 transition-colors">
                {t('loginTermsAgree')}
              </span>
            </label>
          </div>

          {/* Continue Button */}
          <div className="mt-5">
            <button
              onClick={handleContinue}
              disabled={!agreed}
              className={`w-full py-3.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                agreed
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-glow transform hover:-translate-y-0.5'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/60'
              }`}
            >
              <span>{t('loginTermsContinue')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  )
}
