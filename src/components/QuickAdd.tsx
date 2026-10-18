'use client'

import { useEffect, useRef, useState } from 'react'

import { PlusIcon } from './Icons'
import { useCart, useI18n } from './Providers'

type Props = {
  productId: number
  slug: string
  brand: string
  name: string
  price: number
  image: string | null
  sizes: { size: string; stock: number }[]
}

/** The “+” on a product picture: adds straight to the bag, or asks for a size first. */
export function QuickAdd({ sizes, ...product }: Props) {
  const { t } = useI18n()
  const { add } = useCart()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [open])

  const addSize = (size: { size: string; stock: number }) => {
    add({ ...product, size: size.size, maxStock: size.stock })
    setOpen(false)
  }

  return (
    <div className="quick" ref={ref}>
      {open && (
        <div className="quick__sizes" role="group" aria-label={t.selectSize}>
          {sizes.map((s) => (
            <button key={s.size} type="button" disabled={s.stock <= 0} onClick={() => addSize(s)}>
              {s.size}
            </button>
          ))}
        </div>
      )}
      <button
        type="button"
        className="quick__plus"
        aria-label={t.quickAdd}
        aria-expanded={open}
        onClick={() => (sizes.length === 1 ? addSize(sizes[0]) : setOpen(!open))}
      >
        <PlusIcon />
      </button>
    </div>
  )
}
