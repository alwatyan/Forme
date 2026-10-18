import Link from 'next/link'

import type { Dictionary, Locale } from '@/lib/i18n'
import type { Setting } from '@/payload-types'

import { Wordmark } from './Wordmark'

export function Footer({ lang, t, settings }: { lang: Locale; t: Dictionary; settings: Setting }) {
  return (
    <footer className="footer">
      <div className="footer__cols">
        <div>
          <Link href={`/${lang}/forme`} className="footer__brand">
            <Wordmark brand="forme" />
          </Link>
          <p className="muted">{t.formeLine}</p>
          {settings.formeInstagram && (
            <a href={settings.formeInstagram} target="_blank" rel="noreferrer">
              Instagram
            </a>
          )}
        </div>
        <div>
          <Link href={`/${lang}/siena`} className="footer__brand">
            <Wordmark brand="siena" />
          </Link>
          <p className="muted">{t.sienaLine}</p>
          {settings.sienaInstagram && (
            <a href={settings.sienaInstagram} target="_blank" rel="noreferrer">
              Instagram
            </a>
          )}
        </div>
        <div>
          <span className="eyebrow">{t.contact}</span>
          {settings.whatsapp && (
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
          )}
          {settings.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
        </div>
      </div>
      <div className="footer__bottom muted">© {new Date().getFullYear()} Formé · Siena</div>
    </footer>
  )
}
