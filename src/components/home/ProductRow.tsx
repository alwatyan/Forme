import Link from 'next/link'

import { findProducts } from '@/lib/catalog'
import type { Dictionary, Locale } from '@/lib/i18n'
import { brandHref } from '@/lib/links'
import type { Homepage } from '@/payload-types'

import { ProductRail } from '../ProductCard'

type RowBlock = Extract<NonNullable<Homepage['sections']>[number], { blockType: 'products' }>

export async function ProductRow({
  block,
  lang,
  t,
}: {
  block: RowBlock
  lang: Locale
  t: Dictionary
}) {
  const limit = block.limit ?? 8
  const categoryId =
    block.show === 'category' && block.category
      ? typeof block.category === 'object'
        ? block.category.id
        : block.category
      : undefined

  let products = await findProducts(lang, {
    brand: block.brand,
    featured: block.show === 'featured',
    category: categoryId,
    limit,
  })
  // If nothing is marked as featured yet, show the newest pieces instead of an empty row.
  if (!products.length && block.show === 'featured')
    products = await findProducts(lang, { brand: block.brand, limit })

  return (
    <section className="row" data-brand-row={block.brand}>
      <div className="row__head">
        <h2 className="section-title">{block.title}</h2>
        <Link
          href={brandHref(lang, block.brand, block.show === 'category' ? block.category : null)}
          className="serif-link"
        >
          {t.shopAll}
        </Link>
      </div>
      <ProductRail products={products} lang={lang} t={t} />
    </section>
  )
}
