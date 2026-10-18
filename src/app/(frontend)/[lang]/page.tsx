import { notFound } from 'next/navigation'

import { CategoryTiles } from '@/components/home/CategoryTiles'
import { Hero } from '@/components/home/Hero'
import { ProductRow } from '@/components/home/ProductRow'
import { Statement } from '@/components/home/Statement'
import { getDictionary, isLocale } from '@/lib/i18n'
import { getPayloadClient } from '@/lib/payload'
import type { Homepage } from '@/payload-types'

type Section = NonNullable<Homepage['sections']>[number]

// Shown until the seller builds the home page in the admin panel.
const fallbackSections: Section[] = [
  { blockType: 'products', title: 'Formé', brand: 'forme', show: 'newest', limit: 8 },
  { blockType: 'products', title: 'Siena', brand: 'siena', show: 'newest', limit: 8 },
]

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = getDictionary(lang)

  const payload = await getPayloadClient()
  const homepage = await payload.findGlobal({ slug: 'homepage', locale: lang, depth: 2 })
  const sections = homepage.sections?.length ? homepage.sections : fallbackSections

  return (
    <>
      {sections.map((block, i) => {
        const key = block.id ?? i
        switch (block.blockType) {
          case 'hero':
            return <Hero key={key} block={block} lang={lang} t={t} first={i === 0} />
          case 'products':
            return <ProductRow key={key} block={block} lang={lang} t={t} />
          case 'statement':
            return <Statement key={key} block={block} lang={lang} t={t} />
          case 'categories':
            return <CategoryTiles key={key} block={block} lang={lang} />
          default:
            return null
        }
      })}
    </>
  )
}
