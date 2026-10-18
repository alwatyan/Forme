/** Public origin of the shop, used for payment redirect URLs. */
export function siteOrigin(fallback: string) {
  return (process.env.NEXT_PUBLIC_SERVER_URL || fallback).replace(/\/$/, '')
}
