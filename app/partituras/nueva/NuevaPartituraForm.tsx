'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { crearPartitura, Solemnidad, Idioma, Contexto } from '@/lib/api'
import ErrorModal from '@/app/components/ErrorModal'

const IDIOMAS: Idioma[] = ['Español', 'Latín', 'Griego', 'Hebreo', 'Bilingüe']
const CONTEXTOS: Contexto[] = ['Misa', 'Adoración', 'Vía Crucis', 'Rosario', 'Procesión', 'Otro']
const MOMENTOS_POR_CONTEXTO: Record<Contexto, string[]> = {
  'Misa': ['Canto de Inicio', 'Misa', 'Aleluya', 'Ofertorio', 'Padrenuestro', 'Comunión', 'Antífona Mariana', 'Canto de Salida'],
  'Adoración': ['Entrada', 'Pange Lingua', 'Tantum Ergo', 'Canto de Adoración', 'Bendición', 'Reserva'],
  'Vía Crucis': Array.from({ length: 14 }, (_, i) => `Estación ${i + 1}`),
  'Rosario': ['Misterio'],
  'Procesión': ['Canto de Procesión'],
  'Otro': ['General'],
}

const inputStyle = {
  backgroundColor: 'var(--bg-input)', border: '1px solid var(--border)',
  color: 'var(--text-primary)', borderRadius: '0.5rem',
  padding: '0.375rem 0.75rem', fontSize: '0.875rem', width: '100%', outline: 'none',
}

export default function NuevaPartituraForm({ solemnidades }: { solemnidades: Solemnidad[] }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [autor, setAutor] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [idioma, setIdioma] = useState<Idioma>('Español')
  const [impresa, setImpresa] = useState(false)
  const [solemnidadIds, setSolemnidadIds] = useState<string[]>([])
  const [aptitudes, setAptitudes] = useState<{ momento: string; contexto: Contexto }[]>([])
  const [contextoApt, setContextoApt] = useState<Contexto>('Misa')
  const [momentoApt, setMomentoApt] = useState(MOMENTOS_POR_CONTEXTO['Misa'][0])

  const toggleSolemnidad = (id: string) =>
    setSolemnidadIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const addAptitud = () => {
    if (aptitudes.some(a => a.momento === momentoApt && a.contexto === contextoApt)) return
    setAptitudes(prev => [...prev, { momento: momentoApt, contexto: contextoApt }])
  }

  const handleContextoChange = (c: Contexto) => {
    setContextoApt(c)
    setMomentoApt(MOMENTOS_POR_CONTEXTO[c][0])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!titulo.trim()) { setError('El título es obligatorio'); return }
    if (solemnidadIds.length === 0) { setError('Selecciona al menos una solemnidad'); return }
    setLoading(true); setError(null)
    try {
      await crearPartitura({ titulo, autor: autor || undefined, descripcion: descripcion || undefined, idioma, impresa, solemnidadIds, aptitudes })
      router.push('/partituras'); router.refresh()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const labelStyle = { color: 'var(--text-secondary)', display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <ErrorModal message={error} onClose={() => setError(null)} />}

      <div><label style={labelStyle}>Título *</label>
        <input value={titulo} onChange={e => setTitulo(e.target.value)} style={inputStyle} placeholder="Ej: Ave María de Schubert" /></div>

      <div><label style={labelStyle}>Autor</label>
        <input value={autor} onChange={e => setAutor(e.target.value)} style={inputStyle} placeholder="Ej: Franz Schubert" /></div>

      <div><label style={labelStyle}>Descripción</label>
        <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} rows={2}
          style={{ ...inputStyle, resize: 'vertical' }} /></div>

      <div className="flex gap-4">
        <div className="flex-1"><label style={labelStyle}>Idioma</label>
          <select value={idioma} onChange={e => setIdioma(e.target.value as Idioma)}
            style={{ ...inputStyle, backgroundColor: 'var(--bg-input)' }}>
            {IDIOMAS.map(i => <option key={i} style={{ backgroundColor: 'var(--bg-card)' }}>{i}</option>)}
          </select></div>
        <div className="flex items-end pb-1 gap-2">
          <input type="checkbox" id="impresa" checked={impresa} onChange={e => setImpresa(e.target.checked)} />
          <label htmlFor="impresa" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Ya impresa</label>
        </div>
      </div>

      <div>
        <label style={labelStyle}>Solemnidades *</label>
        <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto">
          {solemnidades.map(s => (
            <button type="button" key={s.id} onClick={() => toggleSolemnidad(s.id)}
              className="text-xs px-2 py-1 rounded-full transition-all"
              style={solemnidadIds.includes(s.id)
                ? { backgroundColor: '#5c8c5c', color: '#fff', border: '1px solid #5c8c5c' }
                : { backgroundColor: 'var(--bg-card-hover)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
              {s.nombre}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label style={labelStyle}>Momentos litúrgicos</label>
        <div className="flex gap-2 mb-2">
          <select value={contextoApt} onChange={e => handleContextoChange(e.target.value as Contexto)}
            style={{ ...inputStyle, width: 'auto' }}>
            {CONTEXTOS.map(c => <option key={c} style={{ backgroundColor: 'var(--bg-card)' }}>{c}</option>)}
          </select>
          <select value={momentoApt} onChange={e => setMomentoApt(e.target.value)}
            style={{ ...inputStyle, flex: 1 }}>
            {MOMENTOS_POR_CONTEXTO[contextoApt].map(m => <option key={m} style={{ backgroundColor: 'var(--bg-card)' }}>{m}</option>)}
          </select>
          <button type="button" onClick={addAptitud}
            className="px-3 py-1.5 rounded-lg text-sm transition-all"
            style={{ backgroundColor: 'var(--bg-card-hover)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
            + Añadir
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {aptitudes.map((a, i) => (
            <span key={i} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: '#2a3a4a', color: '#7ab4e8', border: '1px solid #3a5a7a' }}>
              {a.contexto} · {a.momento}
              <button type="button" onClick={() => setAptitudes(prev => prev.filter((_, idx) => idx !== i))}
                style={{ color: '#5a8ab4', marginLeft: '0.25rem' }}>×</button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading}
          className="px-5 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-all"
          style={{ backgroundColor: '#5c8c5c', color: '#fff' }}>
          {loading ? 'Guardando…' : 'Guardar partitura'}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-5 py-2 rounded-lg text-sm transition-all"
          style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
          Cancelar
        </button>
      </div>
    </form>
  )
}
