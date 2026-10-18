import type { Setting } from '@/payload-types'

import { AnnouncementBar } from './AnnouncementBar'
import { SiteHeader, type MenuBrand } from './HeaderClient'

export function Header({ settings, menu }: { settings: Setting; menu: MenuBrand[] }) {
  const messages = (settings.announcements ?? []).map((a) => a.text).filter(Boolean)
  const instagram = [
    settings.formeInstagram && { label: 'Instagram — Formé', href: settings.formeInstagram },
    settings.sienaInstagram && { label: 'Instagram — Siena', href: settings.sienaInstagram },
  ].filter((i): i is { label: string; href: string } => Boolean(i))

  return (
    <>
      <AnnouncementBar messages={messages} />
      <SiteHeader menu={menu} contact={{ whatsapp: settings.whatsapp, instagram }} />
    </>
  )
}
