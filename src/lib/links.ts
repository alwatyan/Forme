import type { Category } from '@/payload-types'

import type { Locale } from './i18n'

/** A link to a brand page, optionally filtered to one of its categories. */
export function brandHref(lang: Locale, brand: string, category?: number | Category | null) {
  const slug = category && typeof category === 'object' ? category.slug : null
  return `/${lang}/${brand}${slug ? `?category=${encodeURIComponent(slug)}` : ''}`
}
