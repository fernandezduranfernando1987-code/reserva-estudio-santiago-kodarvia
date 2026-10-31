import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import { InformacionEstudio } from '@/components/informacion-estudio';
import { cargarBloqueos, horarioBloqueado, limpiarTelefono, type HoraBloqueada } from '@/lib/horas-bloqueadas';
import {
  DIAS, EJEMPLO, TIPOS, cargar, fin, guardar, haySolape, iso, semana,
  type Reserva, type Tipo,
} from "@/lib/reservas";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Reserva tu hora · Estudio de Grabación" },
      { name: "description", content: "Agenda grabación, mezcla o masterización en nuestro estudio en Chile. Lunes a sábado, 14:00 a 22:00." },
      { property: "og:title", content: "Reserva tu hora · Estudio de Grabación" },
      { property: "og:description", content: "Agenda grabación, mezcla o masterización. Lunes a sábado, 14:00 a 22:00." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const btn = "min-h-12 rounded-lg px-4 font-semibold transition active:scale-95";
const btnP = `${btn} bg-primary text-primary-foreground hover:opacity-90`;
const btnS = `${btn} bg-secondary text-foreground border border-border hover:bg-card`;
const input = "w-full min-h-12 rounded-lg bg-secondary border border-input px-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";
const fechaLarga = (f: string) =>
  new Date(f + "T12:00").toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" });

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-background/80 p-3" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-popover p-5 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function Index() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [listo, setListo] = useState(false);
  const [mias, setMias] = useState<string[]>([]);
  const [tipo, setTipo] = useState<Tipo>("grabacion");
  const [base, setBase] = useState(() => new Date(2026, 10, 10));
  const [fecha, setFecha] = useState("2026-11-10");
  const [nuevo, setNuevo] = useState<number | null>(null);
  const [form, setForm] = useState({ cliente: "", email: "", telefono: "", proyecto: "" });
  const [moviendo, setMoviendo] = useState<Reserva | null>(null);
  const [wsp, setWsp] = useState<Reserva | null>(null);
  const [aviso, setAviso] = useState("");
  const [bloqueos, setBloqueos] = useState<HoraBloqueada[]>([]);
  const [errorBloqueos, setErrorBloqueos] = useState(false);

  useEffect(() => {
    setReservas(cargar());
    setMias(JSON.parse(localStorage.getItem("kodarvia_mias") || "[]"));
    setListo(true);
  }, []);
  useEffect(() => { if (listo) guardar(reservas); }, [reservas, listo]);
  useEffect(() => { if (listo) localStorage.setItem("kodarvia_mias", JSON.stringify(mias)); }, [mias, listo]);
  useEffect(() => {
    const refresh = () => { try { setBloqueos(cargarBloqueos()); setErrorBloqueos(false); } catch { setErrorBloqueos(true); } };
    refresh();
    window.addEventListener('storage', refresh); window.addEventListener('focus', refresh); window.addEventListener('horarios-cambiados', refresh);
    return () => { window.removeEventListener('storage', refresh); window.removeEventListener('focus', refresh); window.removeEventListener('horarios-cambiados', refresh); };
  }, []);

  const dias = semana(base);
  const tipoActivo = moviendo ? moviendo.tipo : tipo;

  const clickBloque = (h: number) => {
    try { if (horarioBloqueado(cargarBloqueos(), fecha, h, TIPOS[tipoActivo].duracion)) { setAviso('Ese horario está bloqueado. Elige otro.'); return; } }
    catch { setAviso('No se pudo verificar la disponibilidad. Inténtalo nuevamente.'); return; }
    if (haySolape(reservas, fecha, tipoActivo, h, moviendo?.id)) return;
    if (moviendo) {
      setReservas((rs) => rs.map((r) => (r.id === moviendo.id ? { ...r, fecha, inicio: h } : r)));
      setAviso(`Listo, movimos tu sesión al ${fechaLarga(fecha)} a las ${h}:00.`);
      setMoviendo(null);
    } else {
      setNuevo(h);
      setAviso("");
    }
  };

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.cliente.trim() || !form.email.trim() || !form.telefono.trim()) {
      alert("Ojo: nombre, email y teléfono son obligatorios.");
      return;
    }
    let bloqueado = true;
    try { bloqueado = nuevo === null || horarioBloqueado(cargarBloqueos(), fecha, nuevo, TIPOS[tipo].duracion); } catch {}
    if (nuevo === null || bloqueado || haySolape(reservas, fecha, tipo, nuevo)) {
      alert("Ese bloque ya se tomó, elige otro.");
      return;
    }
    const r: Reserva = { id: `r${Date.now()}`, tipo, fecha, inicio: nuevo, ...form };
    setReservas((rs) => [...rs, r]);
    setMias((m) => [...m, r.id]);
    setNuevo(null);
    setForm({ cliente: "", email: "", telefono: "", proyecto: "" });
    setWsp(r);
  };

  const cancelar = (id: string) => {
    if (!confirm("¿Seguro que quieres cancelar esta reserva?")) return;
    setReservas((rs) => rs.filter((r) => r.id !== id));
    setMias((m) => m.filter((x) => x !== id));
  };

  const misReservas = [...reservas].sort((a, b) => (a.fecha + String(a.inicio).padStart(2, "0")).localeCompare(b.fecha + String(b.inicio).padStart(2, "0")));

  const Fila = ({ r, acciones }: { r: Reserva; acciones?: boolean }) => (
    <li className="rounded-xl bg-card p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-semibold break-words">{TIPOS[r.tipo].nombre} · {r.inicio}:00–{fin(r)}:00</p>
        <p className="text-sm text-muted-foreground capitalize">{fechaLarga(r.fecha)}</p>
        <p className="text-sm break-words">{r.cliente}{r.proyecto ? ` — ${r.proyecto}` : ""}</p>
        {!acciones && <p className="text-xs text-muted-foreground break-all">{r.email} · {r.telefono}</p>}
      </div>
      <div className="flex gap-2">
        {acciones && (
          <button className={btnS + " flex-1"} onClick={() => { setMoviendo(r); setFecha(r.fecha); setBase(new Date(r.fecha + "T12:00")); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Mover</button>
        )}
        <button className={btnP + " flex-1"} onClick={() => cancelar(r.id)}>Cancelar</button>
      </div>
    </li>
  );

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 space-y-8">
      <header>
        <p className="text-sm uppercase tracking-widest text-primary font-semibold">Estudio independiente · Santiago</p>
        <h1 className="text-5xl sm:text-6xl leading-none mt-1">Reserva tu sesión</h1>
        <p className="text-muted-foreground mt-2">Lunes a sábado de 14:00 a 22:00. Elige qué necesitas, el día y un bloque libre.</p>
      </header>

      {moviendo && (
        <div className="rounded-xl border-2 border-primary p-4 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <p>Moviendo <b>{TIPOS[moviendo.tipo].nombre}</b> de {moviendo.cliente}. Elige un bloque libre.</p>
          <button className={btnS} onClick={() => setMoviendo(null)}>No mover</button>
        </div>
      )}
      {aviso && <p className="rounded-xl bg-card p-4">{aviso}</p>}

      <section className="space-y-3">
        <h2 className="text-3xl">1. Tipo de sesión</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {(Object.keys(TIPOS) as Tipo[]).map((t) => (
            <button key={t} disabled={!!moviendo} onClick={() => setTipo(t)}
              className={`${btn} py-3 text-left disabled:opacity-50 ${tipoActivo === t ? "bg-primary text-primary-foreground" : "bg-card"}`}>
              <span className="block">{TIPOS[t].nombre}</span>
              <span className="text-sm opacity-80">{TIPOS[t].duracion} {TIPOS[t].duracion > 1 ? "horas" : "hora"}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-3xl">2. Día</h2>
          <div className="flex gap-2">
            <button aria-label="Semana anterior" className={btnS} onClick={() => { const lunes = dias[0]; if (lunes) setBase(new Date(lunes.getTime() - 7 * 864e5)); }}>‹</button>
            <button aria-label="Semana siguiente" className={btnS} onClick={() => { const lunes = dias[0]; if (lunes) setBase(new Date(lunes.getTime() + 7 * 864e5)); }}>›</button>
          </div>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {dias.map((d, i) => {
            const f = iso(d);
            return (
              <button key={f} onClick={() => setFecha(f)}
                className={`${btn} py-2 ${fecha === f ? "bg-primary text-primary-foreground" : "bg-card"}`}>
                <span className="block text-sm">{DIAS[i]}</span>
                <span className="font-display text-2xl">{d.getDate()}</span>
                <span className="block text-xs opacity-80">{d.toLocaleDateString("es-CL", { month: "short" })}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-3xl">3. Bloque</h2>
        <p className="text-sm text-muted-foreground capitalize">{fechaLarga(fecha)}</p>
        {errorBloqueos && <p role="alert" className="text-sm">No se pudo verificar la disponibilidad de horarios.</p>}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TIPOS[tipoActivo].bloques.map((h) => {
            const ocupado = haySolape(reservas, fecha, tipoActivo, h, moviendo?.id);
            const bloqueado = horarioBloqueado(bloqueos, fecha, h, TIPOS[tipoActivo].duracion);
            return (
              <button key={h} disabled={!listo || errorBloqueos || ocupado || bloqueado} onClick={() => clickBloque(h)}
                className={`${btn} py-3 ${ocupado || bloqueado ? "bg-ocupado text-muted-foreground line-through cursor-not-allowed" : "bg-libre text-libre-foreground hover:ring-2 hover:ring-primary"}`}>
                {h}:00 – {h + TIPOS[tipoActivo].duracion}:00
                <span className="block text-xs no-underline">{bloqueado ? "Bloqueado" : ocupado ? "Ocupado" : "Libre"}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-3xl">Mis reservas</h2>
        {misReservas.length === 0 ? (
          <p className="text-muted-foreground">No hay reservas agendadas.</p>
        ) : (
          <ul className="space-y-2">{misReservas.map((r) => <Fila key={r.id} r={r} acciones />)}</ul>
        )}
      </section>

      <InformacionEstudio />

      <section className="space-y-3 border-t border-border pt-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <Button asChild variant="outline" className="min-h-12"><Link to="/admin">Panel admin</Link></Button>
          <button className={btnS} onClick={() => {
            if (!confirm("Esto borra todo y vuelve a los datos de ejemplo. ¿Seguimos?")) return;
            setReservas(EJEMPLO); guardar(EJEMPLO); setMias([]); setMoviendo(null); setAviso("Datos de ejemplo restaurados.");
          }}>Reiniciar datos de ejemplo</button>
        </div>
      </section>

      <footer className="border-t border-border pt-6 pb-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
        <p>Estudio independiente · Santiago de Chile</p>
        <a href="/admin" className="font-semibold text-foreground underline underline-offset-4 hover:text-primary">Admin</a>
      </footer>

      {nuevo !== null && (
        <Modal onClose={() => setNuevo(null)}>
          <h2 className="text-3xl">Confirma tu {TIPOS[tipo].nombre.toLowerCase()}</h2>
          <p className="text-sm text-muted-foreground capitalize mb-4">{fechaLarga(fecha)} · {nuevo}:00–{nuevo + TIPOS[tipo].duracion}:00</p>
          <form onSubmit={enviar} noValidate className="space-y-3">
            <input className={input} placeholder="Tu nombre o banda *" value={form.cliente} onChange={(e) => setForm({ ...form, cliente: e.target.value })} />
            <input className={input} type="email" placeholder="Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className={input} type="tel" maxLength={15} placeholder="Teléfono * (+56 9 ...)" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: limpiarTelefono(e.target.value) })} />
            <input className={input} placeholder="Proyecto (opcional)" value={form.proyecto} onChange={(e) => setForm({ ...form, proyecto: e.target.value })} />
            <div className="flex gap-2 pt-2">
              <button type="button" className={btnS + " flex-1"} onClick={() => setNuevo(null)}>Volver</button>
              <button type="submit" className={btnP + " flex-1"}>Reservar</button>
            </div>
          </form>
        </Modal>
      )}

      {wsp && (
        <Modal onClose={() => setWsp(null)}>
          <p className="text-sm text-muted-foreground">Simulación de WhatsApp para {wsp.telefono}</p>
          <div className="mt-3 rounded-xl bg-whatsapp text-primary-foreground p-4 text-sm leading-relaxed">
            ¡Hola {wsp.cliente}! 🎙️ Tu sesión de <b>{TIPOS[wsp.tipo].nombre}</b> quedó agendada para el <span className="capitalize">{fechaLarga(wsp.fecha)}</span> de {wsp.inicio}:00 a {fin(wsp)}:00. Si necesitas moverla, avísanos con tiempo. ¡Nos vemos en el estudio!
          </div>
          <button className={btnP + " w-full mt-4"} onClick={() => setWsp(null)}>Bacán, gracias</button>
        </Modal>
      )}

    </main>
  );
}
