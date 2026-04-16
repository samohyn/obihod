/**
 * Постоянная плашка «Смета за 10 минут в TG / MAX / WhatsApp».
 * Соответствует immutable из CLAUDE.md: три мессенджера всегда вместе.
 */
export function CtaMessengers({ className }: { className?: string }) {
  return (
    <div
      className={
        'rounded-lg border border-orange-200 bg-orange-50 p-5 ' + (className ?? '')
      }
    >
      <div className="font-semibold text-stone-900">
        Смета по 3 фото за 10 минут
      </div>
      <p className="mt-1 text-sm text-stone-700">
        Пришлите 2–3 фото объекта в любой удобный мессенджер — рассчитаем
        фиксированную цену.
      </p>
      <div className="mt-3 flex flex-wrap gap-2 text-sm">
        <a
          href="https://t.me/obikhod"
          className="rounded-full bg-stone-900 px-4 py-2 text-white hover:bg-stone-800"
        >
          Telegram
        </a>
        <a
          href="https://max.ru/obikhod"
          className="rounded-full border border-stone-300 px-4 py-2 text-stone-900 hover:bg-stone-100"
        >
          MAX
        </a>
        <a
          href="https://wa.me/74950000000"
          className="rounded-full border border-stone-300 px-4 py-2 text-stone-900 hover:bg-stone-100"
        >
          WhatsApp
        </a>
        <a
          href="tel:+74950000000"
          className="rounded-full border border-stone-300 px-4 py-2 text-stone-900 hover:bg-stone-100"
        >
          +7 495 000-00-00
        </a>
      </div>
    </div>
  )
}
