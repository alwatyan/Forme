import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ProductGrid } from '@/components/ProductCard'
import { getDictionary, isLocale } from '@/lib/i18n'
import { getPayloadClient } from '@/lib/payload'

type Props = { params: Promise<{ lang: string }>; searchParams: Promise<{ q?: string }> }

export const metadata: Metadata = { title: 'Search', robots: { index: false } }

export default async function SearchPage({ params, searchParams }: Props) {
  const { lang } = await params
  const q = (await searchParams).q?.trim().slice(0, 80) ?? ''
  if (!isLocale(lang)) notFound()
  const t = getDictionary(lang)

  const payload = await getPayloadClient()
  const products = q
    ? (
        await payload.find({
          collection: 'products',
          where: { and: [{ status: { equals: 'active' } }, { name: { like: q } }] },
          locale: lang,
          depth: 1,
          limit: 48,
          overrideAccess: false,
        })
      ).docs
    : []

  return (
    <section className="section">
      <form action={`/${lang}/search`} className="search-page__form">
        <input
          name="q"
          type="search"
          defaultValue={q}
          placeholder={t.searchPlaceholder}
          aria-label={t.search}
        />
      </form>
      {q && (
        <p className="eyebrow search-page__count">
          {products.length} {t.results} “{q}”
        </p>
      )}
      {q &&
        (products.length ? (
          <ProductGrid products={products} lang={lang} t={t} />
        ) : (
          <p className="empty">{t.noResults}</p>
        ))}
    </section>
  )
}
