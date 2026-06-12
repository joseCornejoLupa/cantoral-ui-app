export const dynamic = 'force-dynamic'

import { getSolemnidades, TipoSolemnidad } from '@/lib/api'
import { CrearSolemnidadForm } from './CrearSolemnidadForm'

const tipoLabel: Record<TipoSolemnidad, string> = {
  liturgica: 'Litúrgica', mariana: 'Mariana', propia: 'Propia',
}
const tipoBadge: Record<TipoSolemnidad, string> = {
  liturgica: '#6b3fa0', mariana: '#2a6b9c', propia: '#2a7c4a',
}

export default async function SolemnidadesPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>
}) {
  const { tipo } = await searchParams
  const tipoFiltro = ['liturgica', 'mariana', 'propia'].includes(tipo ?? '')
    ? (tipo as TipoSolemnidad) : undefined
  const solemnidades = await getSolemnidades(tipoFiltro)

  const filtros: { label: string; tipo?: TipoSolemnidad }[] = [
    { label: 'Todas' },
    { label: 'Litúrgicas', tipo: 'liturgica' },
    { label: 'Marianas', tipo: 'mariana' },
    { label: 'Propias', tipo: 'propia' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Solemnidades</h1>
        <CrearSolemnidadForm />
      </div>
      <div className="flex gap-2 mb-6">
        {filtros.map(f => {
          const active = tipoFiltro === f.tipo
          return (
            <a key={f.label} href={f.tipo ? `?tipo=${f.tipo}` : '/solemnidades'}
              className="px-3 py-1 rounded-full text-sm font-medium transition-all"
              style={{
                backgroundColor: active ? '#5c8c5c' : 'var(--bg-card)',
                color: active ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${active ? '#5c8c5c' : 'var(--border)'}`,
              }}>
              {f.label}
            </a>
          )
        })}
      </div>
      <div className="grid gap-2">
        {solemnidades.map(s => (
          <div key={s.id} className="surface rounded-lg px-4 py-3 flex items-center gap-3">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: tipoBadge[s.tipo] }}>
              {tipoLabel[s.tipo]}
            </span>
            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{s.nombre}</span>
            {s.tiempoLiturgico && (
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>· {s.tiempoLiturgico}</span>
            )}
            {s.fecha && (
              <span className="text-sm ml-auto" style={{ color: 'var(--text-muted)' }}>{s.fecha}</span>
            )}
          </div>
        ))}
        {solemnidades.length === 0 && (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No hay solemnidades.</p>
        )}
      </div>
    </div>
  )
}
