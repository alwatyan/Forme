import type { Locale } from './i18n'

export const CURRENCY = 'KWD'

export function formatPrice(value: number, lang: Locale) {
  return new Intl.NumberFormat(lang === 'ar' ? 'ar-KW-u-nu-latn' : 'en-KW', {
    style: 'currency',
    currency: CURRENCY,
    minimumFractionDigits: 3,
  }).format(value)
}

/** KWD has three decimal places (fils). */
export function roundMoney(value: number) {
  return Math.round(value * 1000) / 1000
}
