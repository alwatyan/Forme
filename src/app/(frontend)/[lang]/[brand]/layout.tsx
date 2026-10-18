import { notFound } from 'next/navigation'
import React from 'react'

import { isBrand } from '@/lib/brands'

/** Marks the page with its brand so the theme (colours) can follow it, including the header. */
export default async function BrandLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ brand: string }>
}) {
  const { brand } = await params
  if (!isBrand(brand)) notFound()
  return <div data-brand={brand}>{children}</div>
}
