import { useState, useEffect, useRef, useCallback } from 'react'
import { db } from '../lib/database'
import type { Vendedora } from '../lib/database'
import { Edit2, Trash2, Save, X, UserPlus } from 'lucide-react'

function ImageCropper({ src, onPositionChange }: { src: string; onPositionChange: (pos: { x: number; y: number }) => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })

  const handleImageLoad = useCallback(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    const img = container.querySelector('img')
    if (!img) return

    const containerSize = container.offsetWidth
    const imgWidth = img.naturalWidth
    const imgHeight = img.naturalHeight
    const scale = Math.max(containerSize / imgWidth, containerSize / imgHeight) * 1.5
    const width = imgWidth * scale
    const height = imgHeight * scale
    setImageSize({ width, height })
    setPosition({ x: 0, y: 0 })
    onPositionChange({ x: 0, y: 0 })
  }, [onPositionChange])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return
    const containerSize = containerRef.current.offsetWidth
    const maxX = Math.max(0, (imageSize.width - containerSize) / 2)
    const maxY = Math.max(0, (imageSize.height - containerSize) / 2)
    let newX = e.clientX - dragStart.x
    let newY = e.clientY - dragStart.y
    newX = Math.max(-maxX, Math.min(maxX, newX))
    newY = Math.max(-maxY, Math.min(maxY, newY))
    setPosition({ x: newX, y: newY })
    onPositionChange({ x: newX, y: newY })
  }, [isDragging, dragStart, imageSize, onPositionChange])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        ref={containerRef}
        className="w-40 h-40 rounded-full overflow-hidden border-4 border-purple-200 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        <img
          src={src}
          alt="Preview"
          className="w-full h-full object-cover pointer-events-none"
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            width: imageSize.width || '100%',
            height: imageSize.height || '100%'
          }}
          onLoad={handleImageLoad}
        />
      </div>
      <p className="text-xs text-gray-500">Arraste para ajustar a posição no círculo</p>
    </div>
  )
}

export default function GerenciarPage() {
  const [vendedoras, setVendedoras] = useState<Vendedora[]>([])
  const [editando, setEditando] = useState<string | null>(null)
  const [novoNome, setNovoNome] = useState('')
  const [novoFoto, setNovoFoto] = useState('')
  const [showNovo, setShowNovo] = useState(false)

  const carregar = async () => {
    const dados = await db.vendedoras.getAllIncludingInativos()
    setVendedoras(dados)
  }

  useEffect(() => {
    carregar()
  }, [])

  const handleSalvar = async (id: string, nome: string, foto_url: string) => {
    await db.vendedoras.update(id, { nome, foto_url })
    setEditando(null)
    carregar()
  }

  const handleDesabilitar = async (id: string) => {
    if (confirm('Tem certeza que deseja desabilitar esta vendedora?')) {
      await db.vendedoras.disable(id)
      carregar()
    }
  }

  const handleAdicionar = async () => {
    if (!novoNome.trim()) return
    await db.vendedoras.create({
      nome: novoNome,
      foto_url: novoFoto || '/images/default.jpg',
      ativo: true
    })
    setNovoNome('')
    setNovoFoto('')
    setShowNovo(false)
    carregar()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Gerenciar Vendedoras</h1>
          <button
            onClick={() => setShowNovo(true)}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            Nova Vendedora
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {showNovo && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Nova Vendedora</h2>
            <div className="flex gap-4">
              <input
                type="text"
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
                placeholder="Nome"
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">Foto da vendedora</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        setNovoFoto(reader.result as string)
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                  className="w-full border rounded-lg px-4 py-2"
                />
                {novoFoto && (
                  <div className="mt-2">
                    <ImageCropper src={novoFoto} onPositionChange={() => {}} />
                  </div>
                )}
              </div>
              <button
                onClick={handleAdicionar}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                <Save className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowNovo(false)}
                className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {vendedoras.map((vendedora) => (
            <div
              key={vendedora.id}
              className={`bg-white rounded-xl shadow-sm p-6 ${
                !vendedora.ativo ? 'opacity-60' : ''
              }`}
            >
              {editando === vendedora.id ? (
                <EditandoVendedora
                  vendedora={vendedora}
                  onSalvar={handleSalvar}
                  onCancelar={() => setEditando(null)}
                />
              ) : (
                <div className="flex items-center gap-6">
                  <img
                    src={vendedora.foto_url}
                    alt={vendedora.nome}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">{vendedora.nome}</h3>
                    <p className={`text-sm ${vendedora.ativo ? 'text-green-600' : 'text-red-600'}`}>
                      {vendedora.ativo ? 'Ativa' : 'Desabilitada'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditando(vendedora.id)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    {vendedora.ativo && (
                      <button
                        onClick={() => handleDesabilitar(vendedora.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

function EditandoVendedora({
  vendedora,
  onSalvar,
  onCancelar
}: {
  vendedora: Vendedora
  onSalvar: (id: string, nome: string, foto_url: string) => void
  onCancelar: () => void
}) {
  const [nome, setNome] = useState(vendedora.nome)
  const [foto, setFoto] = useState(vendedora.foto_url)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-start">
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={() => onSalvar(vendedora.id, nome, foto)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <Save className="w-5 h-5" />
        </button>
        <button
          onClick={onCancelar}
          className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex gap-4 items-start">
        <div className="flex-1">
          <label className="block text-sm text-gray-600 mb-1">Foto da vendedora</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                const reader = new FileReader()
                reader.onloadend = () => {
                  setFoto(reader.result as string)
                }
                reader.readAsDataURL(file)
              }
            }}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
        {foto && (
          <ImageCropper src={foto} onPositionChange={() => {}} />
        )}
      </div>
    </div>
  )
}