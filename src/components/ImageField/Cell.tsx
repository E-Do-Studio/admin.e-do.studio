import React from 'react'
import { Media } from '@/payload-types'
import Image from 'next/image'
type CustomCellProps = {
  field: {
    name: string
  }
  cellData: Media
  rowData: {
    image: Media
  }
}

export const ImageCell: React.FC<CustomCellProps> = (props) => {
  const media = props.cellData

  if (!media?.thumbnailURL) return null

  return (
    <div className="flex items-center justify-center w-[100px] h-[100px]">
      <Image
        src={media.thumbnailURL}
        alt={media.alt || media.filename || 'Gallery image'}
        className="object-contain"
        width={80}
        height={80}
      />
    </div>
  )
}
