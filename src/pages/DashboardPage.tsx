import { useState, useEffect } from 'react'
import { db } from '../lib/database'
import type { Avaliacao } from '../lib/database'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Calendar, TrendingUp, Star } from 'lucide-react'

type Periodo = 'dia' | 'semana' | 'mes'

export default function DashboardPage() {
  const [periodo, setPeriodo] = useState<Periodo>('dia')
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])
  const [mediaGeral, setMediaGeral] = useState(0)
  const [totalVotos, setTotalVotos] = useState(0)
  const [totalVendedorasAtivas, setTotalVendedorasAtivas] = useState(0)

  useEffect(() => {
    const carregarDados = async () => {
      const agora = new Date()
      let inicio: Date

      if (periodo === 'dia') {
        inicio = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate())
      } else if (periodo === 'semana') {
        inicio = new Date(agora)
        inicio.setDate(agora.getDate() - 7)
      } else {
        inicio = new Date(agora.getFullYear(), agora.getMonth(), 1)
      }

      const [dados, vendedoras] = await Promise.all([
        db.avaliacoes.getByPeriodo(inicio, agora),
        db.vendedoras.getAtivos()
      ])
      
      setAvaliacoes(dados)
      setTotalVotos(dados.length)
      setTotalVendedorasAtivas(vendedoras.length)

      if (dados.length > 0) {
        const soma = dados.reduce((acc, a) => acc + a.estrelas, 0)
        setMediaGeral(soma / dados.length)
      } else {
        setMediaGeral(0)
      }
    }

    carregarDados()
  }, [periodo])

  const dadosGrafico = avaliacoes.reduce((acc: { nome: string; votos: number; soma: number; media: number }[], a) => {
    const nome = a.vendedoras?.nome || 'Desconhecido'
    const existente = acc.find(item => item.nome === nome)
    if (existente) {
      existente.votos++
      existente.soma += a.estrelas
      existente.media = existente.soma / existente.votos
    } else {
      acc.push({ nome, votos: 1, soma: a.estrelas, media: a.estrelas })
    }
    return acc
  }, [] as { nome: string; votos: number; soma: number; media: number }[])

  const ultimasAvaliacoes = avaliacoes.slice(-10).reverse()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8">
          {(['dia', 'semana', 'mes'] as Periodo[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriodo(p)}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                periodo === p
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {p === 'dia' ? 'Hoje' : p === 'semana' ? 'Últimos 7 dias' : 'Este mês'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total de Votos</p>
                <p className="text-2xl font-bold text-gray-800">{totalVotos}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Média Geral</p>
                <p className="text-2xl font-bold text-gray-800">{mediaGeral.toFixed(1)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Vendedoras Ativas</p>
                <p className="text-2xl font-bold text-gray-800">{totalVendedorasAtivas}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Votos por Vendedora</h2>
            {dadosGrafico.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dadosGrafico}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nome" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="votos" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                Nenhum voto registrado neste período
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Média de Estrelas</h2>
            {dadosGrafico.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dadosGrafico}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nome" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Bar dataKey="media" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                Nenhum voto registrado neste período
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Últimas Avaliações</h2>
          {ultimasAvaliacoes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Vendedora</th>
                    <th className="text-left py-3 px-4">Estrelas</th>
                    <th className="text-left py-3 px-4">Data/Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {ultimasAvaliacoes.map((a) => (
                    <tr key={a.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{a.vendedoras?.nome}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i <= a.estrelas
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-500">
                        {new Date(a.created_at).toLocaleString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">Nenhuma avaliação registrada</p>
          )}
        </div>
      </main>
    </div>
  )
}