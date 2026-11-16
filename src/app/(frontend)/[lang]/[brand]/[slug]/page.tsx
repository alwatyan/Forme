import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import { AddToBag } from '@/components/AddToBag'
import { Price } from '@/components/Price'
import { ProductGrid } from '@/components/ProductCard'
import { isBrand } from '@/lib/brands'
import { findProducts } from '@/lib/catalog'
import { getDictionary, isLocale, type Locale } from '@/lib/i18n'
import { asMedia, imageUrl } from '@/lib/media'
import { getPayloadClient } from '@/lib/payload'

type Props = { params: Promise<{ lang: string; brand: string; slug: string }> }

const getProduct = cache(async (lang: Locale, brand: string, slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    where: {
      and: [
        { slug: { equals: decodeURIComponent(slug) } },
        { brand: { equals: brand } },
        { status: { equals: 'active' } },
      ],
    },
    locale: lang,
    depth: 1,
    limit: 1,
    overrideAccess: false,
  })
  return docs[0] ?? null
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, brand, slug } = await params
  if (!isLocale(lang)) return {}
  const product = await getProduct(lang, brand, slug)
  if (!product) return {}
  const image = imageUrl(product.images?.[0], 'large')
  return {
    title: product.name,
    description: product.description?.slice(0, 160),
    openGraph: image ? { images: [image] } : undefined,
  }
}

export default async function ProductPage({ params }: Props) {
  const { lang, brand, slug } = await params
  if (!isLocale(lang) || !isBrand(brand)) notFound()
  const t = getDictionary(lang)

  const product = await getProduct(lang, brand, slug)
  if (!product) notFound()

  const images = (product.images ?? []).map(asMedia).filter((m) => m !== null)
  const related = await findProducts(lang, { brand, limit: 4, exclude: product.id })

  return (
    <>
      <section className="product">
        <div className="gallery">
          {images.map((img, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={img.id}
              src={imageUrl(img, 'large') ?? ''}
              alt={img.alt || product.name}
              loading={i === 0 ? 'eager' : 'lazy'}
              className="gallery__img"
            />
          ))}
        </div>

        <div className="product__info">
          <div className="product__sticky">
            <h1 className="product__name">{product.name}</h1>
            {product.subtitle ? <p className="product__subtitle">{product.subtitle}</p> : null}
            <Price price={product.price} compareAt={product.compareAtPrice} lang={lang} />

            <AddToBag
              productId={product.id}
              slug={product.slug ?? ''}
              brand={product.brand}
              name={product.name}
              price={product.price}
              image={imageUrl(images[0], 'thumbnail')}
              sizes={product.sizes.map((s) => ({ size: s.size, stock: s.stock }))}
            />

            <div className="accordion">
              {product.description && (
                <details open>
                  <summary>{t.description}</summary>
                  <p className="prose">{product.description}</p>
                </details>
              )}
              {product.details && (
                <details>
                  <summary>{t.fabricCare}</summary>
                  <p className="prose">{product.details}</p>
                </details>
              )}
              <details>
                <summary>{t.deliveryReturns}</summary>
                <p className="prose">{t.deliveryText}</p>
              </details>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section">
          <div className="section__head">
            <span className="eyebrow">{t.youMayLike}</span>
          </div>
          <ProductGrid products={related} lang={lang} t={t} />
        </section>
      )}
    </>
  )
}
