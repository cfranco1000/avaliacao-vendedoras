import { useAuth } from '../lib/AuthContext'
import { useNavigate } from 'react-router-dom'
import { User, Shield } from 'lucide-react'

export default function LoginPage() {
  const { setPerfil } = useAuth()
  const navigate = useNavigate()

  const handleSelect = (perfil: 'avaliacao' | 'admin') => {
    setPerfil(perfil)
    if (perfil === 'avaliacao') {
      navigate('/votacao')
    } else {
      navigate('/admin/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Sistema de Avaliação
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Selecione o tipo de acesso
        </p>

        <div className="space-y-4">
          <button
            onClick={() => handleSelect('avaliacao')}
            className="w-full flex items-center gap-4 p-6 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all"
          >
            <div className="bg-purple-100 p-4 rounded-full">
              <User className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-800">Avaliação</h3>
              <p className="text-sm text-gray-500">Avaliar vendedoras</p>
            </div>
          </button>

          <button
            onClick={() => handleSelect('admin')}
            className="w-full flex items-center gap-4 p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <div className="bg-blue-100 p-4 rounded-full">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-800">Administrador</h3>
              <p className="text-sm text-gray-500">Gerenciar vendedoras e ver relatórios</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}