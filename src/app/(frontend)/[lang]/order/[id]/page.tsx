import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { formatPrice } from '@/lib/format'
import { getDictionary, isLocale } from '@/lib/i18n'
import { getPayloadClient } from '@/lib/payload'

import { ClearBag } from './ClearBag'

export const metadata: Metadata = { robots: { index: false } }

type Props = {
  params: Promise<{ lang: string; id: string }>
  searchParams: Promise<{ t?: string }>
}

export default async function OrderPage({ params, searchParams }: Props) {
  const { lang, id } = await params
  const { t: token } = await searchParams
  if (!isLocale(lang)) notFound()
  const t = getDictionary(lang)

  const payload = await getPayloadClient()
  const order = await payload
    .findByID({ collection: 'orders', id, depth: 0, overrideAccess: true })
    .catch(() => null)
  // The random token in the link keeps other people's orders private.
  if (!order || !token || order.accessToken !== token) notFound()

  const paid = order.status !== 'pending' && order.status !== 'cancelled'

  return (
    <section className="section confirmation">
      {paid ? (
        <>
          <ClearBag />
          <h1 className="page-title">{t.thankYou}</h1>
          <p>{t.paidMessage}</p>
        </>
      ) : (
        <>
          <h1 className="page-title">{t.pendingTitle}</h1>
          <p>{t.pendingMessage}</p>
        </>
      )}
      <p className="eyebrow">
        {t.orderNumber}: {order.orderNumber}
      </p>

      <ul className="summary-items">
        {order.items.map((item) => (
          <li key={item.id}>
            <div>
              <span>{item.productName}</span>
              <span className="muted">
                {t.size}: {item.size} · {t.quantity}: {item.quantity}
              </span>
            </div>
            <span>{formatPrice(item.unitPrice * item.quantity, lang)}</span>
          </li>
        ))}
      </ul>
      <div className="summary-row">
        <span>{t.delivery}</span>
        <span>{order.shippingFee === 0 ? t.free : formatPrice(order.shippingFee, lang)}</span>
      </div>
      <div className="summary-row summary-row--total">
        <span>{t.total}</span>
        <span>{formatPrice(order.total, lang)}</span>
      </div>

      <div className="confirmation__actions">
        {!paid && order.status === 'pending' && order.payment?.invoiceURL && (
          <a href={order.payment.invoiceURL} className="button">
            {t.tryAgain}
          </a>
        )}
        <Link href={`/${lang}`} className="button button--ghost">
          {t.backToShop}
        </Link>
      </div>
    </section>
  )
}
