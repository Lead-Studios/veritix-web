import { AppImage } from '@/components/shared/AppImage'

interface EventImageProps {
  src?: string | null
  alt: string
  borderColor?: string
}

export const EventImage = ({ src, alt, borderColor = 'border-[#4D21FF]' }: EventImageProps) => (
  <div className={`relative h-22 w-full rounded-lg overflow-hidden border ${borderColor} bg-[#1a1f3a]`}>
    <AppImage
      src={src || '/placeholder-event.svg'}
      alt={alt}
      fill
      className="object-cover opacity-90 hover:opacity-100 transition-opacity"
      sizes="(max-width: 768px) 50vw, 33vw"
      fallback="/placeholder-event.svg"
    />
  </div>
)
