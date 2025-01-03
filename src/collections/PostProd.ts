import { ImageCell } from '@/components/ImageField/Cell'
import type { CollectionConfig, CollectionSlug, CustomComponent } from 'payload'
import type { Media } from '../payload-types'

interface PostProdType {
  id: string
  image: string | Media
}

export const PostProd: CollectionConfig = {
  slug: 'post-prod',
  labels: {
    singular: 'Post-Prod',
    plural: 'Post-Prod',
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
          const postProd = (await req.payload.findByID({
            collection: 'post-prod' as CollectionSlug,
            id,
            depth: 0,
          })) as PostProdType

          if (postProd?.image) {
            const imageId =
              typeof postProd.image === 'string' ? postProd.image : (postProd.image as Media).id

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
      type: 'select',
      options: ['on model', 'flat', 'glasses', 'ghost', 'access / shoes', 'jewellery'],
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
