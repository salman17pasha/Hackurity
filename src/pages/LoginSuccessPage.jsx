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

export default function LoginSuccessPage() {
  const { user } = useAuth()
  const { navigate } = useRouter()
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
            <span>SESSION ATTESTED // CRYPTOGRAPHICALLY SIGNED</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Login Successful
          </h1>
          <p className="mt-1 text-xs font-mono text-slate-400">
            Welcome to GovChain Sentinel SOC Command. Please review and accept protocol terms to continue.
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
              <span>Privacy Policy & Terms and Conditions</span>
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
                GovChain Sentinel processes government audit event streams, judicial records, land mutations, and treasury disbursements under strict National Sovereign Data Protection standards. All telemetry transmitted to this workstation is encrypted end-to-end via TLS 1.3. No sensitive citizen Personally Identifiable Information (PII) is cached or exported to non-sovereign nodes.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-cyan-300 text-xs uppercase mb-1">
                2. Cryptographic Immutability & Hash-Chain Verification
              </h3>
              <p className="text-slate-400 text-[11px]">
                By entering the Sentinel SOC environment, you acknowledge that every audit log entry is bound via sequential SHA-256 hashing and binary Merkle Tree root commitments anchored to decentralized Ethereum L2 smart contracts. Recomputation and verification algorithms execute client-side using the W3C Web Crypto API.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-cyan-300 text-xs uppercase mb-1">
                3. Operational Access, Security Clearance & Authorization
              </h3>
              <p className="text-slate-400 text-[11px]">
                Access to the Sentinel dashboard is role-segregated. Administrator credentials permit full access to adversarial tamper simulation labs, malware threat injections, and forensic certification generation. Normal Auditor accounts retain read-only verification and streaming log telemetry privileges. You agree not to distribute or share authenticated session credentials.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-cyan-300 text-xs uppercase mb-1">
                4. Adversarial Tamper Simulation & Ingestion Ethics
              </h3>
              <p className="text-slate-400 text-[11px]">
                The Tamper Simulation laboratory is strictly provided for hackathon demonstration, adversarial vulnerability testing, and educational verification of cryptographic fault tolerance. Any system file imported for SHA-256 analysis is processed locally in browser memory and tested against consensus state benchmarks.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-cyan-300 text-xs uppercase mb-1">
                5. Continuous Audit Trail & Attestation Agreement
              </h3>
              <p className="text-slate-400 text-[11px]">
                Your operator actions, including log inspection, certificate downloads, and verification engine executions, are committed to the forensic activity log. By clicking continue, you confirm authorization to view and audit sovereign cryptographic records.
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
                className="mt-0.5 w-4 h-4 rounded border-slate-700 text-cyan-500 focus:ring-cyan-400 focus:ring-offset-slate-900 bg-slate-950 cursor-pointer accent-cyan-500"
              />
              <div className="text-xs font-mono text-slate-300 group-hover:text-slate-100 transition-colors">
                <span className="font-semibold text-slate-200">
                  [x] I agree to the Privacy Terms & Conditions
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  I confirm compliance with GovChain Sentinel cryptographic governance and sovereign privacy protocols.
                </p>
              </div>
            </label>
          </div>

          {/* Action Button: Continue to Dashboard */}
          <div className="mt-5">
            <button
              type="button"
              id="continueDashboardBtn"
              disabled={!agreed}
              onClick={handleContinue}
              className={`w-full py-3.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                agreed 
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-glow transform hover:-translate-y-0.5 cursor-pointer' 
                  : 'bg-slate-800/80 border border-slate-700/60 text-slate-500 cursor-not-allowed opacity-60'
              }`}
            >
              <span>Continue to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {!agreed && (
              <p className="text-center text-[10px] font-mono text-slate-500 mt-2 flex items-center justify-center space-x-1">
                <AlertCircle className="w-3 h-3 text-amber-500/80" />
                <span>Please check the agreement box above to activate dashboard access</span>
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}
