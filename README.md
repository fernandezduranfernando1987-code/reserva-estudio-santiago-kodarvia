# Reserva Estudio Santiago · Kodarvia

Sistema de reservas para un estudio de grabación independiente en Santiago, Chile. React + Tailwind + localStorage, sin backend.

**Preview:** https://screenshot-to-site-536.lovable.app

## 8 Criterios Kodarvia

1. Crear / Mover / Cancelar sin recargar
2. Anti-solape con `haySolape()`
3. Validación de campos obligatorios
4. `localStorage` key: `kodarvia_reservas`
5. Mobile first
6. Panel admin con clave: `admin123` (`const CLAVE` en `src/lib/reservas.ts`)
7. Carga < 3 s (sin imágenes, sin backend)
8. Este README

## Reglas

- Horario: lunes a sábado, 14:00 a 22:00.
- Grabación 3 h (14–17, 17–20) · Mezcla 2 h (14–16, 16–18, 18–20, 20–22) · Masterización 1 h (14–15 … 21–22).
- Ningún bloque puede solaparse con otro confirmado, aunque sea de otro tipo (`haySolape` en `src/lib/reservas.ts`).

## Funciones

- Crear, mover y cancelar reservas sin recargar (React `useState`).
- Formulario con nombre, email y teléfono obligatorios (alerta si falta alguno).
- Persistencia en `localStorage` con la clave `kodarvia_reservas`.
- Panel admin protegido con clave (por defecto `admin123`).
- 6 reservas de ejemplo (10 al 14 de noviembre de 2026) y botón "Reiniciar datos de ejemplo".
- Simulación de mensaje de WhatsApp al reservar.
- Mobile first, sin imágenes: carga liviana.

## Desarrollo

```bash
bun install
bun run dev
bunx vitest run   # pruebas de la lógica de solape
```
