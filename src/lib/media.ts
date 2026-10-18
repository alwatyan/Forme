import type { Media } from '@/payload-types'

export type ImageSize = 'thumbnail' | 'card' | 'large'

export function asMedia(value: unknown): Media | null {
  return value && typeof value === 'object' && 'url' in value ? (value as Media) : null
}

export function imageUrl(value: unknown, size: ImageSize = 'card'): string | null {
  const media = asMedia(value)
  if (!media) return null
  return media.sizes?.[size]?.url || media.url || null
}
