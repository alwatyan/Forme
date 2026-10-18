'use client'

import Link from 'next/link'
import { useEffect } from 'react'

import { formatPrice } from '@/lib/format'

import { useCart, useI18n } from './Providers'

export function CartDrawer() {
  const { lang, t } = useI18n()
  const cart = useCart()
  const { isOpen, close } = cart

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, close])

  return (
    <div className={`drawer ${isOpen ? 'drawer--open' : ''}`} aria-hidden={!isOpen}>
      <div className="drawer__scrim" onClick={close} />
      <aside className="drawer__panel" role="dialog" aria-label={t.bag} aria-modal="true">
        <div className="drawer__head">
          <span className="eyebrow">
            {t.bag} ({cart.count})
          </span>
          <button type="button" className="link-button" onClick={close}>
            {t.close}
          </button>
        </div>

        {cart.items.length === 0 ? (
          <div className="drawer__empty">
            <p>{t.bagEmpty}</p>
            <button type="button" className="button button--ghost" onClick={close}>
              {t.continueShopping}
            </button>
          </div>
        ) : (
          <>
            <ul className="drawer__items">
              {cart.items.map((item) => (
                <li key={`${item.productId}-${item.size}`} className="line">
                  <Link
                    href={`/${lang}/${item.brand}/${item.slug}`}
                    onClick={close}
                    className="line__media"
                  >
                    {item.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt="" />
                    )}
                  </Link>
                  <div className="line__info">
                    <span className="line__name">{item.name}</span>
                    <span className="muted">
                      {t.size}: {item.size}
                    </span>
                    <div className="line__row">
                      <div className="stepper">
                        <button
                          type="button"
                          aria-label="−"
                          onClick={() =>
                            cart.setQuantity(item.productId, item.size, item.quantity - 1)
                          }
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          aria-label="+"
                          disabled={item.quantity >= item.maxStock}
                          onClick={() =>
                            cart.setQuantity(item.productId, item.size, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                      <span>{formatPrice(item.price * item.quantity, lang)}</span>
                    </div>
                    <button
                      type="button"
                      className="link-button muted"
                      onClick={() => cart.remove(item.productId, item.size)}
                    >
                      {t.remove}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="drawer__foot">
              <div className="summary-row">
                <span>{t.subtotal}</span>
                <span>{formatPrice(cart.subtotal, lang)}</span>
              </div>
              <Link href={`/${lang}/checkout`} className="button" onClick={close}>
                {t.checkout}
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
