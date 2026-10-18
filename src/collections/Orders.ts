import type { CollectionConfig } from 'payload'

const staffOnly = ({ req: { user } }: { req: { user: unknown } }) => Boolean(user)

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'status', 'total', 'createdAt'],
    group: 'Shop',
  },
  defaultSort: '-createdAt',
  // Orders are created by the checkout on the server; only staff can read or edit them.
  access: {
    create: staffOnly,
    read: staffOnly,
    update: staffOnly,
    delete: staffOnly,
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      admin: { readOnly: true },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      index: true,
      options: [
        { label: 'Awaiting payment', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'customer',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'phone', type: 'text', required: true },
            { name: 'email', type: 'email' },
          ],
        },
      ],
    },
    {
      name: 'shippingAddress',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'area', type: 'text', required: true },
            { name: 'block', type: 'text', required: true },
            { name: 'street', type: 'text', required: true },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'avenue', type: 'text' },
            { name: 'building', label: 'House / building', type: 'text', required: true },
            { name: 'apartment', label: 'Floor / apartment', type: 'text' },
          ],
        },
        { name: 'notes', type: 'textarea' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      admin: { readOnly: true },
      fields: [
        { name: 'product', type: 'relationship', relationTo: 'products' },
        {
          type: 'row',
          fields: [
            { name: 'productName', type: 'text', required: true },
            { name: 'size', type: 'text', required: true },
            { name: 'quantity', type: 'number', required: true },
            { name: 'unitPrice', type: 'number', required: true },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'subtotal', type: 'number', required: true, admin: { readOnly: true } },
        { name: 'shippingFee', type: 'number', required: true, admin: { readOnly: true } },
        { name: 'total', type: 'number', required: true, admin: { readOnly: true } },
      ],
    },
    {
      name: 'currency',
      type: 'text',
      defaultValue: 'KWD',
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'payment',
      type: 'group',
      admin: { readOnly: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'invoiceId', type: 'text', index: true },
            { name: 'paymentId', type: 'text' },
            { name: 'gateway', type: 'text' },
          ],
        },
        { name: 'invoiceURL', type: 'text' },
        { name: 'paidAt', type: 'date' },
      ],
    },
    {
      name: 'locale',
      type: 'text',
      defaultValue: 'en',
      admin: { hidden: true },
    },
    {
      name: 'accessToken',
      type: 'text',
      admin: { hidden: true },
    },
    {
      name: 'stockDeducted',
      type: 'checkbox',
      defaultValue: false,
      admin: { hidden: true },
    },
  ],
}
