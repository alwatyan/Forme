'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { isBrand } from '@/lib/brands'

import { useCart, useI18n } from './Providers'
import { Wordmark } from './Wordmark'

/** Shows the logo of the brand being browsed, or both on shared pages. */
export function HeaderLogo() {
  const { lang } = useI18n()
  const section = usePathname().split('/')[2] ?? ''

  if (isBrand(section)) {
    return (
      <Link href={`/${lang}/${section}`} className="header__logo">
        <Wordmark brand={section} />
      </Link>
    )
  }
  return (
    <Link href={`/${lang}`} className="header__logo header__logo--pair">
      <Wordmark brand="forme" />
      <span className="header__divider" />
      <Wordmark brand="siena" />
    </Link>
  )
}

export function LangSwitch() {
  const { lang, t } = useI18n()
  const pathname = usePathname()
  const other = lang === 'ar' ? 'en' : 'ar'
  const href = pathname.replace(/^\/(en|ar)(?=\/|$)/, `/${other}`)
  return (
    <Link href={href} className="header__link" hrefLang={other} lang={other}>
      {t.language}
    </Link>
  )
}

export function CartButton() {
  const { t } = useI18n()
  const { count, open } = useCart()
  return (
    <button type="button" className="header__link" onClick={open}>
      {t.bag} ({count})
    </button>
  )
}
