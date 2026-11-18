import { useState } from 'react'
import { Shield, ShieldAlert, LogOut, Moon, Sun, Lock, Bot, Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useRouter } from '../../context/RouterContext'
import { useAudit } from '../../context/AuditContext'
import { useLanguage } from '../../context/LanguageContext'
import LanguageSwitcher from '../ui/LanguageSwitcher'

export default function Navbar() {
  const { user, isAdmin, openLogoutModal, theme, toggleTheme } = useAuth()
  const { currentPath, navigate } = useRouter()
  const { lastVerificationResult } = useAudit()
  const { t } = useLanguage()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isTampered = lastVerificationResult.status === 'TAMPERED'

  const navLinks = [
    { label: t('navOverview'), path: '/' },
    { label: t('navDashboard'), path: '/dashboard', authRequired: true },
    { label: t('navLogs'), path: '/dashboard/logs', authRequired: true },
    { label: t('navHashChain'), path: '/dashboard/hash-chain', authRequired: true },
    { label: t('navVerify'), path: '/dashboard/verify', authRequired: true },
    ...(isAdmin ? [
      { label: t('navSimulations'), path: '/dashboard/simulations', authRequired: true, adminOnly: true },
      { label: t('navSmartContract'), path: '/dashboard/smart-contract', authRequired: true, adminOnly: true }
    ] : []),
    { label: t('navSettings'), path: '/dashboard/settings', authRequired: true }
  ]

  const handleNavClick = (path) => {
    navigate(path)
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Logo */}
        <div 
          onClick={() => handleNavClick('/')}
          className="flex items-center space-x-3 cursor-pointer group select-none shrink-0"
        >
          <div className={`p-2 rounded-lg border transition-all duration-300 ${
            isTampered 
              ? 'bg-red-950/40 border-red-500/50 text-red-400 shadow-crimson-glow' 
              : 'bg-cyan-950/40 border-cyan-500/40 text-cyan-400 group-hover:border-cyan-400 group-hover:shadow-cyan-glow'
          }`}>
            {isTampered ? <ShieldAlert className="w-5 h-5 animate-pulse" /> : <Shield className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base font-extrabold tracking-wider text-slate-100 group-hover:text-cyan-400 transition-colors">
                {t('brandTitle')} <span className="text-cyan-400 font-mono">{t('brandSubtitle')}</span>
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono tracking-widest uppercase bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 rounded">
                {t('versionBadge')}
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 hidden md:block">
              {t('tagline')}
            </p>
          </div>
        </div>

        {/* Navigation Links for Desktop */}
        <nav className="hidden xl:flex items-center space-x-1">
          {navLinks.map((link) => {
            if (link.authRequired && !user) return null
            const isActive = currentPath === link.path
            return (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`px-2.5 py-1.5 text-xs font-mono font-medium rounded-md transition-all duration-150 flex items-center space-x-1 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                {link.adminOnly && <Lock className="w-3 h-3 text-red-400 shrink-0" />}
                <span>{link.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          
          {/* System Mesh Status Badge */}
          <div className={`hidden 2xl:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border whitespace-nowrap ${
            isTampered 
              ? 'bg-red-950/50 border-red-500/60 text-red-400 shadow-crimson-glow animate-pulse' 
              : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isTampered ? 'bg-red-500' : 'bg-emerald-400 animate-ping'}`} />
            <span>{isTampered ? t('meshStatusAlert') : t('meshStatusOptimal')}</span>
          </div>

          {/* Multilingual Language Switcher Dropdown (Task 1) */}
          <LanguageSwitcher />

          {/* Sentinel AI Assistant Quick Launcher */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-sentinel-ai'))}
            title={t('aiGuideBtn')}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 text-xs font-mono shadow-cyan-glow transition-all cursor-pointer shrink-0"
          >
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden lg:inline">{t('aiGuideBtn')}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? t('switchThemeLight') : t('switchThemeDark')}
            className="p-2 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-cyan-400 hover:border-slate-700 transition-colors shrink-0 cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Session Info or Access Portal */}
          {user ? (
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <div 
                onClick={() => handleNavClick('/dashboard/settings')}
                className="cursor-pointer flex items-center space-x-2 px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-900/80 hover:border-cyan-500/40 transition-all"
              >
                <div className={`w-2 h-2 rounded-full ${user.role === 'Admin' ? 'bg-cyan-400 shadow-cyan-glow' : 'bg-emerald-400'}`} />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-slate-200 leading-tight">
                    {user.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] font-mono text-cyan-400 uppercase leading-none">
                    {user.role}
                  </div>
                </div>
              </div>

              <button
                id="btn-navbar-logout"
                onClick={openLogoutModal}
                title={t('logoutBtn')}
                className="p-2 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-red-400 hover:border-red-900/40 transition-colors shrink-0 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNavClick('/login')}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-mono font-semibold tracking-wide bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-glow transition-all whitespace-nowrap cursor-pointer shrink-0"
            >
              {t('accessPortalBtn')}
            </button>
          )}

          {/* Mobile Menu Toggle Button for Screens < xl */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

        </div>

      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-800 bg-slate-950/95 px-4 pt-3 pb-4 space-y-1.5 animate-fadeIn">
          {navLinks.map((link) => {
            if (link.authRequired && !user) return null
            const isActive = currentPath === link.path
            return (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`w-full text-left px-3.5 py-2.5 text-xs font-mono font-medium rounded-lg transition-all flex items-center space-x-2 ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                {link.adminOnly && <Lock className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                <span>{link.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </header>
  )
}
