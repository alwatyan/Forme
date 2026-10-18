import type { CollectionConfig } from 'payload'

const staffOnly = ({ req: { user } }: { req: { user: unknown } }) => Boolean(user)

/** Emails collected by “Join the list”. Export them from the list view to use in your mailing tool. */
export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'locale', 'createdAt'],
    group: 'Shop',
    description: 'People who joined the list on the website.',
  },
  defaultSort: '-createdAt',
  access: {
    create: staffOnly,
    read: staffOnly,
    update: staffOnly,
    delete: staffOnly,
  },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true },
    { name: 'locale', type: 'text', admin: { readOnly: true } },
  ],
}
