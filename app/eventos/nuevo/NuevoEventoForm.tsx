'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { crearEvento, Partitura, Contexto } from '@/lib/api'
import ErrorModal from '@/app/components/ErrorModal'

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

interface CantoItem { partituraId: string; momento: string }

export default function NuevoEventoForm({ partituras }: { partituras: Partitura[] }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [tipo, setTipo] = useState<Contexto>('Misa')
  const [fecha, setFecha] = useState('')
  const [nota, setNota] = useState('')
  const [cantos, setCantos] = useState<CantoItem[]>([])
  const [partituraSelId, setPartituraSelId] = useState(partituras[0]?.id ?? '')
  const [momentoSel, setMomentoSel] = useState(MOMENTOS_POR_CONTEXTO['Misa'][0])

  const handleTipoChange = (t: Contexto) => { setTipo(t); setMomentoSel(MOMENTOS_POR_CONTEXTO[t][0]) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fecha) { setError('La fecha es obligatoria'); return }
    if (cantos.length === 0) { setError('Añade al menos un canto'); return }
    setLoading(true); setError(null)
    try {
      const ev = await crearEvento({ tipo, fecha: new Date(fecha).toISOString(), nota: nota || undefined, cantos })
      router.push(`/eventos/${ev.id}`); router.refresh()
    } catch (err) {
      setError((err as Error).message)
    } finally { setLoading(false) }
  }

  const partituraMap = Object.fromEntries(partituras.map(p => [p.id, p.titulo]))
  const labelStyle = { color: 'var(--text-secondary)', display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <ErrorModal message={error} onClose={() => setError(null)} />}

      <div className="flex gap-4">
        <div className="flex-1"><label style={labelStyle}>Tipo *</label>
          <select value={tipo} onChange={e => handleTipoChange(e.target.value as Contexto)} style={{ ...inputStyle, backgroundColor: 'var(--bg-input)' }}>
            {CONTEXTOS.map(c => <option key={c} style={{ backgroundColor: 'var(--bg-card)' }}>{c}</option>)}
          </select></div>
        <div className="flex-1"><label style={labelStyle}>Fecha *</label>
          <input type="datetime-local" value={fecha} onChange={e => setFecha(e.target.value)} style={inputStyle} /></div>
      </div>

      <div><label style={labelStyle}>Nota</label>
        <input value={nota} onChange={e => setNota(e.target.value)} style={inputStyle} placeholder="Ej: Misa de Navidad" /></div>

      <div>
        <label style={labelStyle}>Cantos</label>
        <div className="flex gap-2 mb-2">
          <select value={momentoSel} onChange={e => setMomentoSel(e.target.value)} style={{ ...inputStyle, width: 'auto' }}>
            {MOMENTOS_POR_CONTEXTO[tipo].map(m => <option key={m} style={{ backgroundColor: 'var(--bg-card)' }}>{m}</option>)}
          </select>
          <select value={partituraSelId} onChange={e => setPartituraSelId(e.target.value)} style={{ ...inputStyle, flex: 1 }}>
            {partituras.map(p => <option key={p.id} value={p.id} style={{ backgroundColor: 'var(--bg-card)' }}>{p.titulo}</option>)}
          </select>
          <button type="button"
            onClick={() => { if (!partituraSelId) return; setCantos(prev => [...prev, { partituraId: partituraSelId, momento: momentoSel }]) }}
            className="px-3 py-1.5 rounded-lg text-sm"
            style={{ backgroundColor: 'var(--bg-card-hover)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
            + Añadir
          </button>
        </div>
        <div className="grid gap-1.5">
          {cantos.map((c, i) => (
            <div key={i} className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg"
              style={{ backgroundColor: '#2a3a4a', border: '1px solid #3a5a7a' }}>
              <span className="text-xs font-medium" style={{ color: '#7ab4e8' }}>{c.momento}</span>
              <span className="flex-1" style={{ color: 'var(--text-primary)' }}>{partituraMap[c.partituraId]}</span>
              <button type="button" onClick={() => setCantos(prev => prev.filter((_, idx) => idx !== i))}
                style={{ color: 'var(--text-muted)' }}>×</button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading}
          className="px-5 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
          style={{ backgroundColor: '#5c8c5c', color: '#fff' }}>
          {loading ? 'Guardando…' : 'Guardar evento'}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-5 py-2 rounded-lg text-sm"
          style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
          Cancelar
        </button>
      </div>
    </form>
  )
}
