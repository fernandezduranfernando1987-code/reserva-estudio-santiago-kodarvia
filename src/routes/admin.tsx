import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { cargar, guardar, CLAVE } from '../lib/reservas'

export const Route = createFileRoute('/admin')({
  component: AdminPanel,
})

function AdminPanel(){
  const [clave, setClave] = useState('')
  const [ok, setOk] = useState(false)
  const [reservas, setReservas] = useState<any[]>([])
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')

  useEffect(()=>{ setReservas(cargar()) }, [ok])

  if(!ok){
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
        <div className="bg-zinc-900 p-6 rounded-xl w-full max-w-sm">
          <h1 className="text-xl mb-4">Panel Admin</h1>
          <input type="password" value={clave} onChange={e=>setClave(e.target.value)} placeholder="Clave" className="w-full p-2 rounded bg-zinc-800 mb-3" />
          <button onClick={()=>{ if(clave===CLAVE) setOk(true); else alert('Clave incorrecta')}} className="w-full bg-red-600 p-2 rounded">Entrar</button>
        </div>
      </div>
    )
  }

  const bloquear = ()=>{
    if(!fecha || !hora){ alert('Elige fecha y hora'); return }
    const nuevas = [...reservas, { id: Date.now(), fecha, hora, duracion: 1, nombre: 'BLOQUEADO', telefono: '', estado: 'bloqueado', bloqueoManual: true }]
    guardar(nuevas); setReservas(nuevas); setHora('')
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl mb-4">Admin - Bloquear horas manualmente</h1>
      <div className="flex gap-2 mb-6">
        <input type="date" value={fecha} onChange={e=>setFecha(e.target.value)} className="p-2 rounded bg-zinc-800" />
        <input type="time" value={hora} onChange={e=>setHora(e.target.value)} className="p-2 rounded bg-zinc-800" />
        <button onClick={bloquear} className="bg-red-600 px-4 rounded">Bloquear hora</button>
      </div>
      {reservas.length===0 ? (
        <p className="text-zinc-400">No hay reservas agendadas aún</p>
      ) : (
        <ul className="space-y-2">
          {reservas.map((r:any)=><li key={r.id} className="bg-zinc-900 p-2 rounded flex justify-between">{r.fecha} {r.hora} - {r.nombre} <button onClick={()=>{ const f=reservas.filter(x=>x.id!==r.id); guardar(f); setReservas(f)}} className="text-red-400">Eliminar</button></li>)}
        </ul>
      )}
    </div>
  )
}
