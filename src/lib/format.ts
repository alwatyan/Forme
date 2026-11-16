import type { Locale } from './i18n'

export const CURRENCY = 'KWD'

/** Prices read like "26 KD"; fils (three decimals) only show when the amount isn't whole. */
export function formatPrice(value: number, lang: Locale) {
  const whole = Number.isInteger(roundMoney(value))
  const amount = new Intl.NumberFormat('en-KW', {
    minimumFractionDigits: whole ? 0 : 3,
    maximumFractionDigits: whole ? 0 : 3,
  }).format(value)
  return `${amount} ${lang === 'ar' ? 'د.ك' : 'KD'}`
}

/** KWD has three decimal places (fils). */
export function roundMoney(value: number) {
  return Math.round(value * 1000) / 1000
}
