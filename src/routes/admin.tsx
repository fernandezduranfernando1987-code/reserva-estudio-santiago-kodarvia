import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ArrowLeft, CalendarDays, Check, CheckCheck, ClipboardList, Clock3, Search, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { completarReserva, fechaChile, leerReservas, vistaReserva, type Registro } from '@/lib/admin-reservas'
import { BloqueosAdmin } from '@/components/bloqueos-admin'

export const Route = createFileRoute('/admin')({
  head: () => ({ meta: [
    { title: 'Panel Admin · Estudio Santiago' },
    { name: 'description', content: 'Gestión de reservas del Estudio Santiago: agenda, clientes y estados de las sesiones.' },
    { property: 'og:title', content: 'Panel Admin · Estudio Santiago' },
    { property: 'og:description', content: 'Agenda y gestión de sesiones del Estudio Santiago.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
  ] }),
  component: AdminPage,
})

function AdminPage() {
  const [source, setSource] = useState<{ key: string; rows: Registro[] }>({ key: '', rows: [] })
  const [ready, setReady] = useState(false)
  const [search, setSearch] = useState('')
  const [date, setDate] = useState('')
  const [today, setToday] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const refresh = () => {
      try { setSource(leerReservas(localStorage)); setToday(fechaChile()); setError('') }
      catch { setError('No se pudo acceder a las reservas guardadas en este navegador.') }
      setReady(true)
    }
    refresh()
    window.addEventListener('storage', refresh)
    window.addEventListener('focus', refresh)
    return () => { window.removeEventListener('storage', refresh); window.removeEventListener('focus', refresh) }
  }, [])

  const rows = source.rows.map((raw, index) => ({ raw, index, ...vistaReserva(raw) }))
  const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  const filtered = rows.filter(r => normalize(r.nombre).includes(normalize(search.trim())) && (!date || r.fecha === date))
    .sort((a, b) => `${a.fecha}${a.hora}`.localeCompare(`${b.fecha}${b.hora}`))

  const update = (index: number, remove: boolean) => {
    const selected = source.rows[index]
    if (!selected || !source.key) return
    if (remove && !window.confirm(`¿Borrar la reserva de ${vistaReserva(selected).nombre}? Esta acción no se puede deshacer.`)) return
    try {
      const current = JSON.parse(localStorage.getItem(source.key) || '[]')
      if (JSON.stringify(current) !== JSON.stringify(source.rows)) {
        setSource(leerReservas(localStorage)); setError('Las reservas cambiaron. Revisa la lista y vuelve a intentarlo.'); return
      }
      const next = remove ? source.rows.filter((_, i) => i !== index) : source.rows.map((r, i) => i === index ? completarReserva(r) : r)
      localStorage.setItem(source.key, JSON.stringify(next))
      setSource({ ...source, rows: next }); setError('')
      setMessage(remove ? 'Reserva eliminada.' : 'Reserva marcada como completada.')
    } catch { setError('No se pudo guardar el cambio. La reserva no fue modificada.') }
  }

  const stats = [
    { title: 'Total reservas', value: rows.length, Icon: ClipboardList },
    { title: 'Hoy', value: rows.filter(r => r.fecha === today).length, Icon: CalendarDays },
    { title: 'Pendientes', value: rows.filter(r => r.estado === 'pendiente').length, Icon: Clock3 },
  ]
  const field = 'h-11 w-full rounded-md border border-input bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring'

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-7 sm:px-8 sm:py-10">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-5 border-b border-border pb-7">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase text-primary">Estudio independiente · Santiago</p>
          <h1 className="font-display text-4xl leading-none tracking-normal sm:text-5xl">Panel Admin</h1>
          <p className="mt-3 text-sm text-muted-foreground">Estudio Santiago · Gestión de reservas</p>
        </div>
        <Button asChild variant="outline" className="h-11"><a href="/"><ArrowLeft />Volver a la web</a></Button>
      </header>

      <section aria-label="Resumen de reservas" className="mb-9 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-5">
        {stats.map(({ title, value, Icon }) => <div key={title} className="flex items-center justify-between rounded-lg border border-admin-border bg-admin-surface p-5 text-admin-ink sm:block sm:p-6">
          <div className="flex items-center gap-3 sm:justify-between"><p className="text-sm font-medium text-admin-muted">{title}</p><Icon className="size-5 text-primary" /></div>
          <p className="font-display text-4xl leading-none tracking-normal sm:mt-5">{ready ? value : '—'}</p>
        </div>)}
      </section>

      <section aria-labelledby="reservas-heading">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <h2 id="reservas-heading" className="text-3xl tracking-normal">Reservas <span className="ml-2 font-sans text-sm text-muted-foreground">{filtered.length}</span></h2>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <div className="relative sm:w-64"><Search className="pointer-events-none absolute left-3 top-3.5 size-4 text-muted-foreground" /><input aria-label="Buscar por nombre" placeholder="Buscar por nombre" value={search} onChange={e => setSearch(e.target.value)} className={`${field} pl-10`} /></div>
            <input aria-label="Filtrar por fecha" type="date" value={date} onChange={e => setDate(e.target.value)} className={`${field} scheme-dark sm:w-44`} />
            {(search || date) && <Button variant="outline" size="icon" className="h-11 w-11" title="Limpiar filtros" aria-label="Limpiar filtros" onClick={() => { setSearch(''); setDate('') }}><X /></Button>}
          </div>
        </div>
        {error && <p role="alert" className="mb-4 rounded-md border border-destructive bg-destructive/10 p-3 text-sm">{error}</p>}
        {message && <p role="status" className="mb-4 flex items-center gap-2 text-sm text-foreground"><CheckCheck className="size-4 text-whatsapp" />{message}</p>}
        <div className="overflow-x-auto border-y border-admin-border bg-admin-surface text-admin-ink">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-admin-border"><tr>{['Nombre', 'Email/Telefono', 'Fecha', 'Hora', 'Servicio', 'Estado', 'Acciones'].map(title => <th key={title} scope="col" className="px-4 py-4 text-xs font-semibold text-admin-muted">{title}</th>)}</tr></thead>
            <tbody>{filtered.map(r => <tr key={r.index} className="border-b border-admin-border last:border-0 hover:bg-admin-hover">
              <td className="max-w-52 px-4 py-5"><p className="break-words font-semibold">{r.nombre}</p>{r.proyecto && <p className="mt-1 break-words text-xs text-admin-muted">{r.proyecto}</p>}</td>
              <td className="max-w-60 px-4 py-5"><p className="break-all">{r.email || '—'}</p><p className="mt-1 text-xs text-admin-muted">{r.telefono || '—'}</p></td>
              <td className="whitespace-nowrap px-4 py-5">{/^\d{4}-\d{2}-\d{2}$/.test(r.fecha) ? new Date(`${r.fecha}T12:00:00`).toLocaleDateString('es-CL') : r.fecha || '—'}</td>
              <td className="whitespace-nowrap px-4 py-5 text-xs">{r.hora}</td>
              <td className="px-4 py-5">{r.servicio}</td>
              <td className="px-4 py-5"><span className={`inline-flex items-center gap-1.5 text-xs font-medium capitalize ${r.estado === 'completada' ? 'text-admin-success' : r.estado === 'pendiente' ? 'text-primary' : 'text-admin-muted'}`}><span className="size-1.5 rounded-full bg-current" />{r.estado}</span></td>
              <td className="px-4 py-5"><div className="flex gap-1"><Button variant="ghost" size="icon" className="text-admin-success hover:bg-admin-hover hover:text-admin-success" title="Marcar como completada" aria-label={`Completar reserva de ${r.nombre}`} disabled={r.estado === 'completada' || r.estado === 'cancelada'} onClick={() => update(r.index, false)}><Check /></Button><Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" title="Borrar reserva" aria-label={`Borrar reserva de ${r.nombre}`} onClick={() => update(r.index, true)}><Trash2 /></Button></div></td>
            </tr>)}</tbody>
          </table>
          {!filtered.length && <div className="flex min-h-64 flex-col items-center justify-center gap-4 px-5 text-center"><ClipboardList className="size-9 text-admin-muted" /><p className="text-lg font-semibold">{!ready ? 'Cargando reservas…' : rows.length ? 'No hay reservas para esta búsqueda' : 'No hay reservas por el momento. Cuando un cliente reserve, aparecerá aquí.'}</p>{!!rows.length && <Button variant="link" onClick={() => { setSearch(''); setDate('') }}>Limpiar filtros</Button>}</div>}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">{ready ? `${filtered.length} de ${rows.length} reservas` : 'Cargando…'}</p>
      </section>
      <BloqueosAdmin />
      <footer className="mt-10 border-t border-border pt-5 text-xs text-muted-foreground">Estudio independiente · Santiago de Chile</footer>
    </main>
  )
}
