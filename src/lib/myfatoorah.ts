/**
 * Minimal MyFatoorah v2 client.
 *
 * Base URLs: https://apitest.myfatoorah.com (test, any country), https://api.myfatoorah.com (Kuwait, Bahrain,
 * Jordan, Oman), https://api-sa.myfatoorah.com (Saudi Arabia), https://api-qa.myfatoorah.com (Qatar),
 * https://api-ae.myfatoorah.com (UAE), https://api-eg.myfatoorah.com (Egypt).
 */
import 'server-only'

const BASE_URL = (process.env.MYFATOORAH_BASE_URL || 'https://apitest.myfatoorah.com').replace(
  /\/$/,
  '',
)

export class MyFatoorahError extends Error {}

type Envelope<T> = {
  IsSuccess: boolean
  Message?: string
  ValidationErrors?: { Name: string; Error: string }[] | null
  Data: T
}

async function call<T>(path: string, body: unknown): Promise<T> {
  const apiKey = process.env.MYFATOORAH_API_KEY
  if (!apiKey) throw new MyFatoorahError('MYFATOORAH_API_KEY is not configured')

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  })

  const json = (await res.json().catch(() => null)) as Envelope<T> | null
  if (!res.ok || !json?.IsSuccess) {
    const detail =
      json?.ValidationErrors?.map((e) => `${e.Name}: ${e.Error}`).join('; ') ||
      json?.Message ||
      `${res.status} ${res.statusText}`
    throw new MyFatoorahError(`MyFatoorah ${path} failed: ${detail}`)
  }
  return json.Data
}

export type SendPaymentInput = {
  CustomerName: string
  InvoiceValue: number
  DisplayCurrencyIso: string
  CustomerEmail?: string
  MobileCountryCode?: string
  CustomerMobile?: string
  CallBackUrl: string
  ErrorUrl: string
  Language: 'en' | 'ar'
  CustomerReference: string
  InvoiceItems: { ItemName: string; Quantity: number; UnitPrice: number }[]
}

export type SendPaymentResult = {
  InvoiceId: number
  InvoiceURL: string
  CustomerReference: string
}

/** Creates an invoice and returns the hosted payment page where the customer picks KNET, card, Apple Pay, etc. */
export function sendPayment(input: SendPaymentInput) {
  return call<SendPaymentResult>('/v2/SendPayment', { NotificationOption: 'LNK', ...input })
}

export type PaymentStatus = {
  InvoiceId: number
  InvoiceStatus: 'Pending' | 'Paid' | 'Canceled' | string
  InvoiceValue: number
  CustomerReference: string
  InvoiceTransactions: {
    PaymentId: string
    PaymentGateway: string
    TransactionStatus: string
  }[]
}

export function getPaymentStatus(key: string, keyType: 'PaymentId' | 'InvoiceId') {
  return call<PaymentStatus>('/v2/GetPaymentStatus', { Key: key, KeyType: keyType })
}
