import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ProductGrid } from '@/components/ProductCard'
import { Wordmark } from '@/components/Wordmark'
import type { Brand } from '@/lib/brands'
import { findProducts } from '@/lib/catalog'
import { getDictionary, isLocale } from '@/lib/i18n'
import { imageUrl } from '@/lib/media'
import { getPayloadClient } from '@/lib/payload'

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = getDictionary(lang)

  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'settings', locale: lang, depth: 1 })

  const sections = await Promise.all(
    (['forme', 'siena'] as Brand[]).map(async (brand) => {
      const featured = await findProducts(lang, { brand, featured: true, limit: 4 })
      return {
        brand,
        products: featured.length ? featured : await findProducts(lang, { brand, limit: 4 }),
      }
    }),
  )

  const panels = [
    {
      brand: 'forme' as const,
      image: imageUrl(settings.formeHero, 'large'),
      line: settings.formeTagline || t.formeLine,
    },
    {
      brand: 'siena' as const,
      image: imageUrl(settings.sienaHero, 'large'),
      line: settings.sienaTagline || t.sienaLine,
    },
  ]

  return (
    <>
      <section className="split">
        {panels.map((panel) => (
          <Link
            key={panel.brand}
            href={`/${lang}/${panel.brand}`}
            className={`split__panel split__panel--${panel.brand}`}
          >
            {panel.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={panel.image} alt="" className="split__img" />
            )}
            <div className="split__content">
              <Wordmark brand={panel.brand} className="split__mark" />
              <span className="split__line">{panel.line}</span>
              <span className="split__cta">{t.shop}</span>
            </div>
          </Link>
        ))}
      </section>

      {sections.map(({ brand, products }) => (
        <section key={brand} className="section" data-section={brand}>
          <div className="section__head">
            <div>
              <span className="eyebrow">{t.newIn}</span>
              <Wordmark brand={brand} className="section__mark" />
            </div>
            <Link href={`/${lang}/${brand}`} className="underline">
              {t.shopAll}
            </Link>
          </div>
          <ProductGrid products={products} lang={lang} t={t} />
        </section>
      ))}
    </>
  )
}
