import { useState, useEffect } from 'react'
import { 
  Settings, 
  ArrowLeft, 
  Moon, 
  Sun, 
  LogOut, 
  UserCheck, 
  Clock,
  Lock
} from 'lucide-react'
import { useRouter } from '../context/RouterContext'
import { useAuth } from '../context/AuthContext'

export default function SettingsPage() {
  const { navigate } = useRouter()
  const { user, isAdmin, openLogoutModal, theme, toggleTheme } = useAuth()

  const [elapsedTime, setElapsedTime] = useState('00:00:00')
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [autoLockMinutes, setAutoLockMinutes] = useState(15)

  // Live session timer
  useEffect(() => {
    if (!user?.sessionStart) return

    const startTime = new Date(user.sessionStart).getTime()

    const interval = setInterval(() => {
      const diff = Math.max(0, Math.floor((Date.now() - startTime) / 1000))
      const hours = Math.floor(diff / 3600).toString().padStart(2, '0')
      const minutes = Math.floor((diff % 3600) / 60).toString().padStart(2, '0')
      const seconds = Math.floor(diff % 60).toString().padStart(2, '0')
      setElapsedTime(`${hours}:${minutes}:${seconds}`)
    }, 1000)

    return () => clearInterval(interval)
  }, [user?.sessionStart])

  return (
    <div className="min-h-screen cyber-grid py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      
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
              Settings & Active Session Panel
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Operator identity management, cryptographic session telemetry, and SOC appearance.
            </p>
          </div>

          <button
            onClick={() => {
              logout()
              navigate('/login')
            }}
            className="px-4 py-2 rounded-xl text-xs font-mono bg-red-950/60 border border-red-500/50 hover:bg-red-900/60 text-red-300 transition-all flex items-center space-x-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Terminate Session</span>
          </button>
        </div>
      </div>

      <div className="space-y-6 font-mono text-xs">
        
        {/* Active Session Identity Card */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-sm space-y-4">
          <div className="flex items-center space-x-2 text-cyan-400 pb-3 border-b border-slate-800">
            <UserCheck className="w-4 h-4" />
            <h2 className="text-sm font-bold text-slate-200 uppercase">
              Active Operator Session Telemetry
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-slate-500 text-[10px] uppercase">OPERATOR NAME & EMAIL</div>
              <div className="text-sm font-bold text-slate-100">{user?.name || 'Authorized Auditor'}</div>
              <div className="text-slate-400">{user?.email || 'operator@sentinel.gov.in'}</div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-slate-500 text-[10px] uppercase">BOUND NETWORK IP</div>
              <div className="text-sm font-bold text-cyan-400">{user?.ip}</div>
              <div className="text-slate-400 text-[11px]">GovNet Tier-4 Encrypted Tunnel</div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-slate-500 text-[10px] uppercase">SESSION DURATION</div>
              <div className="text-sm font-bold text-emerald-400 flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{elapsedTime}</span>
              </div>
              <div className="text-slate-400 text-[11px]">
                Started: {new Date(user?.sessionStart).toLocaleTimeString()}
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-slate-500 text-[10px] uppercase">SESSION SIGNING TOKEN</div>
              <div className="text-sm font-bold text-slate-300 break-all">{user?.token}</div>
              <div className="text-slate-400 text-[11px]">HMAC-SHA256 Authenticated</div>
            </div>
          </div>

          {/* Immutable Clearance & RBAC Role Status */}
          <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-slate-300 font-bold flex items-center space-x-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                <span>Clearance Level & RBAC Role Status</span>
              </div>
              <div className="text-slate-500 text-[11px] mt-0.5">
                Session role is cryptographically signed and immutable. Role switching is disabled in accordance with RBAC AC-3 policy.
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800">
              <div className={`w-2.5 h-2.5 rounded-full ${isAdmin ? 'bg-purple-400 shadow-purple-glow' : 'bg-emerald-400'}`} />
              <div>
                <div className="text-xs font-mono font-bold text-slate-200">{user?.role}</div>
                <div className="text-[10px] font-mono text-cyan-400">{user?.clearance}</div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-700 text-slate-400 uppercase">
                IMMUTABLE
              </span>
            </div>
          </div>
        </div>

        {/* Display & SOC Theme Settings */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-sm space-y-4">
          <div className="flex items-center space-x-2 text-cyan-400 pb-3 border-b border-slate-800">
            <Settings className="w-4 h-4" />
            <h2 className="text-sm font-bold text-slate-200 uppercase">
              Display & Operations Center Appearance
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <div className="font-bold text-slate-200">Aesthetic Palette Mode</div>
              <div className="text-slate-500 text-[11px]">
                {theme === 'dark' 
                  ? 'Cyber-security Operations Center (SOC) Dark Theme (bg-slate-950, cyan & emerald accents)'
                  : 'Standard High-Contrast Light Theme for daylight inspection'}
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-slate-200 flex items-center space-x-2 transition-all"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
              <span>Switch to {theme === 'dark' ? 'Light Theme' : 'SOC Dark Theme'}</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <div className="font-bold text-slate-200">Real-Time Tamper Audio & Visual Alerts</div>
              <div className="text-slate-500 text-[11px]">
                Flash crimson beacons on screen when SHA-256 discrepancy is detected.
              </div>
            </div>

            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`px-4 py-2 rounded-xl border transition-all ${
                notificationsEnabled
                  ? 'bg-cyan-950/70 border-cyan-500/40 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              {notificationsEnabled ? 'Alerts: ENABLED' : 'Alerts: MUTED'}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <div className="font-bold text-slate-200">Session Inactivity Lockout</div>
              <div className="text-slate-500 text-[11px]">
                Automatically redirect to secure login if operator is idle.
              </div>
            </div>

            <select
              value={autoLockMinutes}
              onChange={(e) => setAutoLockMinutes(Number(e.target.value))}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs font-mono outline-none"
            >
              <option value={5}>5 Minutes</option>
              <option value={15}>15 Minutes</option>
              <option value={30}>30 Minutes</option>
              <option value={60}>60 Minutes</option>
            </select>
          </div>
        </div>

        {/* Account Redirection & Logout Strip */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="font-bold text-slate-200">Session Controls & Clearance Termination</div>
            <div className="text-slate-500 text-[11px]">
              Switch operator credentials or safely terminate cryptographic session tokens.
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2.5 rounded-xl font-mono text-xs bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors"
            >
              Switch Account &rarr;
            </button>
            <button
              onClick={openLogoutModal}
              className="px-4 py-2.5 rounded-xl font-mono text-xs bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-500/40 hover:border-red-400 shadow-crimson-glow transition-all flex items-center space-x-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  )
}
