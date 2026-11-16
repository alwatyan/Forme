import Link from 'next/link'

import type { Dictionary, Locale } from '@/lib/i18n'
import { brandHref } from '@/lib/links'
import { asMedia, imageUrl } from '@/lib/media'
import type { Homepage } from '@/payload-types'

import { Wordmark } from '../Wordmark'

type HeroBlock = Extract<NonNullable<Homepage['sections']>[number], { blockType: 'hero' }>

function Media({ value, className, eager }: { value: unknown; className: string; eager: boolean }) {
  const media = asMedia(value)
  if (!media?.url) return null
  if (media.mimeType?.startsWith('video/')) {
    return (
      <video
        className={className}
        src={media.url}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
    )
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className}
      src={imageUrl(media, 'large') ?? media.url}
      alt={media.alt ?? ''}
      style={
        media.focalX != null && media.focalY != null
          ? { objectPosition: `${media.focalX}% ${media.focalY}%` }
          : undefined
      }
      loading={eager ? 'eager' : 'lazy'}
    />
  )
}

export function Hero({
  block,
  lang,
  t,
  first,
}: {
  block: HeroBlock
  lang: Locale
  t: Dictionary
  first: boolean
}) {
  const href = brandHref(lang, block.linkBrand, block.linkCategory)
  const hasMobile = Boolean(asMedia(block.mobileMedia))

  return (
    <section className={`hero ${first ? 'hero--first' : ''}`}>
      <Link
        href={href}
        className="hero__link"
        aria-label={block.title || block.buttonLabel || t.shopNow}
      >
        <Media
          value={block.media}
          className={`hero__media ${hasMobile ? 'hero__media--desktop' : ''}`}
          eager={first}
        />
        {hasMobile && (
          <Media
            value={block.mobileMedia}
            className="hero__media hero__media--mobile"
            eager={first}
          />
        )}
      </Link>
      <div className="hero__content">
        {block.logo && block.logo !== 'none' && (
          <Wordmark brand={block.logo} className="hero__mark" />
        )}
        {block.title && <h2 className="hero__title">{block.title}</h2>}
        {!block.hideButton && (
          <Link href={href} className="hero__button">
            {block.buttonLabel || t.shopNow}
          </Link>
        )}
      </div>
    </section>
  )
}
