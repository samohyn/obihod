/**
 * Шапка и подвал C4 в «Шапка, подвал и контакты» (план 09, этап 2) — начальное наполнение.
 *
 *   pnpm seed:chrome
 *
 * Заполняет только пустое: меню, «Ещё в мобильном меню», полосу над шапкой, колонки подвала,
 * текст под логотипом, режим работы; старую кнопку-якорь «Замер бесплатно» меняет на «Смета по фото».
 * Правки владельца не трогает — повторный запуск ничего не меняет. Значения — DEFAULT_CHROME_VIEW.
 */
import { getPayload } from 'payload'

import { DEFAULT_CHROME_VIEW, type SiteChrome } from '../lib/chrome'
import config from '../payload.config.js'

async function main() {
  const payload = await getPayload({ config })
  const chrome = (await payload.findGlobal({ slug: 'site-chrome', depth: 0 })) as SiteChrome
  const d = DEFAULT_CHROME_VIEW
  const header: Record<string, unknown> = {}
  const footer: Record<string, unknown> = {}
  const contacts: Record<string, unknown> = {}

  if (!chrome.header?.nav?.length) header.nav = d.nav
  if (!chrome.header?.mobileExtra?.length) header.mobileExtra = d.mobileExtra
  if (!chrome.header?.utility?.length) header.utility = d.utility
  if (!chrome.header?.cta?.kind || chrome.header.cta.kind === 'anchor') {
    header.cta = { label: d.cta.label, kind: 'route', route: d.cta.href }
  }
  if (!chrome.footer?.slogan?.trim()) footer.slogan = d.footerAbout
  if (!chrome.footer?.nav?.length) footer.nav = d.footerNav
  if (!chrome.contacts?.hours?.trim()) contacts.hours = d.hours

  const data: Record<string, unknown> = {}
  if (Object.keys(header).length) data.header = { ...chrome.header, ...header }
  if (Object.keys(footer).length) data.footer = { ...chrome.footer, ...footer }
  if (Object.keys(contacts).length) data.contacts = { ...chrome.contacts, ...contacts }

  const filled = [...Object.keys(header), ...Object.keys(footer), ...Object.keys(contacts)]
  if (filled.length === 0) {
    console.log('[seed:chrome] всё уже заполнено — ничего не меняю')
    process.exit(0)
  }
  await payload.updateGlobal({ slug: 'site-chrome', data: data as never })
  console.log(`[seed:chrome] заполнено: ${filled.join(', ')}`)
  process.exit(0)
}

main().catch((e) => {
  console.error('[seed:chrome] ошибка:', e instanceof Error ? e.message : e)
  process.exit(1)
})
