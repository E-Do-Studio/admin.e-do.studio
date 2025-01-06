import { ImageCell } from '@/components/ImageField/Cell'
import type { Access, CollectionConfig, CollectionSlug, CustomComponent } from 'payload'
import type { Media } from '../payload-types'

interface CycloramaType {
  id: string
  image: Media[]
}

export const Cyclorama: CollectionConfig = {
  slug: 'cyclorama',
  labels: {
    singular: 'Cyclorama',
    plural: 'Cyclorama',
  },
  access: {
    read: (() => true) as Access,
  },
  hooks: {
    afterRead: [
      ({ doc }) => {
        if (doc.image && Array.isArray(doc.image)) {
          return {
            ...doc,
            image: doc.image.map((img: Media | string) => {
              if (typeof img === 'object' && 'url' in img) {
                return img.url
              }
              return img
            }),
          }
        }
        return doc
      },
    ],
    afterChange: [
      async ({ doc, req }) => {
        if (doc.image && Array.isArray(doc.image)) {
          for (const img of doc.image) {
            const imageId = typeof img === 'string' ? img : img.id
            await req.payload.update({
              collection: 'media',
              id: imageId,
              data: {
                isAssigned: true,
              },
            })
          }
        }
      },
    ],
    beforeDelete: [
      async ({ req, id }) => {
        try {
          const cyclorama = (await req.payload.findByID({
            collection: 'cyclorama' as CollectionSlug,
            id,
            depth: 0,
          })) as unknown as CycloramaType

          if (cyclorama?.image && Array.isArray(cyclorama.image)) {
            for (const img of cyclorama.image) {
              const imageId = typeof img === 'string' ? img : (img as Media).id

              await req.payload.update({
                collection: 'media',
                id: imageId,
                data: {
                  isAssigned: false,
                },
              })
            }
          }
        } catch (error) {
          console.error('Erreur lors de la suppression:', error)
        }
      },
    ],
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      required: true,
      admin: {
        components: {
          Cell: ImageCell as unknown as CustomComponent,
        },
        description: 'Select or upload an image',
      },
    },
  ],
}
