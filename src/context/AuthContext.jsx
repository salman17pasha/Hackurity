import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { generateSessionSignature, verifySessionIntegrity } from '../utils/crypto'

const AuthContext = createContext(null)

const STORAGE_KEY = 'govchain_sentinel_session'
const THEME_KEY = 'govchain_sentinel_theme'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (verifySessionIntegrity(parsed)) {
          return Object.freeze({ ...parsed })
        } else {
          console.warn('[RBAC INTEGRITY VIOLATION] Session tampering detected. Session purged.')
          localStorage.removeItem(STORAGE_KEY)
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
    return null
  })

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || 'dark'
    } catch {
      return 'dark'
    }
  })

  // Logout confirmation modal state
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

  // Validate session integrity and store immutable session state
  useEffect(() => {
    try {
      if (user) {
        if (!verifySessionIntegrity(user)) {
          console.error('[RBAC CRITICAL ALERT] In-memory user state tampered. Terminating session.')
          localStorage.removeItem(STORAGE_KEY)
          setUser(null)
          return
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      // ignore
    }
  }, [user])

  // Cross-tab & DevTools localStorage tampering defense
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY) {
        if (!e.newValue) {
          setUser(null)
          return
        }
        try {
          const parsed = JSON.parse(e.newValue)
          if (!verifySessionIntegrity(parsed)) {
            console.error('[RBAC CRITICAL ALERT] External localStorage role manipulation detected. Evicting session.')
            localStorage.removeItem(STORAGE_KEY)
            setUser(null)
          } else {
            setUser(Object.freeze({ ...parsed }))
          }
        } catch {
          localStorage.removeItem(STORAGE_KEY)
          setUser(null)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      // ignore
    }

    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
      document.body.classList.add('dark')
      document.body.classList.remove('light')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
      document.body.classList.remove('dark')
      document.body.classList.add('light')
    }
  }, [theme])

  const login = ({ name, email, role }) => {
    // Strictly validate assigned role upon login
    const assignedRole = role === 'Admin' ? 'Admin' : 'Normal User'
    const clearance = assignedRole === 'Admin' 
      ? 'LEVEL-5 DIRECTIVE ACCESS' 
      : 'LEVEL-2 FIELD AUDITOR'
    
    const userEmail = email || (assignedRole === 'Admin' ? 'admin@sentinel.gov.in' : 'auditor@sentinel.gov.in')
    const userName = name || (assignedRole === 'Admin' ? 'Director Arjun Varma' : 'Officer Priya Sen')
    const sessionStart = new Date().toISOString()

    const signature = generateSessionSignature({
      email: userEmail,
      role: assignedRole,
      clearance,
      sessionStart
    })

    const newUser = Object.freeze({
      name: userName,
      email: userEmail,
      role: assignedRole,
      ip: '10.42.18.99 (GovNet-VPC Tier-4)',
      sessionStart,
      token: `0x${signature}`,
      clearance,
      signature
    })

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
    } catch {
      // ignore
    }

    setUser(newUser)
    return newUser
  }

  const logout = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
    setUser(null)
  }

  const openLogoutModal = () => setIsLogoutModalOpen(true)
  const closeLogoutModal = () => setIsLogoutModalOpen(false)

  const confirmLogout = (onSuccess) => {
    logout()
    setIsLogoutModalOpen(false)
    if (typeof onSuccess === 'function') {
      onSuccess()
    }
  }

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  // Privilege escalation is strictly disabled by RBAC policy
  const switchRole = useCallback((_attemptedRole) => {
    console.warn('[RBAC POLICY VIOLATION] Dynamic role escalation blocked. Sessions are immutable.')
    return false
  }, [])

  const validateSession = useCallback(() => {
    if (!user) return false
    return verifySessionIntegrity(user)
  }, [user])

  const isAdmin = user?.role === 'Admin' && verifySessionIntegrity(user)
  const isNormalUser = user?.role === 'Normal User' && verifySessionIntegrity(user)

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAdmin,
        isNormalUser,
        validateSession,
        login, 
        logout, 
        theme, 
        toggleTheme, 
        switchRole,
        isLogoutModalOpen,
        openLogoutModal,
        closeLogoutModal,
        confirmLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

