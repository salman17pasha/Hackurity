import { ArrowRight } from 'lucide-react'

export default function CyberCard({
  title,
  subtitle,
  badge,
  badgeVariant = 'cyan', // 'cyan' | 'emerald' | 'red' | 'amber'
  icon: Icon,
  children,
  onClick,
  accentColor = 'cyan', // 'cyan' | 'emerald' | 'red' | 'amber'
  footerText = 'Access Module',
  className = ''
}) {
  const accentClasses = {
    cyan: {
      border: 'border-slate-800 hover:border-cyan-500/60',
      glow: 'hover:shadow-cyan-glow',
      iconBg: 'bg-cyan-950/50 text-cyan-400 border border-cyan-500/30',
      badgeBg: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40',
      footerHover: 'group-hover:text-cyan-400'
    },
    emerald: {
      border: 'border-slate-800 hover:border-emerald-500/60',
      glow: 'hover:shadow-emerald-glow',
      iconBg: 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/30',
      badgeBg: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40',
      footerHover: 'group-hover:text-emerald-400'
    },
    red: {
      border: 'border-red-900/60 hover:border-red-500/80',
      glow: 'hover:shadow-crimson-glow',
      iconBg: 'bg-red-950/50 text-red-400 border border-red-500/30',
      badgeBg: 'bg-red-950/60 text-red-300 border-red-500/40',
      footerHover: 'group-hover:text-red-400'
    },
    amber: {
      border: 'border-slate-800 hover:border-amber-500/60',
      glow: 'hover:shadow-[0_0_20px_-4px_rgba(245,158,11,0.3)]',
      iconBg: 'bg-amber-950/50 text-amber-400 border border-amber-500/30',
      badgeBg: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
      footerHover: 'group-hover:text-amber-400'
    }
  }

  const selected = accentClasses[accentColor] || accentClasses.cyan

  return (
    <div
      onClick={onClick}
      className={`group relative flex flex-col justify-between p-6 rounded-xl bg-slate-900/80 backdrop-blur-sm border transition-all duration-300 cursor-pointer overflow-hidden ${selected.border} ${selected.glow} ${className}`}
    >
      {/* Top subtle light streak on hover */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div>
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {Icon && (
              <div className={`p-2.5 rounded-lg transition-transform duration-300 group-hover:scale-110 ${selected.iconBg}`}>
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div>
              <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {badge && (
            <span className={`px-2 py-0.5 text-[11px] font-mono rounded border uppercase tracking-wider ${selected.badgeBg}`}>
              {badge}
            </span>
          )}
        </div>

        {/* Card Body content */}
        <div className="text-sm text-slate-300">
          {children}
        </div>
      </div>

      {/* Footer link row */}
      {footerText && (
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
          <span className={`transition-colors ${selected.footerHover}`}>
            {footerText}
          </span>
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      )}
    </div>
  )
}
