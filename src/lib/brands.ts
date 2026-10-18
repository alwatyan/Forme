export const BRANDS = ['forme', 'siena'] as const
export type Brand = (typeof BRANDS)[number]

export const brandOptions = [
  { label: 'Formé — Activewear', value: 'forme' },
  { label: 'Siena — Darra’a (دراعات)', value: 'siena' },
]

export const brandNames: Record<Brand, string> = {
  forme: 'Formé',
  siena: 'Siena',
}

export function isBrand(value: string): value is Brand {
  return (BRANDS as readonly string[]).includes(value)
}
