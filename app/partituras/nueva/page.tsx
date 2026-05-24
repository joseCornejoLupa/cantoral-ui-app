import { getSolemnidades } from '@/lib/api'
import NuevaPartituraForm from './NuevaPartituraForm'

export default async function NuevaPartituraPage() {
  const solemnidades = await getSolemnidades()

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Nueva partitura</h1>
      <NuevaPartituraForm solemnidades={solemnidades} />
    </div>
  )
}
