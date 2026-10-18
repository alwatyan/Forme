'use client'

import { useState } from 'react'

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

export function AddToBag({ sizes, ...product }: Props) {
  const { t } = useI18n()
  const { add } = useCart()
  const inStock = sizes.filter((s) => s.stock > 0)
  const [selected, setSelected] = useState<string | null>(
    inStock.length === 1 && sizes.length === 1 ? inStock[0].size : null,
  )
  const [hint, setHint] = useState(false)

  const chosen = sizes.find((s) => s.size === selected)

  return (
    <div className="buy">
      <div className="buy__label">
        <span className="eyebrow">{t.size}</span>
        {hint && !selected && <span className="error-text">{t.selectSize}</span>}
      </div>
      <div className="sizes" role="radiogroup" aria-label={t.size}>
        {sizes.map((s) => (
          <button
            key={s.size}
            type="button"
            role="radio"
            aria-checked={selected === s.size}
            disabled={s.stock <= 0}
            className={`size ${selected === s.size ? 'size--active' : ''}`}
            onClick={() => setSelected(s.size)}
          >
            {s.size}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="button"
        disabled={inStock.length === 0}
        onClick={() => {
          if (!chosen) return setHint(true)
          add({ ...product, size: chosen.size, maxStock: chosen.stock })
        }}
      >
        {inStock.length === 0 ? t.soldOut : t.addToBag}
      </button>
    </div>
  )
}
