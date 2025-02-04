import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: {
    staticDir: 'media',
    formatOptions: {
      format: 'webp',
      options: {
        quality: 80,
        lossless: false,
      },
    },
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'center',
        formatOptions: {
          format: 'webp',
          options: {
            quality: 70,
            lossless: false,
          },
        },
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'center',
        formatOptions: {
          format: 'webp',
          options: {
            quality: 80,
            lossless: false,
          },
        },
      },
    ],
    resizeOptions: {
      width: undefined,
      height: undefined,
      fit: 'cover',
      withoutEnlargement: true,
    },
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'video/mp4', 'video/webm', 'video/ogg'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: "Alt text pour l'image ou description de la vidéo",
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
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
        description: 'Media utilisé dans la galerie',
      },
      label: 'Assigned',
    },
  ],
}
