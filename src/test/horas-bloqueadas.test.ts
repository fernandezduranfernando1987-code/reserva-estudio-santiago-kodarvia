import { describe, expect, it } from 'vitest'
import { BLOQUEOS_KEY, cargarBloqueos, horarioBloqueado, limpiarTelefono } from '@/lib/horas-bloqueadas'
describe('Bloqueos manuales', () => {
  const rows = [{ id: 'b1', fecha: '2026-11-10', inicio: 18, fin: 19 }]
  it('lee horasBloqueadas sin modificar reservas', () => {
    expect(BLOQUEOS_KEY).toBe('horasBloqueadas')
    expect(cargarBloqueos({ getItem: key => key === 'horasBloqueadas' ? JSON.stringify(rows) : null })).toEqual(rows)
  })
  it('impide reservar cualquier servicio que solape el bloqueo', () => {
    expect(horarioBloqueado(rows, '2026-11-10', 17, 3)).toBe(true)
    expect(horarioBloqueado(rows, '2026-11-10', 18, 2)).toBe(true)
    expect(horarioBloqueado(rows, '2026-11-10', 18, 1)).toBe(true)
  })
  it('permite los límites contiguos y otros días', () => {
    expect(horarioBloqueado(rows, '2026-11-10', 19, 1)).toBe(false)
    expect(horarioBloqueado(rows, '2026-11-11', 18, 1)).toBe(false)
  })
  it('teléfono solo conserva números y +', () => { expect(limpiarTelefono('+56 (9) abc-123')).toBe('+569123') })
  it('teléfono tiene máximo 15 caracteres', () => { expect(limpiarTelefono('+1234567890123456789')).toBe('+12345678901234') })
})