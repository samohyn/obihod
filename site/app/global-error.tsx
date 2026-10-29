'use client'

import localFont from 'next/font/local'
import './globals.css'

import { ErrorState } from '@/components/blocks/v3/ErrorState'
import { Icon, Wrap } from '@/components/blocks/v3/shared'
import sh from '@/components/blocks/v3/shared.module.css'
import { Logo } from '@/components/chrome/Logo'
import c from '@/components/chrome/chrome.module.css'
import { DEFAULT_COMPANY } from '@/lib/offer'

const golosText = localFont({
  src: './fonts/GolosText-Variable.woff2',
  variable: '--font-golos-text',
  weight: '400 900',
  display: 'swap',
})

const jetbrainsMono = localFont({
  src: './fonts/JetBrainsMono-Variable.woff2',
  variable: '--font-jetbrains-mono',
  weight: '400 500',
  display: 'swap',
})

/**
 * Сбой в самом layout (например, база не ответила на шапку) — brand-guide §11.5, 500. Своего layout
 * здесь нет: шапка упрощённая, телефон — из lib/offer.ts (админка в этот момент может быть недоступна).
 */
export default function GlobalError({
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  const { phoneDisplay, phoneE164 } = DEFAULT_COMPANY
  return (
    <html
      lang="ru"
      className={`${golosText.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <title>Сбой на сайте — Обиход</title>
        <meta name="robots" content="noindex" />
        <header className={c.bar}>
          <Wrap className={c.barRow}>
            <Logo />
            <a
              href={`tel:${phoneE164}`}
              aria-label={`Позвонить: ${phoneDisplay}`}
              className={[sh.btn, sh['btn-ghost'], 'ml-auto'].join(' ')}
            >
              <Icon name="phone" size={20} />
              <span className="hidden sm:inline">{phoneDisplay}</span>
            </a>
          </Wrap>
        </header>
        <main className="flex-1">
          <ErrorState
            illustration="saw"
            code="Ошибка 500"
            title="Сбой на нашей стороне"
            text="Сайт не загрузился из-за ошибки на сервере. Обновите страницу через минуту — обычно этого хватает."
            actions={[{ label: 'Обновить страницу', onClick: retry }]}
            fallback={
              <>
                Заявку примем по телефону <a href={`tel:${phoneE164}`}>{phoneDisplay}</a> или на{' '}
                <a href={`mailto:${DEFAULT_COMPANY.email}`}>{DEFAULT_COMPANY.email}</a>.
              </>
            }
          />
        </main>
      </body>
    </html>
  )
}
