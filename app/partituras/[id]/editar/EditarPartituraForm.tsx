'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { actualizarPartitura, Partitura, Idioma } from '@/lib/api'
import ErrorModal from '@/app/components/ErrorModal'

const IDIOMAS: Idioma[] = ['Español', 'Latín', 'Griego', 'Hebreo', 'Bilingüe']

export default function EditarPartituraForm({ partitura }: { partitura: Partitura }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [titulo, setTitulo] = useState(partitura.titulo)
  const [autor, setAutor] = useState(partitura.autor ?? '')
  const [descripcion, setDescripcion] = useState(partitura.descripcion ?? '')
  const [idioma, setIdioma] = useState<Idioma>(partitura.idioma)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!titulo.trim()) { setError('El título es obligatorio'); return }
    setLoading(true); setError(null)
    try {
      await actualizarPartitura(partitura.id, {
        titulo, autor: autor || undefined, descripcion: descripcion || undefined, idioma,
      })
      router.push(`/partituras/${partitura.id}`)
      router.refresh()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    backgroundColor: 'var(--bg-input)', border: '1px solid var(--border)',
    color: 'var(--text-primary)', borderRadius: '0.5rem',
    padding: '0.375rem 0.75rem', fontSize: '0.875rem', width: '100%', outline: 'none',
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <ErrorModal message={error} onClose={() => setError(null)} />}

      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Título *</label>
        <input value={titulo} onChange={e => setTitulo(e.target.value)} style={inputStyle} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Autor</label>
        <input value={autor} onChange={e => setAutor(e.target.value)} style={inputStyle} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Descripción</label>
        <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} rows={2}
          style={{ ...inputStyle, resize: 'vertical' }} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Idioma</label>
        <select value={idioma} onChange={e => setIdioma(e.target.value as Idioma)}
          style={{ ...inputStyle, backgroundColor: 'var(--bg-input)' }}>
          {IDIOMAS.map(i => <option key={i} style={{ backgroundColor: 'var(--bg-card)' }}>{i}</option>)}
        </select>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading}
          className="px-5 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          style={{ backgroundColor: '#5c8c5c', color: '#fff' }}>
          {loading ? 'Guardando…' : 'Guardar cambios'}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-5 py-2 rounded-lg text-sm transition-colors"
          style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
          Cancelar
        </button>
      </div>
    </form>
  )
}
