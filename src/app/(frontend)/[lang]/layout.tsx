import type { Metadata } from 'next'
import { Cormorant_Garamond, IBM_Plex_Sans_Arabic, Jost } from 'next/font/google'
import { notFound } from 'next/navigation'
import React from 'react'

import { CartDrawer } from '@/components/CartDrawer'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Providers } from '@/components/Providers'
import { getDictionary, isLocale } from '@/lib/i18n'
import { getPayloadClient } from '@/lib/payload'

import '../styles.css'

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-serif',
})
const sans = Jost({ subsets: ['latin'], weight: ['300', '400', '500'], variable: '--font-sans' })
const arabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500'],
  variable: '--font-arabic',
})

export const metadata: Metadata = {
  title: { default: 'Formé · Siena', template: '%s — Formé · Siena' },
  description: 'Formé darra’a and kaftans, and Siena activewear. Delivered across Kuwait.',
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
  const settings = await payload.findGlobal({ slug: 'settings', locale: lang, depth: 0 })

  return (
    <html
      lang={lang}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className={`${serif.variable} ${sans.variable} ${arabic.variable}`}
    >
      <body>
        <Providers lang={lang} t={t}>
          <Header lang={lang} t={t} announcement={settings.announcement} />
          <main>{children}</main>
          <Footer lang={lang} t={t} settings={settings} />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  )
}
