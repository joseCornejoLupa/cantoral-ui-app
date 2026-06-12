export const dynamic = 'force-dynamic'

import { getPartituras } from '@/lib/api'
import NuevoEventoForm from './NuevoEventoForm'

export default async function NuevoEventoPage() {
  const partituras = await getPartituras()
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Nuevo evento</h1>
      <NuevoEventoForm partituras={partituras} />
    </div>
  )
}
