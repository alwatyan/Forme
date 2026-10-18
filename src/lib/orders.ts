import 'server-only'

import crypto from 'crypto'
import type { Payload } from 'payload'

import type { Order, Product } from '@/payload-types'

import { CURRENCY, roundMoney } from './format'
import type { Locale } from './i18n'
import { getPaymentStatus, sendPayment } from './myfatoorah'

export type CartLine = { productId: number | string; size: string; quantity: number }

export type CheckoutInput = {
  lang: Locale
  lines: CartLine[]
  customer: { name: string; phone: string; email?: string }
  shippingAddress: {
    area: string
    block: string
    street: string
    avenue?: string
    building: string
    apartment?: string
    notes?: string
  }
  baseUrl: string
}

export class CartUnavailableError extends Error {}

function orderNumber() {
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, '')
  return `FS${date}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`
}

/** Kuwaiti mobile numbers without the country code, which is what MyFatoorah expects. */
function localMobile(phone: string) {
  return phone
    .replace(/\D/g, '')
    .replace(/^(00)?965/, '')
    .slice(-11)
}

/**
 * Prices the cart on the server from the database (never trusting the browser), creates a pending order
 * and returns the MyFatoorah payment page URL.
 */
export async function startCheckout(payload: Payload, input: CheckoutInput): Promise<string> {
  const lines = input.lines.filter((l) => l.quantity > 0)
  if (!lines.length) throw new CartUnavailableError('Empty cart')

  const ids = [...new Set(lines.map((l) => l.productId))]
  const { docs } = await payload.find({
    collection: 'products',
    where: { and: [{ id: { in: ids } }, { status: { equals: 'active' } }] },
    locale: input.lang,
    depth: 0,
    limit: ids.length,
    pagination: false,
  })
  const byId = new Map(docs.map((p) => [String(p.id), p]))

  const items = lines.map((line) => {
    const product = byId.get(String(line.productId))
    const size = product?.sizes?.find((s) => s.size === line.size)
    if (!product || !size || size.stock < line.quantity)
      throw new CartUnavailableError(String(line.productId))
    return {
      product: product.id,
      productName: product.name,
      size: line.size,
      quantity: Math.floor(line.quantity),
      unitPrice: product.price,
    }
  })

  const settings = await payload.findGlobal({ slug: 'settings', depth: 0 })
  const subtotal = roundMoney(items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0))
  const freeFrom = settings.freeShippingThreshold
  const shippingFee = freeFrom != null && subtotal >= freeFrom ? 0 : (settings.shippingFee ?? 0)
  const total = roundMoney(subtotal + shippingFee)

  const order = await payload.create({
    collection: 'orders',
    overrideAccess: true,
    data: {
      orderNumber: orderNumber(),
      status: 'pending',
      customer: input.customer,
      shippingAddress: input.shippingAddress,
      items,
      subtotal,
      shippingFee,
      total,
      currency: CURRENCY,
      locale: input.lang,
      accessToken: crypto.randomBytes(16).toString('hex'),
    },
  })

  const callbackUrl = `${input.baseUrl}/payment/callback`
  const invoiceItems = items.map((i) => ({
    ItemName: `${i.productName} (${i.size})`.slice(0, 100),
    Quantity: i.quantity,
    UnitPrice: i.unitPrice,
  }))
  if (shippingFee > 0)
    invoiceItems.push({ ItemName: 'Delivery', Quantity: 1, UnitPrice: shippingFee })

  let invoice
  try {
    invoice = await sendPayment({
      CustomerName: input.customer.name,
      InvoiceValue: total,
      DisplayCurrencyIso: CURRENCY,
      CustomerEmail: input.customer.email || undefined,
      MobileCountryCode: '+965',
      CustomerMobile: localMobile(input.customer.phone),
      CallBackUrl: callbackUrl,
      ErrorUrl: callbackUrl,
      Language: input.lang,
      CustomerReference: String(order.id),
      InvoiceItems: invoiceItems,
    })
  } catch (err) {
    // Don't leave unpayable orders behind in the admin panel.
    await payload.delete({ collection: 'orders', id: order.id, overrideAccess: true })
    throw err
  }

  await payload.update({
    collection: 'orders',
    id: order.id,
    overrideAccess: true,
    data: { payment: { invoiceId: String(invoice.InvoiceId), invoiceURL: invoice.InvoiceURL } },
  })

  return invoice.InvoiceURL
}

async function deductStock(payload: Payload, order: Order) {
  for (const item of order.items) {
    const productId = typeof item.product === 'object' ? item.product?.id : item.product
    if (!productId) continue
    const product = (await payload
      .findByID({ collection: 'products', id: productId, depth: 0, overrideAccess: true })
      .catch(() => null)) as Product | null
    if (!product) continue
    const sizes = product.sizes.map((s) =>
      s.size === item.size ? { ...s, stock: Math.max(0, s.stock - item.quantity) } : s,
    )
    await payload.update({
      collection: 'products',
      id: productId,
      data: { sizes },
      overrideAccess: true,
    })
  }
}

/**
 * Asks MyFatoorah for the real status of a payment and updates the matching order. Safe to call more than
 * once (from the redirect and from the webhook): stock is only deducted the first time an order is paid.
 */
export async function reconcilePayment(
  payload: Payload,
  key: string,
  keyType: 'PaymentId' | 'InvoiceId',
) {
  const status = await getPaymentStatus(key, keyType)

  const order = (await payload
    .findByID({
      collection: 'orders',
      id: status.CustomerReference,
      depth: 0,
      overrideAccess: true,
    })
    .catch(() => null)) as Order | null
  if (!order) return null

  // The invoice must be the one we created for this order, for at least the order total.
  if (order.payment?.invoiceId && order.payment.invoiceId !== String(status.InvoiceId)) return order
  if (status.InvoiceStatus !== 'Paid' || status.InvoiceValue + 0.0005 < order.total) return order
  if (order.status !== 'pending') return order

  const transaction =
    status.InvoiceTransactions?.find((t) => /^succ/i.test(t.TransactionStatus)) ??
    status.InvoiceTransactions?.[0]

  const paid = await payload.update({
    collection: 'orders',
    id: order.id,
    overrideAccess: true,
    data: {
      status: 'paid',
      payment: {
        ...order.payment,
        paymentId: transaction?.PaymentId ?? (keyType === 'PaymentId' ? key : undefined),
        gateway: transaction?.PaymentGateway,
        paidAt: new Date().toISOString(),
      },
    },
  })

  if (!paid.stockDeducted) {
    await deductStock(payload, paid)
    return payload.update({
      collection: 'orders',
      id: order.id,
      overrideAccess: true,
      data: { stockDeducted: true },
    })
  }
  return paid
}
