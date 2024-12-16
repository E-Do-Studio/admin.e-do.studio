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
  ],
}
