import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getDictionary, isLocale } from '@/lib/i18n'
import { getPayloadClient } from '@/lib/payload'

import { CheckoutForm } from './CheckoutForm'

export const metadata: Metadata = { title: 'Checkout', robots: { index: false } }

type Props = { params: Promise<{ lang: string }>; searchParams: Promise<{ error?: string }> }

export default async function CheckoutPage({ params, searchParams }: Props) {
  const { lang } = await params
  const { error } = await searchParams
  if (!isLocale(lang)) notFound()
  const t = getDictionary(lang)

  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'settings', depth: 0 })

  return (
    <section className="section">
      <h1 className="page-title">{t.checkout}</h1>
      <CheckoutForm
        shippingFee={settings.shippingFee ?? 0}
        freeShippingThreshold={settings.freeShippingThreshold ?? null}
        initialError={error ? t.paymentError : undefined}
      />
    </section>
  )
}
