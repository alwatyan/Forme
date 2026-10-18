import type { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Store settings',
  admin: { group: 'Admin' },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Announcements & brands',
          fields: [
            {
              name: 'announcements',
              type: 'array',
              labels: { singular: 'Message', plural: 'Messages' },
              admin: {
                description:
                  'Messages in the black bar at the top of every page. Shoppers can flip through them with the arrows.',
              },
              fields: [{ name: 'text', type: 'text', localized: true, required: true }],
            },
            {
              type: 'row',
              fields: [
                { name: 'formeTagline', label: 'Formé tagline', type: 'text', localized: true },
                { name: 'sienaTagline', label: 'Siena tagline', type: 'text', localized: true },
              ],
            },
          ],
        },
        {
          label: 'Delivery',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'shippingFee',
                  label: 'Delivery fee (KWD)',
                  type: 'number',
                  defaultValue: 2,
                  min: 0,
                  required: true,
                },
                {
                  name: 'freeShippingThreshold',
                  label: 'Free delivery from (KWD)',
                  type: 'number',
                  min: 0,
                  admin: { description: 'Leave empty to always charge delivery.' },
                },
              ],
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            {
              name: 'whatsapp',
              type: 'text',
              admin: { description: 'International format, e.g. 96512345678' },
            },
            { name: 'email', type: 'email' },
            {
              type: 'row',
              fields: [
                { name: 'formeInstagram', label: 'Formé Instagram link', type: 'text' },
                { name: 'sienaInstagram', label: 'Siena Instagram link', type: 'text' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
