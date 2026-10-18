import type { Block, Field, GlobalConfig } from 'payload'

import { brandOptions } from '@/lib/brands'

/** Where a section’s button or “Shop all” goes: a brand, optionally narrowed to one of its categories. */
const linkFields: Field = {
  type: 'row',
  fields: [
    {
      name: 'linkBrand',
      label: 'Links to',
      type: 'select',
      options: brandOptions,
      required: true,
      admin: { width: '50%' },
    },
    {
      name: 'linkCategory',
      label: 'Category (optional)',
      type: 'relationship',
      relationTo: 'categories',
      admin: { width: '50%' },
      filterOptions: ({ siblingData }) => {
        const brand = (siblingData as { linkBrand?: string } | undefined)?.linkBrand
        return brand ? { brand: { equals: brand } } : true
      },
    },
  ],
}

const Hero: Block = {
  slug: 'hero',
  labels: { singular: 'Big picture', plural: 'Big pictures' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'media',
          label: 'Picture or video',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'mobileMedia',
          label: 'Phone version (optional)',
          type: 'upload',
          relationTo: 'media',
          admin: { width: '50%', description: 'A tall picture looks best on phones.' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'title', type: 'text', localized: true, admin: { width: '50%' } },
        {
          name: 'logo',
          label: 'Show a logo above the title',
          type: 'select',
          options: [{ label: 'No logo', value: 'none' }, ...brandOptions],
          defaultValue: 'none',
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'buttonLabel',
          type: 'text',
          localized: true,
          admin: { width: '50%', description: 'Leave empty for “Shop Now”.' },
        },
        {
          name: 'hideButton',
          type: 'checkbox',
          defaultValue: false,
          admin: { width: '50%', style: { alignSelf: 'center' } },
        },
      ],
    },
    linkFields,
  ],
}

const ProductRow: Block = {
  slug: 'products',
  labels: { singular: 'Product row', plural: 'Product rows' },
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'brand',
          type: 'select',
          options: brandOptions,
          required: true,
          admin: { width: '33%' },
        },
        {
          name: 'show',
          type: 'select',
          defaultValue: 'featured',
          required: true,
          options: [
            { label: 'Featured products', value: 'featured' },
            { label: 'Newest products', value: 'newest' },
            { label: 'One category', value: 'category' },
          ],
          admin: { width: '33%' },
        },
        {
          name: 'limit',
          label: 'How many',
          type: 'number',
          defaultValue: 8,
          min: 1,
          max: 24,
          admin: { width: '33%' },
        },
      ],
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: { condition: (_, sibling) => sibling?.show === 'category' },
      filterOptions: ({ siblingData }) => {
        const brand = (siblingData as { brand?: string } | undefined)?.brand
        return brand ? { brand: { equals: brand } } : true
      },
    },
  ],
}

const Statement: Block = {
  slug: 'statement',
  labels: { singular: 'Big words', plural: 'Big words' },
  fields: [
    {
      name: 'text',
      type: 'text',
      localized: true,
      required: true,
      admin: {
        description: 'A few short words, e.g. “Best selling pieces”. Each word gets its own line.',
      },
    },
    {
      type: 'row',
      fields: [
        { name: 'subtitle', type: 'text', localized: true, admin: { width: '50%' } },
        {
          name: 'linkLabel',
          type: 'text',
          localized: true,
          admin: { width: '50%', description: 'Leave empty for “Shop now”.' },
        },
      ],
    },
    linkFields,
  ],
}

const CategoryTiles: Block = {
  slug: 'categories',
  labels: { singular: 'Category tiles', plural: 'Category tiles' },
  fields: [
    { name: 'title', type: 'text', localized: true },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      required: true,
      admin: { description: 'Each category uses the picture set on the category itself.' },
    },
  ],
}

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Home page',
  admin: {
    group: 'Shop',
    description: 'Build the home page from sections. Drag them to change the order.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'sections',
      type: 'blocks',
      blocks: [Hero, ProductRow, Statement, CategoryTiles],
    },
  ],
}
