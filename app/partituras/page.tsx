import Link from 'next/link'
import { getPartituras } from '@/lib/api'
import ImpresaToggle from './ImpresaToggle'
import EliminarBtn from './EliminarBtn'

export default async function PartiturасPage() {
  const partituras = await getPartituras()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Partituras</h1>
        <Link href="/partituras/nueva"
          className="text-sm px-4 py-2 rounded-lg font-medium transition-colors"
          style={{ backgroundColor: '#5c8c5c', color: '#fff' }}>
          + Nueva partitura
        </Link>
      </div>

      <div className="grid gap-2">
        {partituras.map(p => (
          <div key={p.id} className="surface rounded-lg px-4 py-3 flex items-center gap-3">
            <ImpresaToggle id={p.id} impresa={p.impresa} />
            <div className="flex-1 min-w-0">
              <Link href={`/partituras/${p.id}`}
                className="font-medium hover:brightness-125 transition-all"
                style={{ color: 'var(--text-primary)' }}>
                {p.titulo}
              </Link>
              {p.autor && <span className="text-sm ml-2" style={{ color: 'var(--text-muted)' }}>— {p.autor}</span>}
            </div>
            <span className="text-xs shrink-0" style={{ color: 'var(--text-muted)' }}>{p.idioma}</span>
            <Link href={`/partituras/${p.id}/editar`}
              className="text-xs px-2 py-1 rounded transition-all shrink-0"
              style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-card-hover)' }}>
              Editar
            </Link>
            <EliminarBtn id={p.id} tipo="partitura" redirectTo="/partituras" />
          </div>
        ))}
        {partituras.length === 0 && (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            No hay partituras. <Link href="/partituras/nueva" style={{ color: '#8bc48b' }}>Crea la primera.</Link>
          </p>
        )}
      </div>
    </div>
  )
}
