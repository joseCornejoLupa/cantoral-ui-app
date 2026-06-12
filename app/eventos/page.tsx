export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getEventos } from '@/lib/api'
import EliminarBtn from '@/app/partituras/EliminarBtn'

export default async function EventosPage() {
  const eventos = await getEventos()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Eventos</h1>
        <Link href="/eventos/nuevo"
          className="text-sm px-4 py-2 rounded-lg font-medium"
          style={{ backgroundColor: '#5c8c5c', color: '#fff' }}>
          + Nuevo evento
        </Link>
      </div>
      <div className="grid gap-2">
        {eventos.map(e => (
          <div key={e.id} className="surface rounded-lg px-4 py-3 flex items-center gap-3">
            <Link href={`/eventos/${e.id}`} className="flex-1 flex items-center gap-3 min-w-0">
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{e.tipo}</span>
              {e.nota && <span className="text-sm" style={{ color: 'var(--text-muted)' }}>· {e.nota}</span>}
            </Link>
            <span className="text-sm shrink-0" style={{ color: 'var(--text-muted)' }}>
              {new Date(e.fecha).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
            <span className="text-xs shrink-0" style={{ color: 'var(--text-muted)' }}>{e.cantos.length} cantos</span>
            <EliminarBtn id={e.id} tipo="evento" />
          </div>
        ))}
        {eventos.length === 0 && (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            No hay eventos. <Link href="/eventos/nuevo" style={{ color: '#8bc48b' }}>Registra el primero.</Link>
          </p>
        )}
      </div>
    </div>
  )
}
