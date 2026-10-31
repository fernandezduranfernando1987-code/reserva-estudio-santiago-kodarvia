
## Funcionalidades
- Reserva de salas por fecha y hora
- Validación de disponibilidad en tiempo real
- Panel de administración en /admin
- Gestión de bloqueos horarios

## Datos Importantes

**Almacenamiento:**
- Reservas: `kodarvia_reservas`
- Bloqueos: `kodarvia_bloqueos`

**Admin:**
- Ruta: `/admin`
- Archivo: `src/routes/admin.tsx`
- Clave: `admin123`
- Componente Route: `export const Route = createFileRoute('/admin')`

## Estructura
- `src/routes/admin.tsx` - Panel admin
- `src/components/BloqueosAdmin.tsx` - Bloqueos
