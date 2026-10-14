import { AuthProvider } from './context/AuthContext'
import { AuditProvider } from './context/AuditContext'
import { RouterProvider, useRouter } from './context/RouterContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Page Components
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import DashboardHome from './pages/DashboardHome'
import LiveLogsPage from './pages/LiveLogsPage'
import HashChainPage from './pages/HashChainPage'
import VerificationPage from './pages/VerificationPage'
import SimulationsPage from './pages/SimulationsPage'
import SettingsPage from './pages/SettingsPage'

function AppContent() {
  const { currentPath } = useRouter()

  // Route resolver
  const renderCurrentPage = () => {
    switch (currentPath) {
      case '/':
        return <LandingPage />
      case '/login':
        return <LoginPage />
      case '/dashboard':
        return <DashboardHome />
      case '/dashboard/logs':
        return <LiveLogsPage />
      case '/dashboard/hash-chain':
        return <HashChainPage />
      case '/dashboard/verify':
        return <VerificationPage />
      case '/dashboard/simulations':
        return <SimulationsPage />
      case '/dashboard/settings':
        return <SettingsPage />
      default:
        // Default fallback to LandingPage or DashboardHome
        if (currentPath.startsWith('/dashboard')) {
          return <DashboardHome />
        }
        return <LandingPage />
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 transition-colors">
      <Navbar />
      <main className="flex-1">
        {renderCurrentPage()}
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AuditProvider>
        <RouterProvider>
          <AppContent />
        </RouterProvider>
      </AuditProvider>
    </AuthProvider>
  )
}
