import { formatPrice } from '@/lib/format'
import type { Locale } from '@/lib/i18n'

export function Price({
  price,
  compareAt,
  lang,
}: {
  price: number
  compareAt?: number | null
  lang: Locale
}) {
  const onSale = compareAt != null && compareAt > price
  return (
    <span className="price">
      {onSale && <s className="price__was">{formatPrice(compareAt, lang)}</s>}
      <span className={onSale ? 'price__now price__now--sale' : 'price__now'}>
        {formatPrice(price, lang)}
      </span>
    </span>
  )
}
