import type { CollectionConfig } from 'payload'

export const SubCategories: CollectionConfig = {
  slug: 'sub_categories',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Image de la sous-catégorie',
      },
    },
  ],
  hooks: {
    afterRead: [
      async ({ doc, req }) => {
        if (doc.image && typeof doc.image === 'string') {
          const payload = req.payload
          const image = await payload.findByID({
            collection: 'media',
            id: doc.image,
          })
          return {
            ...doc,
            image,
          }
        }
        return doc
      },
    ],
  },
}
