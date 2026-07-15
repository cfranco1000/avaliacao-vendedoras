import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/AuthContext'
import LoginPage from './pages/LoginPage'
import VotacaoPage from './pages/VotacaoPage'
import DashboardPage from './pages/DashboardPage'
import GerenciarPage from './pages/GerenciarPage'
import AdminLayout from './components/AdminLayout'

function ProtectedRoute({ children, perfil }: { children: React.ReactNode; perfil: 'avaliacao' | 'admin' }) {
  const { perfil: userPerfil } = useAuth()
  
  if (!userPerfil) {
    return <Navigate to="/" replace />
  }
  
  if (userPerfil !== perfil) {
    return <Navigate to={userPerfil === 'admin' ? '/admin/dashboard' : '/votacao'} replace />
  }
  
  return <>{children}</>
}

function AppRoutes() {
  const { perfil } = useAuth()

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      
      <Route path="/votacao" element={
        <ProtectedRoute perfil="avaliacao">
          <VotacaoPage />
        </ProtectedRoute>
      } />
      
      <Route path="/admin" element={
        <ProtectedRoute perfil="admin">
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="gerenciar" element={<GerenciarPage />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App