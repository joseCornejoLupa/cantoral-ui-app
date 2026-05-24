'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { crearSolemnidad, type TipoSolemnidad } from '@/lib/api'
import ErrorModal from '@/app/components/ErrorModal'

const TIEMPOS = ['Adviento', 'Navidad', 'Cuaresma', 'Semana Santa', 'Pascua', 'Tiempo Ordinario']

export function CrearSolemnidadForm() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [tipo, setTipo] = useState<TipoSolemnidad>('liturgica')
  const [nombre, setNombre] = useState('')
  const [tiempoLiturgico, setTiempoLiturgico] = useState(TIEMPOS[0])
  const [fecha, setFecha] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reset = () => {
    setNombre('')
    setTipo('liturgica')
    setTiempoLiturgico(TIEMPOS[0])
    setFecha('')
    setError(null)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const base = { nombre: nombre.trim(), fecha: fecha || undefined }
      if (tipo === 'liturgica') {
        await crearSolemnidad({ tipo, ...base, tiempoLiturgico })
      } else {
        await crearSolemnidad({ tipo, ...base })
      }
      reset()
      setOpen(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm px-4 py-2 rounded-lg font-medium"
        style={{ backgroundColor: '#5c8c5c', color: '#fff' }}>
        + Nueva solemnidad
      </button>
    )
  }

  return (
    <form onSubmit={submit} className="surface rounded-lg p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Nueva solemnidad</h2>
        <button type="button" onClick={() => { setOpen(false); reset() }}
          className="text-sm" style={{ color: 'var(--text-muted)' }}>Cancelar</button>
      </div>

      {error && <ErrorModal message={error} onClose={() => setError(null)} />}

      <div className="flex gap-2">
        {(['liturgica', 'mariana', 'propia'] as TipoSolemnidad[]).map(t => (
          <button key={t} type="button"
            onClick={() => setTipo(t)}
            className="px-3 py-1 rounded-full text-sm capitalize"
            style={{
              backgroundColor: tipo === t ? '#5c8c5c' : 'var(--bg-input)',
              color: tipo === t ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${tipo === t ? '#5c8c5c' : 'var(--border)'}`,
            }}>
            {t}
          </button>
        ))}
      </div>

      <input
        className="input-base"
        placeholder="Nombre"
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        required
      />

      {tipo === 'liturgica' && (
        <select
          className="input-base"
          value={tiempoLiturgico}
          onChange={e => setTiempoLiturgico(e.target.value)}
          required>
          {TIEMPOS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      )}

      <input
        className="input-base"
        placeholder="Fecha MM-DD (opcional, ej. 12-08)"
        value={fecha}
        onChange={e => setFecha(e.target.value)}
        pattern="\d{2}-\d{2}"
      />

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 rounded-lg text-sm font-medium self-start"
        style={{ backgroundColor: '#5c8c5c', color: '#fff', opacity: loading ? 0.6 : 1 }}>
        {loading ? 'Guardando…' : 'Crear'}
      </button>
    </form>
  )
}
