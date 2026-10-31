import { useEffect, useState } from 'react'
import { LockKeyhole, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BLOQUEOS_KEY, cargarBloqueos, horarioBloqueado, type HoraBloqueada } from '@/lib/horas-bloqueadas'

export function BloqueosAdmin() {
  const [bloqueos, setBloqueos] = useState<HoraBloqueada[]>([])
  const [fecha, setFecha] = useState('')
  const [inicio, setInicio] = useState(14)
  const [fin, setFin] = useState(15)
  const [aviso, setAviso] = useState('')
  const [error, setError] = useState(false)
  useEffect(() => {
    const refresh = () => { try { setBloqueos(cargarBloqueos()) } catch { setError(true); setAviso('No se pudieron leer los horarios bloqueados.') } }
    refresh(); window.addEventListener('storage', refresh); window.addEventListener('focus', refresh)
    return () => { window.removeEventListener('storage', refresh); window.removeEventListener('focus', refresh) }
  }, [])
  const save = (next: HoraBloqueada[]) => { localStorage.setItem(BLOQUEOS_KEY, JSON.stringify(next)); setBloqueos(next); window.dispatchEvent(new Event('horarios-cambiados')) }
  const field = 'mt-2 h-11 w-full rounded-md border border-input bg-secondary px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring'
  return <section className="mt-10 border-t border-border pt-7" aria-labelledby="bloqueos-title">
    <h2 id="bloqueos-title" className="text-3xl tracking-normal">Bloquear horarios</h2>
    <form className="mt-5 grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-4" onSubmit={e => {
      e.preventDefault(); setError(false)
      try {
        if (!fecha || fin <= inicio) throw new Error('Elige una fecha y una hora de término posterior al inicio.')
        const current = cargarBloqueos()
        if (horarioBloqueado(current, fecha, inicio, fin - inicio)) throw new Error('Ese horario ya está bloqueado.')
        save([...current, { id: crypto.randomUUID(), fecha, inicio, fin }]); setAviso('Horario bloqueado correctamente.')
      } catch (err) { setError(true); setAviso(err instanceof Error ? err.message : 'No se pudo guardar el bloqueo.') }
    }}>
      <label className="text-sm">Fecha<input required type="date" aria-label="Fecha del bloqueo" className={`${field} scheme-dark`} value={fecha} onChange={e => setFecha(e.target.value)} /></label>
      <label className="text-sm">Desde<select aria-label="Inicio del bloqueo" className={field} value={inicio} onChange={e => setInicio(Number(e.target.value))}>{Array.from({ length: 8 }, (_, i) => i + 14).map(h => <option key={h} value={h}>{h}:00</option>)}</select></label>
      <label className="text-sm">Hasta<select aria-label="Fin del bloqueo" className={field} value={fin} onChange={e => setFin(Number(e.target.value))}>{Array.from({ length: 8 }, (_, i) => i + 15).map(h => <option key={h} value={h}>{h}:00</option>)}</select></label>
      <Button className="h-11"><LockKeyhole />Bloquear este horario</Button>
    </form>
    {aviso && <p role={error ? 'alert' : 'status'} className="mt-4 text-sm">{aviso}</p>}
    <ul className="mt-5 divide-y divide-border">{[...bloqueos].sort((a,b) => `${a.fecha}${a.inicio}`.localeCompare(`${b.fecha}${b.inicio}`)).map(b => <li key={b.id} className="flex items-center justify-between gap-3 py-3 text-sm"><span>{b.fecha} · {b.inicio}:00 – {b.fin}:00</span><Button variant="ghost" size="icon" title="Eliminar bloqueo" aria-label={`Eliminar bloqueo ${b.fecha} ${b.inicio}`} onClick={() => {
      if (!confirm('¿Eliminar este bloqueo y volver a permitir reservas en ese horario?')) return
      try { save(cargarBloqueos().filter(item => item.id !== b.id)); setError(false); setAviso('Bloqueo eliminado.') } catch { setError(true); setAviso('No se pudo eliminar el bloqueo.') }
    }}><Trash2 /></Button></li>)}</ul>
  </section>
}