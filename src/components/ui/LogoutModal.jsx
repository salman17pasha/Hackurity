import { useEffect } from 'react'
import { ShieldAlert, LogOut, X, AlertTriangle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useRouter } from '../../context/RouterContext'

export default function LogoutModal() {
  const { isLogoutModalOpen, closeLogoutModal, confirmLogout, user } = useAuth()
  const { navigate } = useRouter()

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isLogoutModalOpen) {
        closeLogoutModal()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLogoutModalOpen, closeLogoutModal])

  if (!isLogoutModalOpen) return null

  const handleOkay = () => {
    confirmLogout(() => {
      navigate('/login')
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {/* Modal Backdrop Card */}
      <div 
        className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden p-6 text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-title"
      >
        {/* Top Warning Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-400 to-red-500" />

        {/* Close Icon Button */}
        <button
          onClick={closeLogoutModal}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
          title="Cancel and close"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-xl bg-red-950/70 border border-red-500/50 text-red-400 shadow-crimson-glow shrink-0">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-red-950/80 border border-red-500/40 text-red-300">
                Security Directive
              </span>
            </div>
            <h3 id="logout-title" className="text-lg font-bold text-slate-100">
              Confirm Session Termination
            </h3>
            <p className="text-sm font-semibold text-slate-200 mt-2">
              Are you sure you want to log out?
            </p>
          </div>
        </div>

        {/* Context Information */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono text-slate-400 space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-500">Active Operator:</span>
            <span className="text-slate-200 font-semibold">{user?.name || 'Authorized Auditor'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Clearance Tier:</span>
            <span className="text-cyan-400">{user?.clearance || 'LEVEL-2 FIELD AUDITOR'}</span>
          </div>
          <p className="pt-2 text-[11px] text-slate-400 border-t border-slate-800/80">
            Terminating your session will revoke cryptographic authentication tokens and return you to the access portal.
          </p>
        </div>

        {/* Actions: Cancel and Okay buttons */}
        <div className="mt-6 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={closeLogoutModal}
            className="px-4 py-2.5 rounded-xl text-xs font-mono font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all"
          >
            Cancel
          </button>
          
          <button
            type="button"
            id="btn-confirm-logout"
            onClick={handleOkay}
            className="px-6 py-2.5 rounded-xl text-xs font-mono font-bold text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-crimson-glow transition-all flex items-center space-x-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Okay</span>
          </button>
        </div>
      </div>
    </div>
  )
}
