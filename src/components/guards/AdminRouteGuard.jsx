import { useEffect, useState } from 'react'
import { ShieldAlert, Lock, ArrowLeft, LogIn, AlertOctagon, Terminal } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useRouter } from '../../context/RouterContext'

/**
 * AdminRouteGuard
 * Higher-Order Component & Layout Wrapper that strictly blocks Normal Users
 * from accessing admin-restricted routes (/dashboard/simulations, /dashboard/smart-contract).
 * Displays a SOC Access Denied notification and safely redirects back to /dashboard.
 */
export default function AdminRouteGuard({ children }) {
  const { user, isAdmin, validateSession } = useAuth()
  const { navigate, currentPath } = useRouter()
  const [countdown, setCountdown] = useState(20)
  const [isPaused, setIsPaused] = useState(false)

  // Redirect unauthenticated users immediately
  useEffect(() => {
    if (!user || !validateSession()) {
      navigate('/login')
    }
  }, [user, validateSession, navigate])

  // Countdown timer for automatic return to normal dashboard
  useEffect(() => {
    if (user && !isAdmin && !isPaused) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            navigate('/dashboard')
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [user, isAdmin, isPaused, navigate])

  // If unauthenticated, show credential checking state
  if (!user || !validateSession()) {
    return (
      <div className="min-h-screen cyber-grid py-20 px-4 flex items-center justify-center">
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 text-center max-w-md font-mono text-xs">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto mb-4 animate-spin">
            <Lock className="w-6 h-6" />
          </div>
          <div className="font-bold text-slate-100 text-sm">Verifying Security Clearance...</div>
          <p className="text-slate-400 mt-2 text-[11px]">
            Checking cryptographic session token against GovChain Sentinel RBAC ACL...
          </p>
        </div>
      </div>
    )
  }

  // If authenticated but unauthorized (Normal User attempting Admin route)
  if (!isAdmin) {
    return (
      <div className="min-h-screen cyber-grid py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex items-center justify-center">
        <div className="w-full max-w-2xl p-6 sm:p-8 rounded-3xl bg-slate-900/95 border border-red-500/60 shadow-crimson-glow text-left backdrop-blur-xl relative overflow-hidden">
          
          {/* Background Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Alert Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-6 border-b border-red-900/60 gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-14 h-14 rounded-2xl bg-red-950/80 border border-red-500/50 flex items-center justify-center text-red-400 shadow-crimson-glow shrink-0">
                <ShieldAlert className="w-8 h-8 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-red-950 border border-red-500 text-red-300 font-bold uppercase tracking-wider">
                    403 FORBIDDEN // ACCESS DENIED
                  </span>
                  <span className="text-[11px] font-mono text-red-400 flex items-center space-x-1">
                    <AlertOctagon className="w-3.5 h-3.5 inline" />
                    <span>ACL VIOLATION</span>
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-100 mt-1">
                  Level-5 Administrative Clearance Required
                </h1>
              </div>
            </div>

            <div className="text-right sm:text-right w-full sm:w-auto">
              <div className="text-[10px] font-mono text-slate-500 uppercase">Auto-Redirect</div>
              <div className="text-sm font-mono font-bold text-red-400">
                {isPaused ? 'Redirect Paused' : `${countdown}s to Dashboard`}
              </div>
              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 underline block mt-0.5"
              >
                {isPaused ? 'Resume Countdown' : 'Pause Auto-Redirect'}
              </button>
            </div>
          </div>

          {/* Explanation Text */}
          <p className="text-xs font-mono text-slate-300 leading-relaxed mb-6">
            You are authenticated as <strong className="text-cyan-300">{user.name}</strong> under role{' '}
            <strong className="text-emerald-300">{user.role}</strong> ({user.clearance}). 
            Access to this operational vector (<code className="text-amber-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">{currentPath}</code>) 
            is restricted exclusively to Sentinel Directors with Level-5 Administrative Clearance. Dynamic role escalation is prohibited by RBAC policy.
          </p>

          {/* Telemetry Readout Box */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 font-mono text-xs space-y-2 mb-6">
            <div className="flex items-center justify-between text-slate-400 text-[11px] pb-2 border-b border-slate-800/80">
              <span className="flex items-center space-x-1.5 text-cyan-400">
                <Terminal className="w-3.5 h-3.5" />
                <span>SOC SECURITY ENFORCEMENT AUDIT</span>
              </span>
              <span className="text-slate-500">NIST SP 800-53 (AC-3 Enforcement)</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
              <div>
                <span className="text-slate-500">Operator Identity:</span>{' '}
                <span className="text-slate-300">{user.email}</span>
              </div>
              <div>
                <span className="text-slate-500">Security Clearance:</span>{' '}
                <span className="text-emerald-400 font-semibold">{user.clearance}</span>
              </div>
              <div>
                <span className="text-slate-500">Client Node:</span>{' '}
                <span className="text-slate-300">{user.ip}</span>
              </div>
              <div>
                <span className="text-slate-500">Enforcement Action:</span>{' '}
                <span className="text-red-400 font-bold">ROUTE_ACCESS_BLOCKED</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-mono text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-glow transition-all flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Standard Dashboard</span>
            </button>

            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-mono text-xs border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-all flex items-center justify-center space-x-2"
            >
              <LogIn className="w-4 h-4 text-cyan-400" />
              <span>Authenticate with Admin Account</span>
            </button>
          </div>

        </div>
      </div>
    )
  }

  // If user is Admin, grant full access
  return children
}

/**
 * Higher-Order Component (HOC) alternative: withAdminGuard(Component)
 */
export function withAdminGuard(Component) {
  return function ProtectedAdminComponent(props) {
    return (
      <AdminRouteGuard>
        <Component {...props} />
      </AdminRouteGuard>
    )
  }
}
