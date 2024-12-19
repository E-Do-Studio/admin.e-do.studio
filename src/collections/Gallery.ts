import type { CollectionConfig, CustomComponent } from 'payload'
import type { Media } from '../payload-types'
import { ImageCell } from '@/components/ImageField/Cell'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  labels: {
    singular: 'Gallery',
    plural: 'Gallery',
  },
  admin: {
    useAsTitle: 'brand',
    defaultColumns: ['image', 'name', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        if (doc.image) {
          const imageId = typeof doc.image === 'string' ? doc.image : doc.image.id
          await req.payload.update({
            collection: 'media',
            id: imageId,
            data: {
              isAssigned: true,
            },
          })
        }
      },
    ],
    beforeDelete: [
      async ({ req, id }) => {
        try {
          const gallery = await req.payload.findByID({
            collection: 'gallery',
            id,
            depth: 0,
          })

          if (gallery?.image) {
            const imageId =
              typeof gallery.image === 'string' ? gallery.image : (gallery.image as Media).id

            await req.payload.update({
              collection: 'media',
              id: imageId,
              data: {
                isAssigned: false,
              },
            })
          }
        } catch (error) {
          console.error('Erreur lors de la suppression:', error)
        }
      },
    ],
  },
  fields: [
    {
      name: 'brand',
      type: 'relationship',
      index: true,
      relationTo: 'brands',
      required: true,
      hasMany: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        components: {
          Cell: ImageCell as unknown as CustomComponent,
        },
        description: 'Select or upload an image',
      },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      label: 'Category',
      hasMany: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sub_categories',
      type: 'relationship',
      relationTo: 'sub_categories',
      hasMany: false,
      label: 'Sub Category',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
