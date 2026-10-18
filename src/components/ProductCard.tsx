import Link from 'next/link'

import type { Locale, Dictionary } from '@/lib/i18n'
import { imageUrl } from '@/lib/media'
import type { Product } from '@/payload-types'

import { Price } from './Price'

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

  return (
    <Link href={`/${lang}/${product.brand}/${product.slug}`} className="card">
      <div className="card__media">
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
        {soldOut ? (
          <span className="badge">{t.soldOut}</span>
        ) : (
          onSale && <span className="badge">{t.sale}</span>
        )}
      </div>
      <div className="card__body">
        <span className="card__name">{product.name}</span>
        <Price price={product.price} compareAt={product.compareAtPrice} lang={lang} />
      </div>
    </Link>
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
