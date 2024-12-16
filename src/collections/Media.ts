import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: {
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'center',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'center',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: "Alt text pour l'image",
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            // Génère automatiquement l'alt à partir du nom du fichier
            if (data?.filename) {
              const nameWithoutExtension = data.filename.split('.').slice(0, -1).join('.')
              return nameWithoutExtension.replace(/[-_]/g, ' ')
            }
            return data?.alt
          },
        ],
      },
    },
    {
      name: 'isAssigned',
      type: 'checkbox',
      admin: {
        readOnly: true,
        description: 'Image utilisée dans la galerie',
      },
      label: 'Assigned',
    },
  ],
}
