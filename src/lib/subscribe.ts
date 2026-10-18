'use server'

import { isLocale } from './i18n'
import { getPayloadClient } from './payload'

export type SubscribeState = { status: 'idle' | 'done' | 'invalid' }

export async function subscribe(_prev: SubscribeState, form: FormData): Promise<SubscribeState> {
  const email = String(form.get('email') ?? '')
    .trim()
    .toLowerCase()
    .slice(0, 200)
  const lang = String(form.get('lang') ?? '')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { status: 'invalid' }

  const payload = await getPayloadClient()
  const { totalDocs } = await payload.count({
    collection: 'subscribers',
    where: { email: { equals: email } },
  })
  if (!totalDocs) {
    await payload.create({
      collection: 'subscribers',
      overrideAccess: true,
      data: { email, locale: isLocale(lang) ? lang : 'en' },
    })
  }
  return { status: 'done' }
}
