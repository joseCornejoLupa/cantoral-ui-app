import { getOrdinarios, getPartituras } from '@/lib/api'
import { CrearOrdinarioForm, AsignarPiezaForm } from './OrdinariosForms'

const PARTES = ['Kyrie', 'Gloria', 'Santo', 'Cordero']

export default async function OrdinariosPage() {
  const [ordinarios, partituras] = await Promise.all([getOrdinarios(), getPartituras()])
  const partiturasSimple = partituras.map(p => ({ id: p.id, titulo: p.titulo }))

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Ordinarios</h1>

      <div className="grid gap-6 mb-8">
        {ordinarios.map(o => (
          <div key={o.id} className="surface rounded-lg p-4">
            <div className="flex items-baseline gap-3 mb-3">
              <span className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>{o.nombre}</span>
              {o.compositor && (
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{o.compositor}</span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3 sm:grid-cols-4">
              {PARTES.map(parte => {
                const pieza = o.piezas.find(p => p.parte === parte)
                const partitura = pieza ? partituras.find(p => p.id === pieza.partituraId) : null
                return (
                  <div key={parte}
                    className="rounded p-2 text-sm"
                    style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border)' }}>
                    <p className="font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{parte}</p>
                    <p style={{ color: pieza ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      {partitura ? partitura.titulo : '—'}
                    </p>
                  </div>
                )
              })}
            </div>
            <AsignarPiezaForm ordinario={o} partituras={partiturasSimple} />
          </div>
        ))}
        {ordinarios.length === 0 && (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No hay ordinarios todavía.</p>
        )}
      </div>

      <CrearOrdinarioForm />
    </div>
  )
}
