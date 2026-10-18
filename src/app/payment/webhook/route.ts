import { NextResponse, type NextRequest } from 'next/server'

import { reconcilePayment } from '@/lib/orders'
import { getPayloadClient } from '@/lib/payload'

/**
 * Optional MyFatoorah webhook (set it in the MyFatoorah portal under Integration Settings → Webhook).
 * It covers customers who pay but close the browser before being redirected back. The body is not trusted:
 * we only take the invoice id from it and re-check the status with MyFatoorah.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const invoiceId = body?.Data?.InvoiceId ?? body?.Data?.Invoice?.Id
  if (!invoiceId) return NextResponse.json({ ok: false }, { status: 400 })

  const payload = await getPayloadClient()
  try {
    await reconcilePayment(payload, String(invoiceId), 'InvoiceId')
    return NextResponse.json({ ok: true })
  } catch (err) {
    payload.logger.error({ err }, 'Payment webhook failed')
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
