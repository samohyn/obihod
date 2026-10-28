'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState, useSyncExternalStore } from 'react'

import { COOKIE_SETTINGS_EVENT, CONSENT_COOKIE, goal } from '@/lib/analytics/goal'
import { PRIVACY_URL } from '@/lib/legal'

import s from './AnalyticsConsent.module.css'

/**
 * Яндекс Метрика только по согласию (план 09, этап 7; brand-guide «Баннер о cookie»; сверено с
 * Perplexity 26.10.2026). Нет номера счётчика — нет ни баннера, ни Метрики. До выбора посетителя
 * счётчик не загружается; выбор — cookie на год, изменить — «Настройки cookie» в подвале.
 */

type Choice = 'analytics' | 'necessary'

function readChoice(): Choice | null {
  const m = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=(analytics|necessary)`))
  return (m?.[1] as Choice | undefined) ?? null
}

const CHANGE = 'obikhod:consent-change'

function saveChoice(choice: Choice) {
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${CONSENT_COOKIE}=${choice}; Max-Age=31536000; Path=/; SameSite=Lax${secure}`
  window.dispatchEvent(new Event(CHANGE))
}

const subscribe = (cb: () => void) => {
  window.addEventListener(CHANGE, cb)
  return () => window.removeEventListener(CHANGE, cb)
}

let loaded = false
/** Адрес последнего учтённого просмотра — чтобы не отправить один переход дважды. */
let lastUrl: string | null = null

function loadMetrika(id: number) {
  if (loaded) return
  loaded = true
  // очередь вызовов — как в официальном коде счётчика: tag.js забирает её после загрузки
  const w = window as Window & {
    ym?: ((...args: unknown[]) => void) & { a?: IArguments[]; l?: number }
    __obikhodYm?: number
  }
  w.ym =
    w.ym ??
    function (this: unknown) {
      // eslint-disable-next-line prefer-rest-params -- формат очереди Метрики — объекты arguments
      ;(w.ym!.a = w.ym!.a ?? []).push(arguments)
    }
  w.ym.l = Date.now()
  w.__obikhodYm = id
  const script = document.createElement('script')
  script.async = true
  script.src = `https://mc.yandex.ru/metrika/tag.js?id=${id}`
  document.head.appendChild(script)
  // параметры — как в коде счётчика из кабинета Метрики; Вебвизор — только после согласия,
  // содержимое полей форм не записывается
  lastUrl = location.href
  w.ym(id, 'init', {
    ssr: true,
    webvisor: true,
    clickmap: true,
    ecommerce: 'dataLayer',
    referrer: document.referrer,
    url: location.href,
    accurateTrackBounce: true,
    trackLinks: true,
  })
}

/**
 * Переход внутри сайта (Next меняет адрес без перезагрузки) — Метрика сама его не видит
 * (проверено на проде 28.10.2026), поэтому просмотр отправляем вручную, один раз на переход.
 */
function hit(id: number) {
  const url = location.href
  if (!loaded || url === lastUrl) return
  const referer = lastUrl ?? document.referrer
  lastUrl = url
  ;(window as Window & { ym?: (...args: unknown[]) => void }).ym?.(id, 'hit', url, {
    referer,
    title: document.title,
  })
}

/** Клик по телефону и почте — цели «звонок» и «почта». */
function onClick(e: MouseEvent) {
  const a = (e.target as Element | null)?.closest?.('a[href]')
  const href = a?.getAttribute('href') ?? ''
  if (href.startsWith('tel:')) goal('phone_click')
  else if (href.startsWith('mailto:')) goal('email_click')
}

export function AnalyticsConsent({ counterId }: { counterId: number | null }) {
  // до гидрации выбора не знаем — баннер не рисуем, чтобы разметка сервера и браузера совпала
  const choice = useSyncExternalStore(
    subscribe,
    () => readChoice() ?? 'none',
    () => 'pending',
  )
  const [settings, setSettings] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (!counterId) return
    if (choice === 'analytics') loadMetrika(counterId)
  }, [counterId, choice])

  useEffect(() => {
    if (counterId && choice === 'analytics') hit(counterId)
  }, [counterId, choice, pathname])

  useEffect(() => {
    if (!counterId) return
    const reopen = () => setSettings(true)
    window.addEventListener(COOKIE_SETTINGS_EVENT, reopen)
    document.addEventListener('click', onClick)
    return () => {
      window.removeEventListener(COOKIE_SETTINGS_EVENT, reopen)
      document.removeEventListener('click', onClick)
    }
  }, [counterId])

  if (!counterId || (choice !== 'none' && !settings)) return null

  const choose = (choice: Choice) => {
    saveChoice(choice)
    setSettings(false)
    // отказ после согласия — перезагрузка, чтобы уже загруженный счётчик выгрузился
    if (choice === 'necessary' && loaded) location.reload()
  }

  return (
    <section className={s.banner} role="region" aria-label="Cookie и статистика">
      <p className={s.text}>
        Сайт использует необходимые cookie. С вашего согласия включим Яндекс Метрику — она покажет,
        какие страницы полезны. Подробнее — в{' '}
        <Link href={PRIVACY_URL}>политике конфиденциальности</Link>.
      </p>
      <div className={s.actions}>
        <button type="button" className={s.primary} onClick={() => choose('analytics')}>
          Принять аналитику
        </button>
        <button type="button" className={s.ghost} onClick={() => choose('necessary')}>
          Только необходимые
        </button>
      </div>
    </section>
  )
}

/** «Настройки cookie» в подвале — снова показывает выбор. */
export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className ?? s.link}
      onClick={() => window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT))}
    >
      Настройки cookie
    </button>
  )
}
