import { useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AuditProvider, useAudit } from './context/AuditContext'
import { RouterProvider, useRouter } from './context/RouterContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import { Lock } from 'lucide-react'

// Global Modals
import LogoutModal from './components/ui/LogoutModal'
import FolderImportModal from './components/features/FolderImportModal'
import MalwareCertificateModal from './components/ui/MalwareCertificateModal'

// Page Components
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import LoginSuccessPage from './pages/LoginSuccessPage'
import DashboardHome from './pages/DashboardHome'
import LiveLogsPage from './pages/LiveLogsPage'
import HashChainPage from './pages/HashChainPage'
import VerificationPage from './pages/VerificationPage'
import SimulationsPage from './pages/SimulationsPage'
import SmartContractPage from './pages/SmartContractPage'
import SettingsPage from './pages/SettingsPage'
import NotFoundPage from './pages/NotFoundPage'
import AdminRouteGuard from './components/guards/AdminRouteGuard'

// Protected Route Guard for Dashboard routes
function ProtectedDashboard({ children }) {
  const { user, validateSession } = useAuth()
  const { navigate } = useRouter()

  useEffect(() => {
    if (!user || !validateSession()) {
      navigate('/login')
    }
  }, [user, validateSession, navigate])

  if (!user || !validateSession()) {
    return (
      <div className="min-h-screen cyber-grid py-20 px-4 flex items-center justify-center">
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 text-center max-w-md font-mono text-xs">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto mb-4 animate-spin">
            <Lock className="w-6 h-6" />
          </div>
          <div className="font-bold text-slate-100 text-sm">Verifying Security Clearance...</div>
          <p className="text-slate-400 mt-2 text-[11px]">
            Authentication required to access the SOC Dashboard. Redirecting to Portal Login...
          </p>
        </div>
      </div>
    )
  }

  return children
}

function AppContent() {
  const { currentPath } = useRouter()
  const { isMalwareModalOpen, closeMalwareModal, malwareIncident } = useAudit()

  // Route resolver with wild-card support & auth guards
  const renderCurrentPage = () => {
    switch (currentPath) {
      case '/':
        return <LandingPage />
      case '/login':
        return <LoginPage />
      case '/login-success':
        return <LoginSuccessPage />
      case '/dashboard':
        return (
          <ProtectedDashboard>
            <DashboardHome />
          </ProtectedDashboard>
        )
      case '/dashboard/logs':
        return (
          <ProtectedDashboard>
            <LiveLogsPage />
          </ProtectedDashboard>
        )
      case '/dashboard/hash-chain':
        return (
          <ProtectedDashboard>
            <HashChainPage />
          </ProtectedDashboard>
        )
      case '/dashboard/verify':
        return (
          <ProtectedDashboard>
            <VerificationPage />
          </ProtectedDashboard>
        )
      case '/dashboard/simulations':
        return (
          <AdminRouteGuard>
            <SimulationsPage />
          </AdminRouteGuard>
        )
      case '/dashboard/smart-contract':
        return (
          <AdminRouteGuard>
            <SmartContractPage />
          </AdminRouteGuard>
        )
      case '/dashboard/settings':
        return (
          <ProtectedDashboard>
            <SettingsPage />
          </ProtectedDashboard>
        )
      case '/404':
        return <NotFoundPage />
      default:
        // Wild-card routing (path="*") renders custom 404 page
        return <NotFoundPage />
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 transition-colors">
      <Navbar />
      <main className="flex-1">
        {renderCurrentPage()}
      </main>
      <Footer />

      {/* Global Modals for Logout, Folder Import & Malware Certificate */}
      <LogoutModal />
      <FolderImportModal />
      <MalwareCertificateModal 
        isOpen={isMalwareModalOpen}
        onClose={closeMalwareModal}
        certData={malwareIncident}
      />
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
