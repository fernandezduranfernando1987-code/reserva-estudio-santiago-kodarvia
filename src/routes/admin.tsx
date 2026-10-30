import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CLAVE, TIPOS, cargar, fin, guardar, iso, type Reserva } from "@/lib/reservas";

export const Route = createFileRoute("/admin")({
  component: Admin,
});

const btn = "min-h-12 rounded-lg px-4 font-semibold transition";
const btnP = `${btn} bg-primary text-primary-foreground`;
const btnS = `${btn} bg-secondary border`;
const input = "w-full min-h-12 rounded-lg bg-secondary border border-input px-3";

function Admin() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [clave, setClave] = useState("");
  const [ok, setOk] = useState(false);
  const [fecha, setFecha] = useState(iso(new Date()));
  const [hora, setHora] = useState(14);

  useEffect(() => { setReservas(cargar()); }, []);
  useEffect(() => { guardar(reservas); }, [reservas]);

  if (!ok) {
    return (
      <main className="mx-auto max-w-md px-4 py-20 space-y-4">
        <h1 className="text-4xl">Panel Admin /admin</h1>
        <form onSubmit={(e)=>{e.preventDefault(); if(clave===CLAVE) setOk(true); else alert("Clave mala")}} className="space-y-3">
          <input className={input} type="password" placeholder="admin123" value={clave} onChange={e=>setClave(e.target.value)} />
          <button className={btnP+" w-full"}>Entrar</button>
        </form>
        <a href="/" className={btnS+" block text-center py-3"}>Volver</a>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 space-y-6">
      <h1 className="text-4xl">Todas las reservas ({reservas.length})</h1>
      
      <div className="rounded-xl bg-card p-4 space-y-2 border">
        <h2 className="font-semibold">Bloquear horas manualmente</h2>
        <div className="flex gap-2">
          <input type="date" className={input} value={fecha} onChange={e=>setFecha(e.target.value)} />
          <select className={input} value={hora} onChange={e=>setHora(Number(e.target.value))}>
            {[14,15,16,17,18,19,20,21].map(h=> <option key={h} value={h}>{h}:00</option>)}
          </select>
          <button onClick={()=>{
            const r: Reserva = { id: `b${Date.now()}`, tipo: "grabacion", fecha, inicio: hora, cliente: "BLOQUEADO - Admin", email: "admin@estudio.cl", telefono: "+56 9 0000 0000", proyecto: "Bloqueo manual" };
            setReservas([...reservas, r]);
          }} className={btnP}>Bloquear</button>
        </div>
      </div>

      {reservas.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p>No hay reservas agendadas aún. Cuando lleguen reservas aparecerán aquí.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {reservas.map(r=>(
            <li key={r.id} className="rounded-xl bg-card border p-4 flex justify-between">
              <div><p className="font-semibold">{r.inicio}:00 - {fin(r)}:00 · {r.cliente}</p><p className="text-sm text-muted-foreground">{r.fecha}</p></div>
              <button onClick={()=>setReservas(reservas.filter(x=>x.id!==r.id))} className={btnP+" px-3"}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
      <a href="/" className={btnS+" block text-center py-3"}>Ir a reservas /</a>
    </main>
  )
}
