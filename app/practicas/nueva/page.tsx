export const dynamic = 'force-dynamic'

import { getPartituras } from '@/lib/api'
import NuevaPracticaForm from './NuevaPracticaForm'

export default async function NuevaPracticaPage() {
  const partituras = await getPartituras()
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Nueva práctica</h1>
      <NuevaPracticaForm partituras={partituras} />
    </div>
  )
}
