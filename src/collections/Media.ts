import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Shop',
    description: 'Pictures and short videos (MP4) used on the site.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      admin: {
        description: 'A short description of the picture, for accessibility and search engines.',
      },
    },
  ],
  upload: {
    mimeTypes: ['image/*', 'video/mp4', 'video/webm'],
    focalPoint: true,
    imageSizes: [
      { name: 'thumbnail', width: 400 },
      { name: 'card', width: 900 },
      { name: 'large', width: 1800 },
    ],
    adminThumbnail: 'thumbnail',
  },
}
