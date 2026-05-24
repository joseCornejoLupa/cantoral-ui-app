import { getPartitura } from '@/lib/api'
import EditarPartituraForm from './EditarPartituraForm'
import { notFound } from 'next/navigation'

export default async function EditarPartituraPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const partitura = await getPartitura(id).catch(() => null)
  if (!partitura) notFound()

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Editar partitura</h1>
      <EditarPartituraForm partitura={partitura} />
    </div>
  )
}
