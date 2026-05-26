'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'

interface AppImageProps extends Omit<ImageProps, 'onError'> {
  fallback?: string
}

export function AppImage({ fallback = '/placeholder-event.svg', src, alt, ...props }: AppImageProps) {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(fallback)}
    />
  )
}
