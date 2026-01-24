import Image from 'next/image'

interface EventImageProps {
  src: string
  alt: string
  borderColor: string
}

export const EventImage = ({ src, alt, borderColor }: EventImageProps) => (
  <div className={`relative h-22 w-full rounded-lg overflow-hidden border ${borderColor}`}>
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover opacity-90 hover:opacity-100 transition-opacity"
      sizes="(max-width: 768px) 50vw, 33vw"
    />
  </div>
)

