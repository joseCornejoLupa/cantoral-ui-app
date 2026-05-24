'use client'

import { useEffect } from 'react'

export default function ErrorModal({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}>
      <div
        className="rounded-xl p-6 max-w-sm w-full mx-4 flex flex-col gap-4"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid #7a3a3a' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-start gap-3">
          <span className="text-xl shrink-0" style={{ color: '#e07070' }}>⚠</span>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>{message}</p>
        </div>
        <button
          onClick={onClose}
          className="self-end px-4 py-1.5 rounded-lg text-sm font-medium"
          style={{ backgroundColor: '#5c3a3a', color: '#e07070', border: '1px solid #7a3a3a' }}>
          Cerrar
        </button>
      </div>
    </div>
  )
}
