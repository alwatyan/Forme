import Link from 'next/link'

import type { Dictionary, Locale } from '@/lib/i18n'
import { imageUrl } from '@/lib/media'
import type { Product } from '@/payload-types'

import { Price } from './Price'
import { QuickAdd } from './QuickAdd'

export function ProductCard({
  product,
  lang,
  t,
}: {
  product: Product
  lang: Locale
  t: Dictionary
}) {
  const [first, second] = product.images ?? []
  const primary = imageUrl(first)
  const hover = imageUrl(second)
  const soldOut = !product.sizes?.some((s) => s.stock > 0)
  const onSale = product.compareAtPrice != null && product.compareAtPrice > product.price
  const href = `/${lang}/${product.brand}/${product.slug}`

  return (
    <div className="card">
      <div className="card__media">
        <Link href={href} className="card__link" aria-label={product.name}>
          {primary ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={primary} alt={product.name} loading="lazy" className="card__img" />
          ) : (
            <div className="card__placeholder" />
          )}
          {hover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={hover} alt="" loading="lazy" className="card__img card__img--hover" />
          )}
        </Link>
        {soldOut ? (
          <span className="badge">{t.soldOut}</span>
        ) : (
          <>
            {onSale && <span className="badge">{t.sale}</span>}
            <QuickAdd
              productId={product.id}
              slug={product.slug ?? ''}
              brand={product.brand}
              name={product.name}
              price={product.price}
              image={imageUrl(first, 'thumbnail')}
              sizes={product.sizes.map((s) => ({ size: s.size, stock: s.stock }))}
            />
          </>
        )}
      </div>
      <Link href={href} className="card__body">
        <span className="card__name">{product.name}</span>
        {product.subtitle ? <span className="card__subtitle">{product.subtitle}</span> : null}
        <Price price={product.price} compareAt={product.compareAtPrice} lang={lang} />
      </Link>
    </div>
  )
}

export function ProductGrid({
  products,
  lang,
  t,
}: {
  products: Product[]
  lang: Locale
  t: Dictionary
}) {
  if (!products.length) return <p className="empty">{t.noProducts}</p>
  return (
    <div className="grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} lang={lang} t={t} />
      ))}
    </div>
  )
}

/** A row of products that scrolls sideways, with the next card peeking in. */
export function ProductRail({
  products,
  lang,
  t,
}: {
  products: Product[]
  lang: Locale
  t: Dictionary
}) {
  if (!products.length) return <p className="empty">{t.noProducts}</p>
  return (
    <div className="rail">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} lang={lang} t={t} />
      ))}
    </div>
  )
}
