import { MapPin, Clock3, Instagram, Facebook, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function InformacionEstudio() {
  return <section aria-labelledby="info-estudio" className="space-y-5 border-t border-border pt-7">
    <h2 id="info-estudio" className="text-3xl tracking-normal">Información del Estudio</h2>
    <div className="grid gap-6 sm:grid-cols-2">
      <div><h3 className="flex items-center gap-2 font-sans text-base font-semibold"><MapPin className="size-4 text-primary" />Dirección</h3><p className="mt-2 text-sm text-muted-foreground">Plaza de Armas, Santiago de Chile</p><p className="mt-1 text-xs text-muted-foreground">Ubicación de ejemplo</p></div>
      <div><h3 className="flex items-center gap-2 font-sans text-base font-semibold"><Clock3 className="size-4 text-primary" />Horarios de atención</h3><p className="mt-2 text-sm text-muted-foreground">Lunes a Viernes 10:00-20:00</p><p className="mt-1 text-sm text-muted-foreground">Sábado 11:00-18:00</p></div>
    </div>
    <iframe title="Google Maps: Plaza de Armas, Santiago de Chile" src="https://maps.google.com/maps?q=Plaza%20de%20Armas%2C%20Santiago%20de%20Chile&z=15&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-64 w-full rounded-lg border border-border sm:h-72" allowFullScreen />
    <nav aria-label="Redes sociales del estudio" className="flex flex-wrap gap-3">
      <Button asChild variant="outline"><a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"><Instagram />Instagram</a></Button>
      <Button asChild variant="outline"><a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer"><Facebook />Facebook</a></Button>
      <Button asChild variant="outline"><a href="https://wa.me/" target="_blank" rel="noopener noreferrer"><MessageCircle />WhatsApp</a></Button>
    </nav>
  </section>
}