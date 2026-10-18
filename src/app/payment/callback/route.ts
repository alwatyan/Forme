import { NextResponse, type NextRequest } from 'next/server'

import { reconcilePayment } from '@/lib/orders'
import { getPayloadClient } from '@/lib/payload'
import { siteOrigin } from '@/lib/site'

/** MyFatoorah sends the customer back here (on success and on failure) with ?paymentId=… */
export async function GET(req: NextRequest) {
  const origin = siteOrigin(req.nextUrl.origin)
  const paymentId = req.nextUrl.searchParams.get('paymentId')
  const fallback = new URL('/en/checkout?error=payment', origin)
  if (!paymentId) return NextResponse.redirect(fallback)

  const payload = await getPayloadClient()
  try {
    const order = await reconcilePayment(payload, paymentId, 'PaymentId')
    if (!order) return NextResponse.redirect(fallback)
    const lang = order.locale === 'ar' ? 'ar' : 'en'
    return NextResponse.redirect(
      new URL(`/${lang}/order/${order.id}?t=${order.accessToken}`, origin),
    )
  } catch (err) {
    payload.logger.error({ err }, 'Payment callback failed')
    return NextResponse.redirect(fallback)
  }
}
