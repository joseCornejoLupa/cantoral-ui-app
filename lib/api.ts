const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: HeadersInit = init?.body !== undefined
    ? { 'Content-Type': 'application/json' }
    : {}
  const res = await fetch(`${BASE}${path}`, { headers, ...init })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Error ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

// --- Tipos ---

export type TipoSolemnidad = 'liturgica' | 'mariana' | 'propia'
export type Idioma = 'Español' | 'Latín' | 'Griego' | 'Hebreo' | 'Bilingüe'
export type Contexto = 'Misa' | 'Adoración' | 'Vía Crucis' | 'Rosario' | 'Procesión' | 'Otro'
export type ParteOrdinario = 'Kyrie' | 'Gloria' | 'Santo' | 'Cordero'

export interface Solemnidad {
  id: string
  nombre: string
  tipo: TipoSolemnidad
  fecha?: string
  tiempoLiturgico?: string
}

export interface AptitudMomento {
  momento: string
  contexto: Contexto
}

export interface Partitura {
  id: string
  titulo: string
  autor?: string
  descripcion?: string
  idioma: Idioma
  impresa: boolean
  creadoEn: string
  solemnidadIds: string[]
  aptitudes: AptitudMomento[]
}

export interface CantoEvento {
  partituraId: string
  momento: string
}

export interface Evento {
  id: string
  tipo: Contexto
  fecha: string
  nota?: string
  cantos: CantoEvento[]
}

export interface Practica {
  id: string
  fecha: string
  nota?: string
  partituraIds: string[]
}

// --- Solemnidades ---

export const getSolemnidades = (tipo?: TipoSolemnidad) =>
  request<Solemnidad[]>(`/solemnidades${tipo ? `?tipo=${tipo}` : ''}`)

export const crearSolemnidad = (data: Omit<Solemnidad, 'id'>) =>
  request<Solemnidad>('/solemnidades', { method: 'POST', body: JSON.stringify(data) })

// --- Partituras ---

export interface FiltrosPartitura {
  idioma?: Idioma
  impresa?: boolean
  solemnidadId?: string
  contexto?: Contexto
  momento?: string
}

export const getPartituras = (filtros?: FiltrosPartitura) => {
  const params = new URLSearchParams()
  if (filtros?.idioma) params.set('idioma', filtros.idioma)
  if (filtros?.impresa !== undefined) params.set('impresa', String(filtros.impresa))
  if (filtros?.solemnidadId) params.set('solemnidadId', filtros.solemnidadId)
  if (filtros?.contexto) params.set('contexto', filtros.contexto)
  if (filtros?.momento) params.set('momento', filtros.momento)
  const qs = params.toString()
  return request<Partitura[]>(`/partituras${qs ? `?${qs}` : ''}`)
}

export const getPartitura = (id: string) =>
  request<Partitura>(`/partituras/${id}`)

export const crearPartitura = (data: Omit<Partitura, 'id' | 'creadoEn'>) =>
  request<Partitura>('/partituras', { method: 'POST', body: JSON.stringify(data) })

export const actualizarImpresa = (id: string, impresa: boolean) =>
  request<Partitura>(`/partituras/${id}/impresa`, {
    method: 'PATCH',
    body: JSON.stringify({ impresa }),
  })

export const actualizarPartitura = (id: string, data: Partial<Pick<Partitura, 'titulo' | 'autor' | 'descripcion' | 'idioma'>>) =>
  request<Partitura>(`/partituras/${id}`, { method: 'PATCH', body: JSON.stringify(data) })

export const getRecomendaciones = (id: string) =>
  request<Partitura[]>(`/partituras/${id}/recomendaciones`)

export const eliminarPartitura = (id: string) =>
  request<void>(`/partituras/${id}`, { method: 'DELETE' })

// --- Eventos ---

export const getEventos = () => request<Evento[]>('/eventos')

export const getEvento = (id: string) => request<Evento>(`/eventos/${id}`)

export const crearEvento = (data: Omit<Evento, 'id'>) =>
  request<Evento>('/eventos', { method: 'POST', body: JSON.stringify(data) })

export const eliminarEvento = (id: string) =>
  request<void>(`/eventos/${id}`, { method: 'DELETE' })

// --- Ordinarios ---

export interface PiezaOrdinario {
  parte: ParteOrdinario
  partituraId: string
}

export interface Ordinario {
  id: string
  nombre: string
  compositor?: string
  piezas: PiezaOrdinario[]
}

export const getOrdinarios = () => request<Ordinario[]>('/ordinarios')

export const crearOrdinario = (data: { nombre: string; compositor?: string }) =>
  request<Ordinario>('/ordinarios', { method: 'POST', body: JSON.stringify(data) })

export const asignarPiezaOrdinario = (id: string, data: { partituraId: string; parte: ParteOrdinario }) =>
  request<Ordinario>(`/ordinarios/${id}/piezas`, { method: 'POST', body: JSON.stringify(data) })

// --- Prácticas ---

export const getPracticas = () => request<Practica[]>('/practicas')

export const crearPractica = (data: Omit<Practica, 'id'>) =>
  request<Practica>('/practicas', { method: 'POST', body: JSON.stringify(data) })

export const getNoImpresos = (id: string) =>
  request<Partitura[]>(`/practicas/${id}/no-impresos`)

export const eliminarPractica = (id: string) =>
  request<void>(`/practicas/${id}`, { method: 'DELETE' })
