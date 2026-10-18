import Link from 'next/link'

import type { Dictionary, Locale } from '@/lib/i18n'
import { brandHref } from '@/lib/links'
import type { Homepage } from '@/payload-types'

type StatementBlock = Extract<NonNullable<Homepage['sections']>[number], { blockType: 'statement' }>

/** Big words with their letters spread across the page. Arabic letters join, so Arabic is kept whole. */
export function Statement({
  block,
  lang,
  t,
}: {
  block: StatementBlock
  lang: Locale
  t: Dictionary
}) {
  const words = block.text.trim().split(/\s+/)
  return (
    <section className="statement">
      <h2 className="statement__words" aria-label={block.text}>
        {words.map((word, i) =>
          lang === 'ar' ? (
            <span key={i} className="statement__word statement__word--whole" aria-hidden>
              {word}
            </span>
          ) : (
            <span key={i} className="statement__word" aria-hidden>
              {[...word].map((ch, j) => (
                <span key={j}>{ch}</span>
              ))}
            </span>
          ),
        )}
      </h2>
      {block.subtitle && <p className="statement__subtitle">{block.subtitle}</p>}
      <Link href={brandHref(lang, block.linkBrand, block.linkCategory)} className="serif-link">
        {block.linkLabel || t.shopNowLower}
      </Link>
    </section>
  )
}
