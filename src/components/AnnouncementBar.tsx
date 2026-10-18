'use client'

import { useEffect, useState } from 'react'

import { ChevronIcon } from './Icons'
import { useI18n } from './Providers'

export function AnnouncementBar({ messages }: { messages: string[] }) {
  const { t } = useI18n()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = messages.length

  useEffect(() => {
    if (count < 2 || paused) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), 5000)
    return () => clearInterval(timer)
  }, [count, paused])

  if (!count) return null
  const step = (delta: number) => setIndex((i) => (i + delta + count) % count)

  return (
    <div
      className="announcement"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-live="polite"
    >
      {count > 1 && (
        <button
          type="button"
          className="announcement__arrow"
          aria-label={t.previous}
          onClick={() => step(-1)}
        >
          <ChevronIcon size={16} back />
        </button>
      )}
      <p key={index} className="announcement__text">
        {messages[index]}
      </p>
      {count > 1 && (
        <button
          type="button"
          className="announcement__arrow"
          aria-label={t.next}
          onClick={() => step(1)}
        >
          <ChevronIcon size={16} />
        </button>
      )}
    </div>
  )
}
