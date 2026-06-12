export const dynamic = 'force-dynamic'

import { getNoImpresos, getPartituras } from '@/lib/api'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ImpresaToggle from '@/app/partituras/ImpresaToggle'

export default async function PracticaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [noImpresos, todasLasPartituras] = await Promise.all([
    getNoImpresos(id).catch(() => null),
    getPartituras(),
  ])

  if (!noImpresos) notFound()

  const partituraMap = Object.fromEntries(todasLasPartituras.map(p => [p.id, p]))

  return (
    <div className="max-w-2xl">
      <div className="mb-4">
        <Link href="/practicas" className="text-sm text-indigo-600 hover:underline">← Prácticas</Link>
      </div>

      <h1 className="text-xl font-bold text-gray-800 mb-2">Cantos sin imprimir</h1>
      <p className="text-sm text-gray-400 mb-6">Estas partituras están en la práctica pero no están impresas aún.</p>

      {noImpresos.length === 0 ? (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-6 text-center">
          <p className="text-green-700 font-medium">✓ Todas las partituras están impresas</p>
        </div>
      ) : (
        <div className="grid gap-2">
          {noImpresos.map(p => (
            <div key={p.id} className="bg-white rounded-lg border border-orange-200 px-4 py-3 flex items-center gap-3">
              <ImpresaToggle id={p.id} impresa={p.impresa} />
              <Link href={`/partituras/${p.id}`}
                className="font-medium text-gray-800 hover:text-indigo-600 transition-colors flex-1">
                {p.titulo}
              </Link>
              {p.autor && <span className="text-sm text-gray-400">{p.autor}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
