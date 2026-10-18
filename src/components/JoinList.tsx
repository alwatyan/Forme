'use client'

import { useActionState, useEffect, useState } from 'react'

import { subscribe, type SubscribeState } from '@/lib/subscribe'

import { CloseIcon } from './Icons'
import { useI18n } from './Providers'

const DISMISSED_KEY = 'forme-siena-join-dismissed'

/** The floating “Join the list” button and its sign-up form. */
export function JoinList() {
  const { lang, t } = useI18n()
  const [visible, setVisible] = useState(false)
  const [open, setOpen] = useState(false)
  const [state, action, pending] = useActionState<SubscribeState, FormData>(subscribe, {
    status: 'idle',
  })

  // Whether it was dismissed is stored in the browser, so it is only known after the first render.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    let dismissed = false
    try {
      dismissed = localStorage.getItem(DISMISSED_KEY) === '1'
    } catch {
      // Storage unavailable: show the button.
    }
    setVisible(!dismissed)
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  const dismiss = () => {
    setVisible(false)
    setOpen(false)
    try {
      localStorage.setItem(DISMISSED_KEY, '1')
    } catch {
      // Ignore; it will show again next visit.
    }
  }

  if (!visible) return null

  return (
    <>
      {!open && (
        <div className="join">
          <button type="button" className="join__close" aria-label={t.close} onClick={dismiss}>
            <CloseIcon size={14} />
          </button>
          <button type="button" className="join__button" onClick={() => setOpen(true)}>
            {t.joinList}
          </button>
        </div>
      )}
      {open && (
        <div className="join-modal" role="dialog" aria-modal="true" aria-label={t.joinList}>
          <div className="join-modal__scrim" onClick={() => setOpen(false)} />
          <div className="join-modal__card">
            <button
              type="button"
              className="icon-button join-modal__x"
              aria-label={t.close}
              onClick={() => setOpen(false)}
            >
              <CloseIcon size={20} />
            </button>
            <h2 className="section-title">{t.joinList}</h2>
            {state.status === 'done' ? (
              <p>{t.subscribed}</p>
            ) : (
              <>
                <p className="muted">{t.joinListText}</p>
                <form action={action} className="join-modal__form">
                  <input type="hidden" name="lang" value={lang} />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder={t.emailPlaceholder}
                    aria-label={t.emailPlaceholder}
                    autoComplete="email"
                    dir="ltr"
                  />
                  <button type="submit" className="button" disabled={pending}>
                    {t.subscribe}
                  </button>
                </form>
                {state.status === 'invalid' && <p className="error-text">{t.invalidEmail}</p>}
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
