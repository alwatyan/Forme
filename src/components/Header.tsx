import Link from 'next/link'

import type { Dictionary, Locale } from '@/lib/i18n'

import { CartButton, HeaderLogo, LangSwitch } from './HeaderClient'

export function Header({
  lang,
  t,
  announcement,
}: {
  lang: Locale
  t: Dictionary
  announcement?: string | null
}) {
  return (
    <>
      {announcement && <div className="announcement">{announcement}</div>}
      <header className="header">
        <nav className="header__side" aria-label="Main">
          <details className="header__menu">
            <summary className="header__link">{t.menu}</summary>
            <div className="header__menu-panel">
              <Link href={`/${lang}/forme`}>Formé — {t.formeLine}</Link>
              <Link href={`/${lang}/siena`}>Siena — {t.sienaLine}</Link>
            </div>
          </details>
          <Link href={`/${lang}/forme`} className="header__link header__desktop">
            Formé
          </Link>
          <Link href={`/${lang}/siena`} className="header__link header__desktop">
            Siena
          </Link>
        </nav>
        <HeaderLogo />
        <div className="header__side header__side--end">
          <LangSwitch />
          <CartButton />
        </div>
      </header>
    </>
  )
}
