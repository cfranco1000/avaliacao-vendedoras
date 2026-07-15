import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Vendedora {
  id: string
  nome: string
  foto_url: string
  ativo: boolean
  created_at: string
}

export interface Avaliacao {
  id: string
  vendedora_id: string
  estrelas: number
  created_at: string
  vendedoras?: Vendedora
}

export interface Database {
  public: {
    Tables: {
      vendedoras: {
        Row: Vendedora
        Insert: Omit<Vendedora, 'id' | 'created_at'>
        Update: Partial<Omit<Vendedora, 'id' | 'created_at'>>
      }
      avaliacoes: {
        Row: Avaliacao
        Insert: Omit<Avaliacao, 'id' | 'created_at' | 'vendedora'>
        Update: Partial<Omit<Avaliacao, 'id' | 'created_at' | 'vendedora'>>
      }
    }
  }
}