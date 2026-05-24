import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cantoral',
  description: 'Gestión del repertorio del coro parroquial',
}

const navLinks = [
  { href: '/partituras', label: 'Partituras' },
  { href: '/eventos', label: 'Eventos' },
  { href: '/practicas', label: 'Prácticas' },
  { href: '/ordinarios', label: 'Ordinarios' },
  { href: '/solemnidades', label: 'Solemnidades' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full antialiased">
      <body style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}>
        <nav style={{ backgroundColor: 'var(--bg-nav)', borderBottom: '1px solid var(--border)' }}
          className="px-6 py-3 flex gap-6 items-center">
          <Link href="/" style={{ color: '#8bc48b' }} className="font-semibold text-lg">🎵 Cantoral</Link>
          {navLinks.map(l => (
            <Link key={l.href} href={l.href}
              style={{ color: 'var(--text-secondary)' }}
              className="text-sm hover:brightness-125 transition-all">
              {l.label}
            </Link>
          ))}
        </nav>
        <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  )
}
