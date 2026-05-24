import Link from 'next/link'

const sections = [
  { href: '/partituras', label: 'Partituras', desc: 'Gestiona el repertorio, marca qué está impreso', emoji: '🎼' },
  { href: '/eventos', label: 'Eventos', desc: 'Registra misas, adoraciones, vía crucis y más', emoji: '📅' },
  { href: '/practicas', label: 'Prácticas', desc: 'Ensayos y cantos pendientes de imprimir', emoji: '🎙️' },
  { href: '/ordinarios', label: 'Ordinarios', desc: 'Colecciones de Kyrie, Gloria, Santo, Cordero', emoji: '🎹' },
  { href: '/solemnidades', label: 'Solemnidades', desc: 'Tiempos litúrgicos, marianas y propias', emoji: '✝️' },
]

export default function Home() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Repertorio del coro</h1>
      <p className="mb-8 text-sm" style={{ color: 'var(--text-secondary)' }}>Gestiona partituras, eventos y prácticas del coro parroquial.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map(s => (
          <Link key={s.href} href={s.href}
            className="surface rounded-xl p-5 block transition-all hover:surface-hover"
            style={{ textDecoration: 'none' }}>
            <div className="text-2xl mb-2">{s.emoji}</div>
            <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{s.label}</div>
            <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{s.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
