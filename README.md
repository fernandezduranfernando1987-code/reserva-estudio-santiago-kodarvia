# Sistema de Reservas Estudio de Grabación

Proyecto con TanStack Router + React + Bun.

## Cómo correr en local

1. bun install

2. bun run dev

Abrir http://localhost:5173

## Cómo reiniciar datos de ejemplo

En la página principal abajo hay un botón "Reiniciar datos de ejemplo" que restaura las reservas de localStorage. También se puede borrar localStorage desde DevTools > Application > Local Storage.

## Cómo modificar la clave de admin

La clave está en src/routes/admin.tsx en la constante ADMIN_PASSWORD. Cambiar el valor por defecto 'admin123' por la que quieras.

## Rutas

/ -> página principal de reservas

/admin -> panel de administración (requiere clave)

## Stack

Bun, TanStack Router, Tailwind, localStorage.
