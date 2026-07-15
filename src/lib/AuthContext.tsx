import { createContext, useContext, useState, type ReactNode } from 'react'

type Perfil = 'avaliacao' | 'admin'

interface AuthContextType {
  perfil: Perfil | null
  setPerfil: (perfil: Perfil) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [perfil, setPerfil] = useState<Perfil | null>(() => {
    return (localStorage.getItem('perfil') as Perfil) || null
  })

  const handleSetPerfil = (p: Perfil) => {
    localStorage.setItem('perfil', p)
    setPerfil(p)
  }

  const logout = () => {
    localStorage.removeItem('perfil')
    setPerfil(null)
  }

  return (
    <AuthContext.Provider value={{ perfil, setPerfil: handleSetPerfil, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro do AuthProvider')
  return context
}