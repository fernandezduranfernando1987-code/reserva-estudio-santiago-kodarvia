import { describe, expect, it } from 'vitest'
import { completarReserva, fechaChile, leerReservas, vistaReserva } from '@/lib/admin-reservas'

describe('Panel de reservas', () => {
  it('elige la primera fuente con datos entre las claves solicitadas', () => {
    const data: Record<string, string> = { reservas: '[]', 'reservas-estudio': '[{"nombre":"Javiera"}]', bookings: '[{"name":"Matías"}]' }
    expect(leerReservas({ getItem: key => data[key] ?? null })).toEqual({ key: 'reservas-estudio', rows: [{ nombre: 'Javiera' }] })
  })
  it('lee las reservas reales de la web y salta datos dañados', () => {
    expect(leerReservas({ getItem: key => key === 'reservas' ? '{' : key === 'kodarvia_reservas' ? '[{"cliente":"Matías"}]' : null }).rows).toEqual([{ cliente: 'Matías' }])
  })
  it('marca completada sin perder los campos originales', () => {
    expect(completarReserva({ id: '1', nombre: 'Javiera', status: 'pending' })).toEqual({ id: '1', nombre: 'Javiera', status: 'completed', estado: 'completada' })
  })
  it('considera pendiente una reserva sin estado', () => {
    expect(vistaReserva({ cliente: 'Matías', tipo: 'grabacion', inicio: 14 }).estado).toBe('pendiente')
  })
  it('cuenta hoy según el día en Santiago', () => {
    expect(fechaChile(new Date('2026-10-31T01:00:00Z'))).toBe('2026-10-30')
  })
})