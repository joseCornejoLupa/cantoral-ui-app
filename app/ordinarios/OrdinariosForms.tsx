'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { crearOrdinario, asignarPiezaOrdinario, type Ordinario, type ParteOrdinario } from '@/lib/api'
import ErrorModal from '@/app/components/ErrorModal'

const PARTES: ParteOrdinario[] = ['Kyrie', 'Gloria', 'Santo', 'Cordero']

export function CrearOrdinarioForm() {
  const router = useRouter()
  const [nombre, setNombre] = useState('')
  const [compositor, setCompositor] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim()) return
    setLoading(true)
    setError(null)
    try {
      await crearOrdinario({ nombre: nombre.trim(), compositor: compositor.trim() || undefined })
      setNombre('')
      setCompositor('')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="surface rounded-lg p-4 flex flex-col gap-3">
      <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Nuevo ordinario</h2>
      {error && <ErrorModal message={error} onClose={() => setError(null)} />}
      <input
        className="input-base"
        placeholder="Nombre (ej. Misa de Frisina)"
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        required
      />
      <input
        className="input-base"
        placeholder="Compositor (opcional)"
        value={compositor}
        onChange={e => setCompositor(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 rounded-lg text-sm font-medium self-start"
        style={{ backgroundColor: '#5c8c5c', color: '#fff', opacity: loading ? 0.6 : 1 }}>
        {loading ? 'Creando…' : 'Crear'}
      </button>
    </form>
  )
}

export function AsignarPiezaForm({ ordinario, partituras }: {
  ordinario: Ordinario
  partituras: { id: string; titulo: string }[]
}) {
  const router = useRouter()
  const [parte, setParte] = useState<ParteOrdinario>('Kyrie')
  const [partituraId, setPartituraId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!partituraId) return
    setLoading(true)
    setError(null)
    try {
      await asignarPiezaOrdinario(ordinario.id, { partituraId, parte })
      setPartituraId('')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setLoading(false)
    }
  }

  const asignadas = new Set(ordinario.piezas.map(p => p.parte))

  return (
    <form onSubmit={submit} className="flex flex-wrap gap-2 items-end mt-2">
      {error && <ErrorModal message={error} onClose={() => setError(null)} />}
      <select
        className="input-base"
        style={{ width: 'auto' }}
        value={parte}
        onChange={e => setParte(e.target.value as ParteOrdinario)}>
        {PARTES.map(p => (
          <option key={p} value={p}>{p}{asignadas.has(p) ? ' ✓' : ''}</option>
        ))}
      </select>
      <select
        className="input-base"
        style={{ width: 'auto', minWidth: '200px' }}
        value={partituraId}
        onChange={e => setPartituraId(e.target.value)}
        required>
        <option value="">— Seleccionar partitura —</option>
        {partituras.map(p => (
          <option key={p.id} value={p.id}>{p.titulo}</option>
        ))}
      </select>
      <button
        type="submit"
        disabled={loading || !partituraId}
        className="px-3 py-2 rounded-lg text-sm font-medium shrink-0"
        style={{ backgroundColor: '#5c8c5c', color: '#fff', opacity: loading || !partituraId ? 0.6 : 1 }}>
        Asignar
      </button>
    </form>
  )
}
