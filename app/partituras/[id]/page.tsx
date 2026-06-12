export const dynamic = 'force-dynamic'

import { getPartitura, getSolemnidades, getRecomendaciones } from '@/lib/api'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import EliminarBtn from '../EliminarBtn'

export default async function PartituraDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [partitura, solemnidades, recomendaciones] = await Promise.all([
    getPartitura(id).catch(() => null),
    getSolemnidades(),
    getRecomendaciones(id).catch(() => []),
  ])
  if (!partitura) notFound()

  const solemnidadMap = Object.fromEntries(solemnidades.map(s => [s.id, s.nombre]))

  return (
    <div className="max-w-2xl">
      <div className="mb-4">
        <Link href="/partituras" className="text-sm hover:brightness-125" style={{ color: '#8bc48b' }}>← Partituras</Link>
      </div>

      <div className="surface rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{partitura.titulo}</h1>
            {partitura.autor && <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{partitura.autor}</p>}
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-xs font-medium px-2 py-1 rounded-full"
              style={partitura.impresa
                ? { backgroundColor: '#2a4a2a', color: '#8bc48b' }
                : { backgroundColor: 'var(--bg-card-hover)', color: 'var(--text-muted)' }}>
              {partitura.impresa ? 'Impresa' : 'No impresa'}
            </span>
            <Link href={`/partituras/${id}/editar`}
              className="text-xs px-2 py-1 rounded"
              style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-card-hover)' }}>
              Editar
            </Link>
            <EliminarBtn id={id} tipo="partitura" redirectTo="/partituras" />
          </div>
        </div>

        {partitura.descripcion && (
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{partitura.descripcion}</p>
        )}

        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-wide mb-0.5" style={{ color: 'var(--text-muted)' }}>Idioma</dt>
            <dd style={{ color: 'var(--text-primary)' }}>{partitura.idioma}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide mb-0.5" style={{ color: 'var(--text-muted)' }}>Añadida</dt>
            <dd style={{ color: 'var(--text-primary)' }}>{new Date(partitura.creadoEn).toLocaleDateString('es')}</dd>
          </div>
        </dl>

        {partitura.solemnidadIds.length > 0 && (
          <div className="mt-4">
            <p className="text-xs uppercase tracking-wide mb-1.5" style={{ color: 'var(--text-muted)' }}>Solemnidades</p>
            <div className="flex flex-wrap gap-1.5">
              {partitura.solemnidadIds.map(sid => (
                <span key={sid} className="text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: '#3a2a5a', color: '#b8a0e8', border: '1px solid #5a4a7a' }}>
                  {solemnidadMap[sid] ?? sid}
                </span>
              ))}
            </div>
          </div>
        )}

        {partitura.aptitudes.length > 0 && (
          <div className="mt-4">
            <p className="text-xs uppercase tracking-wide mb-1.5" style={{ color: 'var(--text-muted)' }}>Momentos litúrgicos</p>
            <div className="flex flex-wrap gap-1.5">
              {partitura.aptitudes.map((a, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: '#2a3a4a', color: '#7ab4e8', border: '1px solid #3a5a7a' }}>
                  {a.contexto} · {a.momento}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {recomendaciones.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>
            Cantos relacionados
          </h2>
          <div className="grid gap-2">
            {recomendaciones.map(r => (
              <Link key={r.id} href={`/partituras/${r.id}`}
                className="surface rounded-lg px-4 py-2.5 flex items-center gap-3 hover:brightness-110 transition-all">
                <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{r.titulo}</span>
                {r.autor && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>— {r.autor}</span>}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
