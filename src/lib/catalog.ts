import type { Where } from 'payload'

import type { Brand } from './brands'
import type { Locale } from './i18n'
import { getPayloadClient } from './payload'

export async function findProducts(
  lang: Locale,
  {
    brand,
    category,
    featured,
    limit = 48,
    exclude,
  }: {
    brand?: Brand
    category?: number
    featured?: boolean
    limit?: number
    exclude?: number
  } = {},
) {
  const and: Where[] = [{ status: { equals: 'active' } }]
  if (brand) and.push({ brand: { equals: brand } })
  if (category) and.push({ category: { equals: category } })
  if (featured) and.push({ featured: { equals: true } })
  if (exclude) and.push({ id: { not_equals: exclude } })

  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    where: { and },
    locale: lang,
    depth: 1,
    limit,
    sort: '-createdAt',
    overrideAccess: false,
  })
  return docs
}
