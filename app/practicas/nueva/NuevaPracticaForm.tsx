'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { crearPractica, Partitura } from '@/lib/api'
import ErrorModal from '@/app/components/ErrorModal'

const inputStyle = {
  backgroundColor: 'var(--bg-input)', border: '1px solid var(--border)',
  color: 'var(--text-primary)', borderRadius: '0.5rem',
  padding: '0.375rem 0.75rem', fontSize: '0.875rem', width: '100%', outline: 'none',
}

export default function NuevaPracticaForm({ partituras }: { partituras: Partitura[] }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fecha, setFecha] = useState('')
  const [nota, setNota] = useState('')
  const [seleccionadas, setSeleccionadas] = useState<string[]>([])

  const toggle = (id: string) =>
    setSeleccionadas(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fecha) { setError('La fecha es obligatoria'); return }
    if (seleccionadas.length === 0) { setError('Selecciona al menos una partitura'); return }
    setLoading(true); setError(null)
    try {
      const pr = await crearPractica({ fecha: new Date(fecha).toISOString(), nota: nota || undefined, partituraIds: seleccionadas })
      router.push(`/practicas/${pr.id}`); router.refresh()
    } catch (err) {
      setError((err as Error).message)
    } finally { setLoading(false) }
  }

  const labelStyle = { color: 'var(--text-secondary)', display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <ErrorModal message={error} onClose={() => setError(null)} />}

      <div><label style={labelStyle}>Fecha *</label>
        <input type="datetime-local" value={fecha} onChange={e => setFecha(e.target.value)} style={inputStyle} /></div>

      <div><label style={labelStyle}>Nota</label>
        <input value={nota} onChange={e => setNota(e.target.value)} style={inputStyle} placeholder="Ej: Ensayo para Navidad" /></div>

      <div>
        <label style={labelStyle}>Partituras a ensayar ({seleccionadas.length} seleccionadas)</label>
        <div className="grid gap-1.5 max-h-64 overflow-y-auto">
          {partituras.map(p => (
            <label key={p.id} className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all"
              style={seleccionadas.includes(p.id)
                ? { backgroundColor: '#2a3a2a', border: '1px solid #4a7a4a' }
                : { backgroundColor: 'var(--bg-card-hover)', border: '1px solid var(--border)' }}>
              <input type="checkbox" checked={seleccionadas.includes(p.id)} onChange={() => toggle(p.id)} />
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{p.titulo}</span>
              {p.autor && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>— {p.autor}</span>}
              {!p.impresa && <span className="ml-auto text-xs" style={{ color: '#c4904a' }}>sin imprimir</span>}
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading}
          className="px-5 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
          style={{ backgroundColor: '#5c8c5c', color: '#fff' }}>
          {loading ? 'Guardando…' : 'Guardar práctica'}
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
