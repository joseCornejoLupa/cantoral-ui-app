import Link from 'next/link'
import { getPracticas } from '@/lib/api'
import EliminarBtn from '@/app/partituras/EliminarBtn'

export default async function PracticasPage() {
  const practicas = await getPracticas()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Prácticas</h1>
        <Link href="/practicas/nueva"
          className="text-sm px-4 py-2 rounded-lg font-medium"
          style={{ backgroundColor: '#5c8c5c', color: '#fff' }}>
          + Nueva práctica
        </Link>
      </div>
      <div className="grid gap-2">
        {practicas.map(p => (
          <div key={p.id} className="surface rounded-lg px-4 py-3 flex items-center gap-3">
            <Link href={`/practicas/${p.id}`} className="flex-1 flex items-center gap-3 min-w-0">
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                {p.nota ?? 'Práctica'}
              </span>
            </Link>
            <span className="text-sm shrink-0" style={{ color: 'var(--text-muted)' }}>
              {new Date(p.fecha).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
            <span className="text-xs shrink-0" style={{ color: 'var(--text-muted)' }}>{p.partituraIds.length} cantos</span>
            <EliminarBtn id={p.id} tipo="practica" />
          </div>
        ))}
        {practicas.length === 0 && (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            No hay prácticas. <Link href="/practicas/nueva" style={{ color: '#8bc48b' }}>Crea la primera.</Link>
          </p>
        )}
      </div>
    </div>
  )
}
