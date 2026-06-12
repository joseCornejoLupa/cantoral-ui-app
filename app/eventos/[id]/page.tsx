export const dynamic = 'force-dynamic'

import { getEvento, getPartituras } from '@/lib/api'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function EventoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [evento, partituras] = await Promise.all([
    getEvento(id).catch(() => null),
    getPartituras(),
  ])

  if (!evento) notFound()

  const partituraMap = Object.fromEntries(partituras.map(p => [p.id, p]))

  return (
    <div className="max-w-2xl">
      <div className="mb-4">
        <Link href="/eventos" className="text-sm text-indigo-600 hover:underline">← Eventos</Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{evento.tipo}</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              {new Date(evento.fecha).toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
        {evento.nota && <p className="text-gray-600 text-sm mb-4">{evento.nota}</p>}

        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Cantos ({evento.cantos.length})</p>
          <div className="grid gap-2">
            {evento.cantos.map((c, i) => {
              const p = partituraMap[c.partituraId]
              return (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded-full shrink-0">
                    {c.momento}
                  </span>
                  {p ? (
                    <Link href={`/partituras/${p.id}`} className="text-gray-800 hover:text-indigo-600 transition-colors">
                      {p.titulo}
                    </Link>
                  ) : (
                    <span className="text-gray-400">{c.partituraId}</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
