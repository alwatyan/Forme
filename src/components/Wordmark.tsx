import type { Brand } from '@/lib/brands'
import { brandNames } from '@/lib/brands'

/** The brand logo, drawn as a mask so it takes the colour of the surrounding text. */
export function Wordmark({ brand, className = '' }: { brand: Brand; className?: string }) {
  return (
    <span
      role="img"
      aria-label={brandNames[brand]}
      className={`wordmark wordmark--${brand} ${className}`}
    />
  )
}
