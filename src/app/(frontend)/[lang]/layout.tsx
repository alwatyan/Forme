import type { Metadata } from 'next'
import { EB_Garamond, IBM_Plex_Sans_Arabic, Jost, Noto_Naskh_Arabic } from 'next/font/google'
import { notFound } from 'next/navigation'
import React from 'react'

import { CartDrawer } from '@/components/CartDrawer'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import type { MenuBrand } from '@/components/HeaderClient'
import { JoinList } from '@/components/JoinList'
import { Providers } from '@/components/Providers'
import { getDictionary, isLocale } from '@/lib/i18n'
import { getPayloadClient } from '@/lib/payload'

import '../styles.css'

const serif = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-serif',
})
const sans = Jost({ subsets: ['latin'], weight: ['300', '400', '500'], variable: '--font-sans' })
const arabicSerif = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600'],
  variable: '--font-arabic-serif',
})
const arabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500'],
  variable: '--font-arabic',
})

export const metadata: Metadata = {
  title: { default: 'Formé · Siena', template: '%s — Formé · Siena' },
  description: 'Formé activewear, and Siena darra’a and kaftans. Delivered across Kuwait.',
}

// Pages read products and settings from the CMS on each request, so edits show up immediately.
export const dynamic = 'force-dynamic'

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = getDictionary(lang)

  const payload = await getPayloadClient()
  const [settings, { docs: categories }] = await Promise.all([
    payload.findGlobal({ slug: 'settings', locale: lang, depth: 0 }),
    payload.find({
      collection: 'categories',
      locale: lang,
      sort: 'sortOrder',
      depth: 0,
      limit: 100,
    }),
  ])
  const menu: MenuBrand[] = (['forme', 'siena'] as const).map((brand) => ({
    brand,
    tagline:
      (brand === 'forme' ? settings.formeTagline : settings.sienaTagline) ||
      (brand === 'forme' ? t.formeLine : t.sienaLine),
    categories: categories
      .filter((c) => c.brand === brand && c.slug)
      .map((c) => ({ name: c.name, slug: c.slug as string })),
  }))

  return (
    <html
      lang={lang}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className={`${serif.variable} ${sans.variable} ${arabic.variable} ${arabicSerif.variable}`}
    >
      <body>
        <Providers lang={lang} t={t}>
          <Header settings={settings} menu={menu} />
          <main>{children}</main>
          <Footer lang={lang} t={t} settings={settings} />
          <CartDrawer />
          <JoinList />
        </Providers>
      </body>
    </html>
  )
}
