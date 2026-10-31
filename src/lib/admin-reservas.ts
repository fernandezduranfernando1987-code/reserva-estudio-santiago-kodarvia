import { STORAGE_KEY, TIPOS } from './reservas'

export type Registro = Record<string, unknown>
export const ADMIN_KEYS = ['reservas', 'reservas-estudio', 'bookings', STORAGE_KEY]

export function leerReservas(storage: Pick<Storage, 'getItem'>): { key: string; rows: Registro[] } {
  for (const key of ADMIN_KEYS) {
    try {
      const value: unknown = JSON.parse(storage.getItem(key) || '[]')
      if (Array.isArray(value)) {
        const rows = value.filter((r): r is Registro => typeof r === 'object' && r !== null && !Array.isArray(r))
        if (rows.length) return { key, rows }
      }
    } catch { /* Try the next source when a stored value is invalid. */ }
  }
  return { key: STORAGE_KEY, rows: [] }
}

const texto = (...values: unknown[]) => {
  const value = values.find(v => (typeof v === 'string' && v.trim()) || typeof v === 'number')
  return value === undefined ? '' : String(value)
}
export function vistaReserva(row: Registro) {
  const tipo = texto(row['tipo'], row['servicio'], row['service'], row['service_type'])
  const config = tipo === 'grabacion' || tipo === 'mezcla' || tipo === 'master' ? TIPOS[tipo] : undefined
  const inicio = texto(row['inicio'], row['hora'], row['time'], row['start_time'])
  const hora = /^\d{1,2}$/.test(inicio) ? `${inicio.padStart(2, '0')}:00` : inicio
  const estado = texto(row['estado'], row['status']).toLowerCase() || 'pendiente'
  return {
    nombre: texto(row['nombre'], row['cliente'], row['name'], row['customer_name']) || 'Sin nombre',
    email: texto(row['email'], row['correo'], row['customer_email']),
    telefono: texto(row['telefono'], row['phone'], row['customer_phone']),
    fecha: texto(row['fecha'], row['date'], row['booking_date']).slice(0, 10),
    hora: config && typeof row['inicio'] === 'number' ? `${hora} – ${String(row['inicio'] + config.duracion).padStart(2, '0')}:00` : hora || '—',
    servicio: config?.nombre || tipo || '—',
    proyecto: texto(row['proyecto'], row['project']),
    estado: ['completed', 'completada', 'completado'].includes(estado) ? 'completada' : ['cancelled', 'canceled', 'cancelada', 'cancelado'].includes(estado) ? 'cancelada' : ['confirmed', 'confirmada', 'confirmado'].includes(estado) ? 'confirmada' : 'pendiente',
  }
}

export function completarReserva(row: Registro): Registro {
  return { ...row, ...('status' in row ? { status: 'completed' } : {}), estado: 'completada' }
}

export function fechaChile(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Santiago', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now)
}