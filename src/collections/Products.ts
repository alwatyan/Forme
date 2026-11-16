import type { CollectionConfig } from 'payload'

import { brandOptions } from '@/lib/brands'
import { slugField } from '@/lib/slug'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'brand', 'category', 'price', 'status'],
    group: 'Shop',
    listSearchableFields: ['name', 'slug'],
  },
  defaultSort: '-createdAt',
  access: {
    // Visitors only see products marked as active; signed-in staff see everything.
    read: ({ req: { user } }) => (user ? true : { status: { equals: 'active' } }),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Details',
          fields: [
            {
              name: 'name',
              type: 'text',
              localized: true,
              required: true,
            },
            {
              name: 'subtitle',
              type: 'text',
              localized: true,
              admin: {
                description: 'Optional. A short line under the name, e.g. “Straight Leggings”.',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              localized: true,
              admin: { rows: 6 },
            },
            {
              name: 'details',
              label: 'Fabric & care',
              type: 'textarea',
              localized: true,
              admin: { rows: 4 },
            },
          ],
        },
        {
          label: 'Pictures',
          fields: [
            {
              name: 'images',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              required: true,
              minRows: 1,
              admin: {
                description:
                  'The first picture is the main one. The second is shown when shoppers hover over the product.',
              },
            },
          ],
        },
        {
          label: 'Sizes & stock',
          fields: [
            {
              name: 'sizes',
              type: 'array',
              required: true,
              minRows: 1,
              labels: { singular: 'Size', plural: 'Sizes' },
              admin: {
                description:
                  'Add each size you sell and how many pieces you have. Use “One size” if there is only one.',
                initCollapsed: false,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'size', type: 'text', required: true, admin: { width: '50%' } },
                    {
                      name: 'stock',
                      type: 'number',
                      required: true,
                      defaultValue: 0,
                      min: 0,
                      admin: { width: '50%', step: 1 },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'brand',
      type: 'select',
      options: brandOptions,
      required: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: { position: 'sidebar' },
      filterOptions: ({ data }) => (data?.brand ? { brand: { equals: data.brand } } : true),
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      admin: { position: 'sidebar', step: 0.5, description: 'In Kuwaiti dinar (KWD).' },
    },
    {
      name: 'compareAtPrice',
      label: 'Original price',
      type: 'number',
      min: 0,
      admin: {
        position: 'sidebar',
        description: 'Optional. Shown crossed out when the item is on sale.',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      required: true,
      index: true,
      options: [
        { label: 'Active — visible in the shop', value: 'active' },
        { label: 'Hidden', value: 'hidden' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Show on the home page.' },
    },
    slugField(),
  ],
}
