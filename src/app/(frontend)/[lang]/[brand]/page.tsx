import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ProductGrid } from '@/components/ProductCard'
import { Wordmark } from '@/components/Wordmark'
import { brandNames, isBrand } from '@/lib/brands'
import { findProducts } from '@/lib/catalog'
import { getDictionary, isLocale } from '@/lib/i18n'
import { getPayloadClient } from '@/lib/payload'

type Props = {
  params: Promise<{ lang: string; brand: string }>
  searchParams: Promise<{ category?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand } = await params
  return { title: isBrand(brand) ? brandNames[brand] : undefined }
}

export default async function BrandPage({ params, searchParams }: Props) {
  const { lang, brand } = await params
  const { category: categorySlug } = await searchParams
  if (!isLocale(lang) || !isBrand(brand)) notFound()
  const t = getDictionary(lang)

  const payload = await getPayloadClient()
  const [{ docs: categories }, settings] = await Promise.all([
    payload.find({
      collection: 'categories',
      where: { brand: { equals: brand } },
      locale: lang,
      sort: 'sortOrder',
      limit: 50,
      depth: 0,
    }),
    payload.findGlobal({ slug: 'settings', locale: lang, depth: 0 }),
  ])
  const active = categories.find((c) => c.slug === categorySlug)
  const products = await findProducts(lang, { brand, category: active?.id })
  const tagline =
    (brand === 'forme' ? settings.formeTagline : settings.sienaTagline) ||
    (brand === 'forme' ? t.formeLine : t.sienaLine)

  return (
    <>
      <section className="banner">
        <Wordmark brand={brand} className="banner__mark" />
        <p className="banner__line">{tagline}</p>
      </section>

      <section className="section section--tight">
        {categories.length > 0 && (
          <nav className="chips" aria-label="Categories">
            <Link href={`/${lang}/${brand}`} className={`chip ${!active ? 'chip--active' : ''}`}>
              {t.all}
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/${lang}/${brand}?category=${c.slug}`}
                className={`chip ${active?.id === c.id ? 'chip--active' : ''}`}
              >
                {c.name}
              </Link>
            ))}
          </nav>
        )}
        <ProductGrid products={products} lang={lang} t={t} />
      </section>
    </>
  )
}
