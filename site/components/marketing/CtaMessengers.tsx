import { getSiteChrome, DEFAULT_SITE_CHROME, socialHref, type SocialLink } from '@/lib/chrome'

/**
 * Постоянная плашка «Смета за 10 минут в TG / MAX / WhatsApp».
 * Соответствует immutable из CLAUDE.md: все 4 канала всегда вместе
 * (Telegram, MAX, WhatsApp, телефон). Источник — SiteChrome.social + contacts.
 *
 * Async RSC — читает global. Fallback на DEFAULT_SITE_CHROME не покрывает
 * social[] (seed оставляет пустой массив до первой правки оператором),
 * поэтому на пустом global рендерим только телефон.
 */
export async function CtaMessengers({ className }: { className?: string }) {
  const chrome = await getSiteChrome()
  const social: SocialLink[] = chrome?.social ?? []
  const phoneE164 = chrome?.contacts?.phoneE164 ?? DEFAULT_SITE_CHROME.contacts?.phoneE164 ?? ''
  const phoneDisplay =
    chrome?.contacts?.phoneDisplay ?? DEFAULT_SITE_CHROME.contacts?.phoneDisplay ?? ''

  const findSocial = (type: SocialLink['type']) => social.find((s) => s.type === type)
  const telegram = findSocial('telegram')
  const max = findSocial('max')
  const whatsapp = findSocial('whatsapp')

  return (
    <div className={'rounded-lg border border-orange-200 bg-orange-50 p-5 ' + (className ?? '')}>
      <div className="font-semibold text-stone-900">Смета по 3 фото за 10 минут</div>
      <p className="mt-1 text-sm text-stone-700">
        Пришлите 2–3 фото объекта в любой удобный мессенджер — рассчитаем фиксированную цену.
      </p>
      <div className="mt-3 flex flex-wrap gap-2 text-sm">
        {telegram ? (
          <a
            href={socialHref(telegram)}
            target="_blank"
            rel="noopener"
            className="rounded-full bg-stone-900 px-4 py-2 text-white hover:bg-stone-800"
          >
            Telegram
          </a>
        ) : null}
        {max ? (
          <a
            href={socialHref(max)}
            target="_blank"
            rel="noopener"
            className="rounded-full border border-stone-300 px-4 py-2 text-stone-900 hover:bg-stone-100"
          >
            MAX
          </a>
        ) : null}
        {whatsapp ? (
          <a
            href={socialHref(whatsapp)}
            target="_blank"
            rel="noopener"
            className="rounded-full border border-stone-300 px-4 py-2 text-stone-900 hover:bg-stone-100"
          >
            WhatsApp
          </a>
        ) : null}
        {phoneE164 ? (
          <a
            href={`tel:${phoneE164}`}
            className="rounded-full border border-stone-300 px-4 py-2 text-stone-900 hover:bg-stone-100"
          >
            {phoneDisplay}
          </a>
        ) : null}
      </div>
    </div>
  )
}
