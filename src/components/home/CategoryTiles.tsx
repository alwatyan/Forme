import Link from 'next/link'

import type { Locale } from '@/lib/i18n'
import { brandHref } from '@/lib/links'
import { imageUrl } from '@/lib/media'
import type { Category, Homepage } from '@/payload-types'

type TilesBlock = Extract<NonNullable<Homepage['sections']>[number], { blockType: 'categories' }>

export function CategoryTiles({ block, lang }: { block: TilesBlock; lang: Locale }) {
  const categories = (block.categories ?? []).filter(
    (c): c is Category => typeof c === 'object' && c !== null,
  )
  if (!categories.length) return null
  return (
    <section className="tiles">
      {block.title && <h2 className="section-title tiles__title">{block.title}</h2>}
      <div className="tiles__grid">
        {categories.map((c) => {
          const src = imageUrl(c.image)
          return (
            <Link key={c.id} href={brandHref(lang, c.brand, c)} className="tile">
              <div className="tile__media">
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt="" loading="lazy" />
                ) : (
                  <div className="card__placeholder" />
                )}
              </div>
              <span className="tile__label">{c.name}</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
