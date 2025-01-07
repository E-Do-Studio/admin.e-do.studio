import type { CollectionConfig } from 'payload'
import type { Media } from '../payload-types'

export const Categories: CollectionConfig = {
  slug: 'categories',
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
      name: 'subCategories',
      type: 'relationship',
      relationTo: 'sub_categories',
      hasMany: true,
      admin: {
        description: 'Sous-catégories associées',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
