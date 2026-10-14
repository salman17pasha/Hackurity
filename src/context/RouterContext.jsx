import { createContext, useContext, useState, useEffect } from 'react'

const RouterContext = createContext(null)

export function RouterProvider({ children }) {
  const getInitialPath = () => {
    if (typeof window === 'undefined') return '/'
    // Support hash-based fallback (e.g. /#/dashboard/logs) or pathname (e.g. /dashboard/logs)
    if (window.location.hash) {
      return window.location.hash.replace(/^#/, '') || '/'
    }
    return window.location.pathname || '/'
  }

  const [currentPath, setCurrentPath] = useState(getInitialPath)

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.hash) {
        setCurrentPath(window.location.hash.replace(/^#/, '') || '/')
      } else {
        setCurrentPath(window.location.pathname || '/')
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (path) => {
    if (path === currentPath) return
    setCurrentPath(path)
    try {
      window.history.pushState(null, '', path)
    } catch {
      window.location.hash = path
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      {children}
    </RouterContext.Provider>
  )
}

export function useRouter() {
  const context = useContext(RouterContext)
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider')
  }
  return context
}
