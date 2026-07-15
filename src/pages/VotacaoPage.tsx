import { useState, useEffect } from 'react'
import { db } from '../lib/database'
import type { Vendedora } from '../lib/database'
import { Star, CheckCircle } from 'lucide-react'

export default function VotacaoPage() {
  const [vendedoras, setVendedoras] = useState<Vendedora[]>([])
  const [selecionada, setSelecionada] = useState<Vendedora | null>(null)
  const [estrelas, setEstrelas] = useState(0)
  const [estrelasHover, setEstrelasHover] = useState(0)
  const [agradecendo, setAgradecendo] = useState(false)

  useEffect(() => {
    db.vendedoras.getAtivos().then(setVendedoras)
  }, [])

  const handleVotar = async () => {
    if (!selecionada || estrelas === 0) return

    await db.avaliacoes.create({
      vendedora_id: selecionada.id,
      estrelas: estrelas
    })

    setAgradecendo(true)
    setTimeout(() => {
      setAgradecendo(false)
      setSelecionada(null)
      setEstrelas(0)
    }, 2000)
  }

  if (agradecendo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
        <div className="text-center text-white">
          <CheckCircle className="w-24 h-24 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Obrigado pela sua avaliação!</h1>
          <p className="text-green-100">Seu feedback é muito importante</p>
        </div>
      </div>
    )
  }

  if (selecionada) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #9333ea, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
        <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', padding: 'min(40px, 5vw)', width: '100%', maxWidth: '512px', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img
              src={selecionada.foto_url}
              alt={selecionada.nome}
              style={{ width: 'min(176px, 35vw)', height: 'min(176px, 35vw)', objectFit: 'cover', marginBottom: 'min(32px, 4vh)' }}
            />
            <h2 style={{ fontSize: 'min(30px, 6vw)', fontWeight: 'bold', color: '#1f2937', marginBottom: 'min(20px, 2vh)', textAlign: 'center' }}>{selecionada.nome}</h2>
            <p style={{ color: '#6b7280', fontSize: 'min(18px, 4vw)', marginBottom: 'min(48px, 6vh)', textAlign: 'center' }}>Como foi seu atendimento?</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 'min(16px, 3vw)', marginBottom: 'min(56px, 8vh)' }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                onMouseEnter={() => setEstrelasHover(i)}
                onMouseLeave={() => setEstrelasHover(0)}
                onClick={() => setEstrelas(i)}
                style={{ transition: 'transform 0.2s', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <Star
                  style={{ width: 'min(56px, 11vw)', height: 'min(56px, 11vw)' }}
                  className={`${
                    i <= (estrelasHover || estrelas)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 'min(16px, 3vw)' }}>
            <button
              onClick={() => {
                setSelecionada(null)
                setEstrelas(0)
              }}
              style={{ flex: 1, padding: 'min(16px, 2vh)', border: '2px solid #d1d5db', borderRadius: '12px', fontWeight: '600', color: '#4b5563', background: 'white', cursor: 'pointer', fontSize: 'min(16px, 3vw)' }}
            >
              Voltar
            </button>
            <button
              onClick={handleVotar}
              disabled={estrelas === 0}
              style={{ flex: 1, padding: 'min(16px, 2vh)', background: '#9333ea', color: 'white', borderRadius: '12px', fontWeight: '600', border: 'none', cursor: 'pointer', opacity: estrelas === 0 ? 0.5 : 1, fontSize: 'min(16px, 3vw)' }}
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #9333ea, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ margin: '0 auto', padding: '32px', maxWidth: '896px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: '8px' }}>
          Quem te atendeu?
        </h1>
        <p style={{ color: '#e9d5ff', textAlign: 'center', fontSize: '18px', marginBottom: '20px' }}>
          Toque na foto da vendedora
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {vendedoras.map((vendedora) => (
            <button
              key={vendedora.id}
              onClick={() => setSelecionada(vendedora)}
              style={{ background: 'white', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', border: 'none', transition: 'all 0.2s' }}
              onMouseOver={(e) => { e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'scale(1.05)' }}
              onMouseOut={(e) => { e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'scale(1)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <img
                  src={vendedora.foto_url}
                  alt={vendedora.nome}
                  style={{ width: '112px', height: '112px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #e9d5ff' }}
                />
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>{vendedora.nome}</h3>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}