import { useState, useRef, useEffect } from 'react'
import { Languages, ChevronDown, Check } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function LanguageSwitcher({ className = '', compact = false }) {
  const { language, setLanguage, languages, currentLanguageMeta } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleSelect = (code) => {
    setLanguage(code)
    setIsOpen(false)
  }

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        id="language-switcher-btn"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select Interface Language"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 hover:bg-slate-800/80 hover:border-cyan-500/40 text-slate-200 hover:text-cyan-300 text-xs font-mono transition-all cursor-pointer shadow-sm focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
      >
        <Languages className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span className="font-semibold">{currentLanguageMeta.native}</span>
        {!compact && (
          <span className="text-[10px] text-slate-500 uppercase hidden md:inline">
            ({currentLanguageMeta.code})
          </span>
        )}
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
      </button>

      {/* Accessible Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-labelledby="language-switcher-btn"
          className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-950/95 border border-slate-800 shadow-2xl py-1.5 z-50 backdrop-blur-md animate-fadeIn focus:outline-none"
        >
          <div className="px-3 py-1.5 border-b border-slate-800/80 text-[10px] font-mono uppercase text-slate-500 tracking-wider">
            Select Language
          </div>

          <div className="py-1">
            {languages.map((lang) => {
              const isSelected = lang.code === language
              return (
                <button
                  key={lang.code}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/70 text-cyan-300 font-bold border-l-2 border-cyan-400'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{lang.flag}</span>
                    <span className="font-medium">{lang.native}</span>
                    <span className="text-[10px] font-mono text-slate-500">
                      ({lang.label})
                    </span>
                  </div>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
