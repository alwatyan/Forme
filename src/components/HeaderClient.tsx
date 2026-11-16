'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState, useSyncExternalStore } from 'react'

import { brandNames, isBrand, type Brand } from '@/lib/brands'

import { BagIcon, ChevronIcon, CloseIcon, MenuIcon, SearchIcon } from './Icons'
import { useCart, useI18n } from './Providers'
import { Wordmark } from './Wordmark'

export type MenuBrand = {
  brand: Brand
  tagline: string
  categories: { name: string; slug: string }[]
}

type Props = {
  menu: MenuBrand[]
  contact: { whatsapp?: string | null; instagram: { label: string; href: string }[] }
}

const subscribeScroll = (cb: () => void) => {
  window.addEventListener('scroll', cb, { passive: true })
  return () => window.removeEventListener('scroll', cb)
}
const isScrolled = () => window.scrollY > 10

function useLangSwitchHref() {
  const { lang } = useI18n()
  const pathname = usePathname()
  const other = lang === 'ar' ? 'en' : 'ar'
  return { other, href: pathname.replace(/^\/(en|ar)(?=\/|$)/, `/${other}`) }
}

export function SiteHeader({ menu, contact }: Props) {
  const { lang, t } = useI18n()
  const cart = useCart()
  const section = usePathname().split('/')[2] ?? ''
  const scrolled = useSyncExternalStore(subscribeScroll, isScrolled, () => false)
  const [panel, setPanel] = useState<'menu' | 'search' | null>(null)
  const [sub, setSub] = useState<Brand | null>(null)
  const langSwitch = useLangSwitchHref()

  useEffect(() => {
    document.documentElement.classList.toggle('lock-menu', panel === 'menu')
  }, [panel])

  useEffect(() => {
    if (!panel) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setPanel(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [panel])

  const close = () => {
    setPanel(null)
    setSub(null)
  }
  const openSub = menu.find((m) => m.brand === sub)

  return (
    <>
      <header className="header" data-solid={scrolled || panel ? 'true' : 'false'}>
        <div className="header__start">
          {isBrand(section) ? (
            <Link href={`/${lang}/${section}`} className="header__logo" onClick={close}>
              <Wordmark brand={section} />
            </Link>
          ) : (
            <Link href={`/${lang}`} className="header__logo header__logo--pair" onClick={close}>
              <Wordmark brand="forme" />
              <span className="header__divider" />
              <Wordmark brand="sienna" />
            </Link>
          )}
          <nav className="header__nav" aria-label="Main">
            {menu.map((m) => (
              <Link
                key={m.brand}
                href={`/${lang}/${m.brand}`}
                className={section === m.brand ? 'is-active' : undefined}
              >
                {brandNames[m.brand]}
              </Link>
            ))}
          </nav>
        </div>
        <div className="header__icons">
          <Link
            href={langSwitch.href}
            className="header__lang"
            hrefLang={langSwitch.other}
            lang={langSwitch.other}
          >
            {t.language}
          </Link>
          <button
            type="button"
            className="icon-button"
            aria-label={t.search}
            onClick={() => setPanel(panel === 'search' ? null : 'search')}
          >
            <SearchIcon />
          </button>
          <button
            type="button"
            className="icon-button bag-button"
            aria-label={`${t.bag} (${cart.count})`}
            onClick={cart.open}
          >
            <BagIcon />
            {cart.count > 0 && <span className="bag-button__count">{cart.count}</span>}
          </button>
          <button
            type="button"
            className="icon-button"
            aria-label={t.menu}
            onClick={() => setPanel('menu')}
          >
            <MenuIcon />
          </button>
        </div>
      </header>

      {panel === 'search' && (
        <div className="search-panel">
          <form
            action={`/${lang}/search`}
            className="search-panel__form"
            onSubmit={() => setPanel(null)}
          >
            <SearchIcon size={20} />
            <input
              name="q"
              type="search"
              placeholder={t.searchPlaceholder}
              aria-label={t.search}
              autoFocus
            />
            <button type="button" className="icon-button" aria-label={t.close} onClick={close}>
              <CloseIcon size={20} />
            </button>
          </form>
        </div>
      )}

      <div
        className={`menu ${panel === 'menu' ? 'menu--open' : ''}`}
        aria-hidden={panel !== 'menu'}
      >
        <div className="menu__scrim" onClick={close} />
        <aside className="menu__panel" role="dialog" aria-modal="true" aria-label={t.menu}>
          <div className="menu__top">
            {openSub ? (
              <button type="button" className="menu__back" onClick={() => setSub(null)}>
                <ChevronIcon back /> {t.back}
              </button>
            ) : (
              <span />
            )}
            <button type="button" className="icon-button" aria-label={t.close} onClick={close}>
              <CloseIcon />
            </button>
          </div>

          {openSub ? (
            <nav className="menu__list" key={openSub.brand}>
              <Wordmark brand={openSub.brand} className="menu__mark" />
              <Link href={`/${lang}/${openSub.brand}`} onClick={close} className="menu__item">
                {t.shopAll}
              </Link>
              {openSub.categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/${lang}/${openSub.brand}?category=${c.slug}`}
                  onClick={close}
                  className="menu__item"
                >
                  {c.name}
                </Link>
              ))}
            </nav>
          ) : (
            <nav className="menu__list">
              {menu.map((m) => (
                <button
                  key={m.brand}
                  type="button"
                  className="menu__item"
                  onClick={() => setSub(m.brand)}
                >
                  <span>
                    {brandNames[m.brand]}
                    <small>{m.tagline}</small>
                  </span>
                  <ChevronIcon />
                </button>
              ))}
            </nav>
          )}

          <div className="menu__bottom">
            <Link
              href={langSwitch.href}
              onClick={close}
              hrefLang={langSwitch.other}
              lang={langSwitch.other}
            >
              {t.language}
            </Link>
            {contact.whatsapp && (
              <a
                href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
            )}
            {contact.instagram.map((i) => (
              <a key={i.href} href={i.href} target="_blank" rel="noreferrer">
                {i.label}
              </a>
            ))}
          </div>
        </aside>
      </div>
    </>
  )
}
