import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'govchain_sentinel_session'
const THEME_KEY = 'govchain_sentinel_theme'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {
      // ignore
    }
    // Default mock session for instant testing if preferred, or null
    return {
      name: "Commander Vikram Dev",
      email: "v.dev@sentinel.gov.in",
      role: "Admin", // 'Admin' | 'Normal User'
      ip: "10.42.18.99 (GovNet-VPC Tier-4)",
      sessionStart: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
      token: "0x8fa1...d90b4e",
      clearance: "LEVEL-5 DIRECTIVE ACCESS"
    }
  })

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || 'dark'
    } catch {
      return 'dark'
    }
  })

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      // ignore
    }
  }, [user])

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme)
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } catch {
      // ignore
    }
  }, [theme])

  const login = ({ name, email, role }) => {
    const newUser = {
      name: name || (role === 'Admin' ? 'Director Arjun Varma' : 'Officer Priya Sen'),
      email: email || (role === 'Admin' ? 'admin@sentinel.gov.in' : 'auditor@sentinel.gov.in'),
      role: role || 'Normal User',
      ip: '10.42.18.99 (GovNet-VPC Tier-4)',
      sessionStart: new Date().toISOString(),
      token: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
      clearance: role === 'Admin' ? 'LEVEL-5 DIRECTIVE ACCESS' : 'LEVEL-2 FIELD AUDITOR'
    }
    setUser(newUser)
    return newUser
  }

  const logout = () => {
    setUser(null)
  }

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const switchRole = (newRole) => {
    if (user) {
      setUser({
        ...user,
        role: newRole,
        clearance: newRole === 'Admin' ? 'LEVEL-5 DIRECTIVE ACCESS' : 'LEVEL-2 FIELD AUDITOR'
      })
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, theme, toggleTheme, switchRole }}>
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
