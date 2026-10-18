import type { CollectionConfig } from 'payload'

import { brandOptions } from '@/lib/brands'
import { slugField } from '@/lib/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'brand', 'sortOrder'],
    group: 'Shop',
    description: 'Groups shown as filters on each brand page, e.g. “Kaftans” or “Leggings”.',
  },
  defaultSort: 'sortOrder',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'brand',
      type: 'select',
      options: brandOptions,
      required: true,
      index: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Shown on category tiles on the home page.' },
    },
    slugField(),
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers are shown first.' },
    },
  ],
}
