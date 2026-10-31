export const BLOQUEOS_KEY = 'horasBloqueadas'
export interface HoraBloqueada { id: string; fecha: string; inicio: number; fin: number }

export function cargarBloqueos(storage: Pick<Storage, 'getItem'> = localStorage): HoraBloqueada[] {
  const value: unknown = JSON.parse(storage.getItem(BLOQUEOS_KEY) || '[]')
  if (!Array.isArray(value)) return []
  return value.filter((r): r is HoraBloqueada => typeof r === 'object' && r !== null && typeof r.id === 'string' && typeof r.fecha === 'string' && Number.isFinite(r.inicio) && Number.isFinite(r.fin) && r.inicio < r.fin)
}

export function horarioBloqueado(bloqueos: HoraBloqueada[], fecha: string, inicio: number, duracion: number) {
  return bloqueos.some(b => b.fecha === fecha && inicio < b.fin && b.inicio < inicio + duracion)
}

export const limpiarTelefono = (value: string) => value.replace(/[^0-9+]/g, '').slice(0, 15)