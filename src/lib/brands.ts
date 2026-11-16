export const BRANDS = ['forme', 'sienna'] as const
export type Brand = (typeof BRANDS)[number]

export const brandOptions = [
  { label: 'Formé — Activewear', value: 'forme' },
  { label: 'Sienna — Darra’a (دراعات)', value: 'sienna' },
]

export const brandNames: Record<Brand, string> = {
  forme: 'Formé',
  sienna: 'Sienna',
}

export function isBrand(value: string): value is Brand {
  return (BRANDS as readonly string[]).includes(value)
}
