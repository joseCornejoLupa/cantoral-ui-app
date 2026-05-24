'use client'

import { useState, useTransition } from 'react'
import { actualizarImpresa } from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function ImpresaToggle({ id, impresa }: { id: string; impresa: boolean }) {
  const [checked, setChecked] = useState(impresa)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  const toggle = () => {
    const next = !checked
    setChecked(next)
    startTransition(async () => {
      await actualizarImpresa(id, next)
      router.refresh()
    })
  }

  return (
    <button onClick={toggle} disabled={pending}
      title={checked ? 'Impresa — clic para desmarcar' : 'No impresa — clic para marcar'}
      className="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all"
      style={{
        backgroundColor: checked ? '#5c8c5c' : 'transparent',
        borderColor: checked ? '#5c8c5c' : 'var(--border)',
        color: '#fff',
      }}>
      {checked && <span className="text-xs leading-none">✓</span>}
    </button>
  )
}
