'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import type { Dictionary, Locale } from '@/lib/i18n'

type I18n = { lang: Locale; t: Dictionary }

const I18nContext = createContext<I18n | null>(null)

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside <Providers>')
  return ctx
}

export type CartItem = {
  productId: number
  slug: string
  brand: string
  name: string
  size: string
  price: number
  image: string | null
  quantity: number
  maxStock: number
}

type Cart = {
  items: CartItem[]
  count: number
  subtotal: number
  isOpen: boolean
  open: () => void
  close: () => void
  add: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  setQuantity: (productId: number, size: string, quantity: number) => void
  remove: (productId: number, size: string) => void
  clear: () => void
}

const CartContext = createContext<Cart | null>(null)
const STORAGE_KEY = 'forme-siena-cart'

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <Providers>')
  return ctx
}

const sameLine = (a: Pick<CartItem, 'productId' | 'size'>, productId: number, size: string) =>
  a.productId === productId && a.size === size

export function Providers({ lang, t, children }: I18n & { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [isOpen, setOpen] = useState(false)

  // The bag lives in localStorage, which only exists in the browser, so it is read after the first render.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      if (Array.isArray(stored)) setItems(stored)
    } catch {
      // Ignore unreadable storage and start with an empty bag.
    }
    setHydrated(true)
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // Storage can be unavailable (private mode); the bag then lasts for this visit only.
    }
  }, [items, hydrated])

  useEffect(() => {
    document.documentElement.classList.toggle('lock-cart', isOpen)
  }, [isOpen])

  const add = useCallback<Cart['add']>((item, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => sameLine(i, item.productId, item.size))
      if (existing) {
        return prev.map((i) =>
          i === existing
            ? { ...i, ...item, quantity: Math.min(item.maxStock, i.quantity + quantity) }
            : i,
        )
      }
      return [...prev, { ...item, quantity: Math.min(item.maxStock, quantity) }]
    })
    setOpen(true)
  }, [])

  const setQuantity = useCallback<Cart['setQuantity']>((productId, size, quantity) => {
    setItems((prev) =>
      prev.flatMap((i) => {
        if (!sameLine(i, productId, size)) return [i]
        const next = Math.min(i.maxStock, quantity)
        return next > 0 ? [{ ...i, quantity: next }] : []
      }),
    )
  }, [])

  const remove = useCallback<Cart['remove']>((productId, size) => {
    setItems((prev) => prev.filter((i) => !sameLine(i, productId, size)))
  }, [])

  const cart = useMemo<Cart>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.quantity, 0),
      subtotal: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      add,
      setQuantity,
      remove,
      clear: () => setItems([]),
    }),
    [items, isOpen, add, setQuantity, remove],
  )

  const i18n = useMemo(() => ({ lang, t }), [lang, t])

  return (
    <I18nContext.Provider value={i18n}>
      <CartContext.Provider value={cart}>{children}</CartContext.Provider>
    </I18nContext.Provider>
  )
}
