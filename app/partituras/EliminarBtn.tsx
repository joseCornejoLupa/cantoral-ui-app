'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { eliminarPartitura, eliminarEvento, eliminarPractica } from '@/lib/api'

type Tipo = 'partitura' | 'evento' | 'practica'

const fnMap: Record<Tipo, (id: string) => Promise<void>> = {
  partitura: eliminarPartitura,
  evento: eliminarEvento,
  practica: eliminarPractica,
}

export default function EliminarBtn({ id, tipo, redirectTo }: { id: string; tipo: Tipo; redirectTo?: string }) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  const handleClick = () => {
    if (!confirm('¿Eliminar? Esta acción no se puede deshacer.')) return
    startTransition(async () => {
      await fnMap[tipo](id)
      if (redirectTo) router.push(redirectTo)
      router.refresh()
    })
  }

  return (
    <button onClick={handleClick} disabled={pending}
      className="text-xs px-2 py-1 rounded transition-all shrink-0 disabled:opacity-40"
      style={{ color: '#c47a7a', backgroundColor: '#4a2e2e' }}>
      {pending ? '…' : 'Eliminar'}
    </button>
  )
}
