# Reserva Estudio Santiago - Kodarvia
Sistema para estudio de grabacion independiente en Santiago, Chile.

Preview: https://screenshot-to-site-536.lovable.app
Stack: Vite + React + TanStack Router + Tailwind + bun

Para correr:
bun install
bun run dev

Archivos reales:
- src/routes/index.tsx (CLAVE = "admin123")
- src/routes/admin.tsx (ruta /admin con bloqueo manual)
- src/lib/reservas.ts (haySolape, cargar, guardar)

Cumple feedback:
- Footer con direccion Av Providencia 1208, mapa Google, horarios 14-22 y redes
- Admin en /admin con mensaje "No hay reservas agendadas aun"
- Telefono solo numeros
