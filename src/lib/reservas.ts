export type Tipo = "grabacion" | "mezcla" | "master";

export interface Reserva {
  id: string;
  tipo: Tipo;
  fecha: string; // YYYY-MM-DD
  inicio: number; // hora
  cliente: string;
  email: string;
  telefono: string;
  proyecto?: string;
}

export const STORAGE_KEY = "kodarvia_reservas";
export const CLAVE = "admin123";

export const TIPOS: Record<Tipo, { nombre: string; duracion: number; bloques: number[] }> = {
  grabacion: { nombre: "Grabación", duracion: 3, bloques: [14, 17] },
  mezcla: { nombre: "Mezcla", duracion: 2, bloques: [14, 16, 18, 20] },
  master: { nombre: "Masterización", duracion: 1, bloques: [14, 15, 16, 17, 18, 19, 20, 21] },
};

export const fin = (r: Pick<Reserva, "tipo" | "inicio">) => r.inicio + TIPOS[r.tipo].duracion;

/** true si el bloque [inicio, inicio+dur) choca con alguna reserva del mismo día */
export function haySolape(
  reservas: Reserva[],
  fecha: string,
  tipo: Tipo,
  inicio: number,
  excluirId?: string,
): boolean {
  const f = inicio + TIPOS[tipo].duracion;
  return reservas.some(
    (r) => r.id !== excluirId && r.fecha === fecha && r.inicio < f && inicio < fin(r),
  );
}

export const EJEMPLO: Reserva[] = [
  { id: "ej1", tipo: "grabacion", fecha: "2026-11-10", inicio: 14, cliente: "Matías Rojas", email: "matias.rojas@gmail.com", telefono: "+56 9 8123 4567", proyecto: "Banda Los Búhos" },
  { id: "ej2", tipo: "mezcla", fecha: "2026-11-11", inicio: 16, cliente: "Javiera Muñoz", email: "javi.munoz@gmail.com", telefono: "+56 9 7234 5678", proyecto: "Podcast Historias" },
  { id: "ej3", tipo: "mezcla", fecha: "2026-11-12", inicio: 14, cliente: "Diego Fuentes", email: "diego.fuentes@outlook.cl", telefono: "+56 9 6345 6789", proyecto: "Single La Ruta" },
  { id: "ej4", tipo: "grabacion", fecha: "2026-11-12", inicio: 17, cliente: "Camila Soto", email: "camila.soto@gmail.com", telefono: "+56 9 5456 7890", proyecto: "EP Raíces" },
  { id: "ej5", tipo: "grabacion", fecha: "2026-11-13", inicio: 14, cliente: "Banda La Rota", email: "contacto@larota.cl", telefono: "+56 9 4567 8901", proyecto: "Disco en vivo" },
  { id: "ej6", tipo: "mezcla", fecha: "2026-11-14", inicio: 20, cliente: "Felipe Araya", email: "felipe.trap@gmail.com", telefono: "+56 9 3678 9012", proyecto: "Trap Santiago" },
];

export function cargar(): Reserva[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : null;
    if (Array.isArray(data) && data.length > 0) return data;
  } catch {}
  localStorage.setItem(STORAGE_KEY, JSON.stringify(EJEMPLO));
  return EJEMPLO;
}

export const guardar = (r: Reserva[]) => localStorage.setItem(STORAGE_KEY, JSON.stringify(r));

export const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export function iso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Lunes a sábado de la semana que contiene `base` */
export function semana(base: Date): Date[] {
  const d = new Date(base.getFullYear(), base.getMonth(), base.getDate());
  const offset = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - offset);
  return Array.from({ length: 6 }, (_, i) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + i));
}
