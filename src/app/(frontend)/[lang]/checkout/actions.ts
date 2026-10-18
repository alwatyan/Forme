'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { getDictionary, isLocale } from '@/lib/i18n'
import { CartUnavailableError, startCheckout, type CartLine } from '@/lib/orders'
import { getPayloadClient } from '@/lib/payload'
import { siteOrigin } from '@/lib/site'

export type CheckoutState = { error?: string; cartChanged?: boolean }

const text = (form: FormData, key: string, max = 200) =>
  String(form.get(key) ?? '')
    .trim()
    .slice(0, max)

export async function placeOrder(_prev: CheckoutState, form: FormData): Promise<CheckoutState> {
  const langValue = text(form, 'lang')
  const lang = isLocale(langValue) ? langValue : 'en'
  const t = getDictionary(lang)

  let lines: CartLine[] = []
  try {
    const parsed = JSON.parse(String(form.get('cart') ?? '[]'))
    if (Array.isArray(parsed)) {
      lines = parsed.slice(0, 50).map((l) => ({
        productId: Number(l.productId),
        size: String(l.size),
        quantity: Math.max(0, Math.floor(Number(l.quantity) || 0)),
      }))
    }
  } catch {
    return { error: t.cartChanged, cartChanged: true }
  }

  const customer = {
    name: text(form, 'name'),
    phone: text(form, 'phone', 20),
    email: text(form, 'email') || undefined,
  }
  const shippingAddress = {
    area: text(form, 'area'),
    block: text(form, 'block', 20),
    street: text(form, 'street'),
    avenue: text(form, 'avenue') || undefined,
    building: text(form, 'building', 50),
    apartment: text(form, 'apartment', 50) || undefined,
    notes: text(form, 'notes', 500) || undefined,
  }
  if (
    !customer.name ||
    customer.phone.replace(/\D/g, '').length < 8 ||
    !shippingAddress.area ||
    !shippingAddress.block ||
    !shippingAddress.street ||
    !shippingAddress.building
  ) {
    return { error: t.required }
  }

  const h = await headers()
  const proto = h.get('x-forwarded-proto') ?? 'http'
  const baseUrl = siteOrigin(`${proto}://${h.get('host')}`)

  const payload = await getPayloadClient()
  let paymentUrl: string
  try {
    paymentUrl = await startCheckout(payload, { lang, lines, customer, shippingAddress, baseUrl })
  } catch (err) {
    if (err instanceof CartUnavailableError) return { error: t.cartChanged, cartChanged: true }
    payload.logger.error({ err }, 'Checkout failed')
    return { error: t.paymentError }
  }
  redirect(paymentUrl)
}
