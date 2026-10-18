'use client'

import Link from 'next/link'
import { useActionState } from 'react'

import { useCart, useI18n } from '@/components/Providers'
import { formatPrice } from '@/lib/format'

import { placeOrder, type CheckoutState } from './actions'

type Props = { shippingFee: number; freeShippingThreshold: number | null; initialError?: string }

export function CheckoutForm({ shippingFee, freeShippingThreshold, initialError }: Props) {
  const { lang, t } = useI18n()
  const cart = useCart()
  const [state, action, pending] = useActionState<CheckoutState, FormData>(placeOrder, {
    error: initialError,
  })

  if (cart.items.length === 0) {
    return (
      <div className="checkout__empty">
        <p>{t.bagEmpty}</p>
        <Link href={`/${lang}`} className="button button--ghost">
          {t.continueShopping}
        </Link>
      </div>
    )
  }

  const delivery =
    freeShippingThreshold != null && cart.subtotal >= freeShippingThreshold ? 0 : shippingFee
  const lines = cart.items.map(({ productId, size, quantity }) => ({ productId, size, quantity }))

  return (
    <form action={action} className="checkout">
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="cart" value={JSON.stringify(lines)} />

      <div className="checkout__form">
        <fieldset>
          <legend className="eyebrow">{t.details}</legend>
          <label className="field field--full">
            <span>{t.fullName}</span>
            <input name="name" required autoComplete="name" />
          </label>
          <label className="field">
            <span>{t.phone}</span>
            <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" dir="ltr" />
          </label>
          <label className="field">
            <span>{t.email}</span>
            <input name="email" type="email" autoComplete="email" dir="ltr" />
          </label>
        </fieldset>

        <fieldset>
          <legend className="eyebrow">{t.address}</legend>
          <label className="field">
            <span>{t.area}</span>
            <input name="area" required />
          </label>
          <label className="field">
            <span>{t.block}</span>
            <input name="block" required />
          </label>
          <label className="field">
            <span>{t.street}</span>
            <input name="street" required />
          </label>
          <label className="field">
            <span>{t.avenue}</span>
            <input name="avenue" />
          </label>
          <label className="field">
            <span>{t.building}</span>
            <input name="building" required />
          </label>
          <label className="field">
            <span>{t.apartment}</span>
            <input name="apartment" />
          </label>
          <label className="field field--full">
            <span>{t.notes}</span>
            <textarea name="notes" rows={3} />
          </label>
        </fieldset>
      </div>

      <aside className="checkout__summary">
        <span className="eyebrow">{t.orderSummary}</span>
        <ul className="summary-items">
          {cart.items.map((item) => (
            <li key={`${item.productId}-${item.size}`}>
              {item.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt="" />
              )}
              <div>
                <span>{item.name}</span>
                <span className="muted">
                  {t.size}: {item.size} · {t.quantity}: {item.quantity}
                </span>
              </div>
              <span>{formatPrice(item.price * item.quantity, lang)}</span>
            </li>
          ))}
        </ul>
        <div className="summary-row">
          <span>{t.subtotal}</span>
          <span>{formatPrice(cart.subtotal, lang)}</span>
        </div>
        <div className="summary-row">
          <span>{t.delivery}</span>
          <span>{delivery === 0 ? t.free : formatPrice(delivery, lang)}</span>
        </div>
        {freeShippingThreshold != null && delivery > 0 && (
          <p className="muted small">
            {t.freeDeliveryFrom} {formatPrice(freeShippingThreshold, lang)}
          </p>
        )}
        <div className="summary-row summary-row--total">
          <span>{t.total}</span>
          <span>{formatPrice(cart.subtotal + delivery, lang)}</span>
        </div>

        {state.error && (
          <p className="error-text" role="alert">
            {state.error}
          </p>
        )}
        <button type="submit" className="button" disabled={pending}>
          {pending ? t.paying : t.payNow}
        </button>
        <p className="muted small">{t.secureNote}</p>
      </aside>
    </form>
  )
}
