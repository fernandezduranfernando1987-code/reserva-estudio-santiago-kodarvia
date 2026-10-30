export const CLAVE = "admin123";
export const STORAGE_KEY = "kodarvia_reservas";
export type Tipo = "grabacion" | "mezcla" | "master";
export type Reserva = { id: string; tipo: Tipo; fecha: string; inicio: number; cliente: string; email: string; telefono: string; proyecto?: string; };
export const DIAS = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
export const TIPOS: Record<Tipo, { nombre: string; duracion: number; bloques: number[] }> = {
  grabacion: { nombre: "Grabación", duracion: 2, bloques: [14,16,18,20] },
  mezcla: { nombre: "Mezcla", duracion: 2, bloques: [14,16,18,20] },
  master: { nombre: "Masterización", duracion: 1, bloques: [14,15,16,17,18,19,20,21] },
};
export const EJEMPLO: Reserva[] = [
  { id: "1", tipo: "grabacion", fecha: "2026-11-10", inicio: 14, cliente: "Matías Rojas", email: "matias@gmail.com", telefono: "+56 9 1234 5678", proyecto: "Podcast" },
  { id: "2", tipo: "mezcla", fecha: "2026-11-11", inicio: 16, cliente: "Camila Fernández", email: "camila@gmail.com", telefono: "+56 9 8765 4321" },
  { id: "3", tipo: "grabacion", fecha: "2026-11-12", inicio: 18, cliente: "Javier Muñoz", email: "j.munoz@estudio.cl", telefono: "+56 9 1111 2222" },
  { id: "4", tipo: "master", fecha: "2026-11-13", inicio: 15, cliente: "Antonia Silva", email: "antonia@gmail.com", telefono: "+56 9 3333 4444" },
  { id: "5", tipo: "grabacion", fecha: "2026-11-10", inicio: 16, cliente: "Felipe González", email: "felipe@prod.cl", telefono: "+56 9 5555 6666" },
  { id: "6", tipo: "mezcla", fecha: "2026-11-11", inicio: 14, cliente: "Isidora Pérez", email: "isi@gmail.com", telefono: "+56 9 7777 8888" },
];
export const iso = (d: Date) => d.toISOString().split("T")[0];
export const fin = (r: Reserva) => r.inicio + TIPOS[r.tipo].duracion;
export const semana = (base: Date) => { const d = new Date(base); d.setDate(d.getDate() - d.getDay() + 1); return Array.from({ length: 6 }, (_, i) => { const nd = new Date(d); nd.setDate(d.getDate() + i); return nd; }); };
export const cargar = (): Reserva[] => { try { const raw = localStorage.getItem("kodarvia_reservas"); return raw ? JSON.parse(raw) : EJEMPLO; } catch { return EJEMPLO; } };
export const guardar = (rs: Reserva[]) => { localStorage.setItem("kodarvia_reservas", JSON.stringify(rs)); };
export function haySolape(reservas: Reserva[], fecha: string, tipo: Tipo, inicio: number, excluirId?: string): boolean {
  const dur = TIPOS[tipo].duracion; const finNuevo = inicio + dur;
  return reservas.some(r => { if (excluirId && r.id === excluirId) return false; if (r.fecha !== fecha) return false; const finExist = r.inicio + TIPOS[r.tipo].duracion; return inicio < finExist && finNuevo > r.inicio; });
}
