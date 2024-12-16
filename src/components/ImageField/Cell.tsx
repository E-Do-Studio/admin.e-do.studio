import React from 'react'
import Image from 'next/image'
import { Media } from '@/payload-types'

// Définissons le type correct pour les props de la cellule
type CustomCellProps = {
  field: {
    name: string
  }
  data: {
    image: Media
  }
}

export const ImageCell: React.FC<CustomCellProps> = ({ data }) => {
  const media = data?.image

  if (!media?.filename) return null

  return (
    <div style={{ width: '100%', height: '100%', padding: '5px' }}>
      <Image
        src={`/media/${media.filename}`}
        alt={media.filename || 'Gallery image'}
        width={40}
        height={40}
        style={{
          width: '100%',
          height: '40px',
          objectFit: 'contain',
        }}
        priority
      />
    </div>
  )
}
