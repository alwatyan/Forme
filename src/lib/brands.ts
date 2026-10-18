export const BRANDS = ['forme', 'siena'] as const
export type Brand = (typeof BRANDS)[number]

export const brandOptions = [
  { label: 'Formé — Darra’a (دراعات)', value: 'forme' },
  { label: 'Siena — Activewear', value: 'siena' },
]

export const brandNames: Record<Brand, string> = {
  forme: 'Formé',
  siena: 'Siena',
}

export function isBrand(value: string): value is Brand {
  return (BRANDS as readonly string[]).includes(value)
}
