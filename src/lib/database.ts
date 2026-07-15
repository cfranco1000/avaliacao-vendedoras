import { supabase } from './supabase'
import type { Vendedora, Avaliacao } from './supabase'

export type { Vendedora, Avaliacao }

export const db = {
  vendedoras: {
    getAtivos: async (): Promise<Vendedora[]> => {
      const { data, error } = await supabase
        .from('vendedoras')
        .select('*')
        .eq('ativo', true)
        .order('nome')
      if (error) throw error
      return data || []
    },
    getAllIncludingInativos: async (): Promise<Vendedora[]> => {
      const { data, error } = await supabase
        .from('vendedoras')
        .select('*')
        .order('nome')
      if (error) throw error
      return data || []
    },
    create: async (v: Omit<Vendedora, 'id' | 'created_at'>): Promise<Vendedora> => {
      const { data, error } = await supabase
        .from('vendedoras')
        .insert(v)
        .select()
        .single()
      if (error) throw error
      return data
    },
    update: async (id: string, data: Partial<Vendedora>): Promise<Vendedora | null> => {
      const { data: updated, error } = await supabase
        .from('vendedoras')
        .update(data)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return updated
    },
    disable: async (id: string): Promise<boolean> => {
      const { error } = await supabase
        .from('vendedoras')
        .update({ ativo: false })
        .eq('id', id)
      return !error
    }
  },
  avaliacoes: {
    getAll: async (): Promise<Avaliacao[]> => {
      const { data, error } = await supabase
        .from('avaliacoes')
        .select('*, vendedoras(*)')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data || []
    },
    create: async (data: { vendedora_id: string; estrelas: number }): Promise<Avaliacao> => {
      const { data: nova, error } = await supabase
        .from('avaliacoes')
        .insert(data)
        .select('*, vendedoras(*)')
        .single()
      if (error) throw error
      return nova
    },
    getByPeriodo: async (inicio: Date, fim: Date): Promise<Avaliacao[]> => {
      const { data, error } = await supabase
        .from('avaliacoes')
        .select('*, vendedoras(*)')
        .gte('created_at', inicio.toISOString())
        .lte('created_at', fim.toISOString())
        .order('created_at', { ascending: false })
      if (error) throw error
      return data || []
    }
  }
}