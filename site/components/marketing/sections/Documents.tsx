import type { HomepageGlobal } from '@/lib/homepage'

/**
 * Documents — секция §08 (8 trust-cards с photo-превью).
 * Source: newui/homepage-classic.html.
 * Phase 3: контент из Homepage.documents[] с graceful fallback.
 * Photo-превью из admin Media (rel→media). Inline overlay-текст в .doc-overlay
 * — захардкожен по позиции для верности (admin меняет title/meta).
 */

const FALLBACK_DOCS = [
  {
    title: 'СРО · Свидетельство о допуске',
    meta: 'Актуально · ИНГ-РЕГИОН · 1 млрд ₽',
    photo: '/img-generated/doc-sro.jpg',
  },
  {
    title: 'Страховка ответственности',
    meta: 'Актуально · Ингосстрах · 5 млн ₽',
    photo: '/img-generated/doc-insurance.jpg',
  },
  {
    title: 'Сертификаты бригадиров',
    meta: '8 человек · альп. 2-3 разряд',
    photo: '/img-generated/doc-cert-arborist.jpg',
  },
  {
    title: 'ЕГРЮЛ · ООО «Обиход»',
    meta: 'с 2020 · 12 лет на рынке',
    photo: '/img-generated/doc-egryl.jpg',
  },
  {
    title: 'Парк техники',
    meta: '2× автовышки · 4× газели · дробилка',
    photo: '/img-generated/doc-equipment.jpg',
  },
  {
    title: '152-ФЗ · Оператор ПД',
    meta: 'Реестр Роскомнадзора · с 2024',
    photo: '/img-generated/doc-152fz.jpg',
  },
  {
    title: 'Утилизация по 89-ФЗ',
    meta: 'Лицензированный полигон · акты',
    photo: '/img-generated/doc-waste.jpg',
  },
  {
    title: '44/223-ФЗ · Госзакупки',
    meta: 'Аккредитация ЕИС · с 2025',
    photo: '/img-generated/doc-eis.jpg',
  },
]

// Overlay-текст внутри `.doc` — по позиции 0-7, 1:1 из макета
// newui/homepage-classic.html. Стилизация — `.hpc-trust-card .doc
// span:not(.badge-ok)` в `app/homepage-classic.css`. Реквизиты
// (СРО номер, ИНН, страховые суммы) — placeholder-данные до W15
// регистрации юрлица; обновляются здесь, не из admin.
const DOC_OVERLAYS: ReadonlyArray<ReadonlyArray<string>> = [
  ['СВИДЕТЕЛЬСТВО', 'СРО · ИНГ-РЕГИОН', '№ 0042-2026', 'действует до 2027'],
  ['ПОЛИС СТРАХОВАНИЯ', 'ОТВЕТСТВЕННОСТИ', 'ИНГОССТРАХ · 5 МЛН ₽', 'действует до 2027'],
  ['СЕРТИФИКАТ', 'АРБОРИСТ-АЛЬПИНИСТ', '3 РАЗРЯД', 'выдан 2024 · действует'],
  ['ВЫПИСКА ЕГРЮЛ', 'ООО ОБИХОД', 'ИНН 1111111111', 'с 2020 года'],
  ['ПАСПОРТ ТЕХНИКИ', 'АВТОВЫШКА АГП-22', 'ОТВ. ПОДЪЁМА 22 М', 'осмотр 2026'],
  ['СВИДЕТЕЛЬСТВО', 'ОВ-152 ФЗ', 'оператор перс. данных', 'с 2024'],
  ['ДОГОВОР НА УТИЛИЗАЦИЮ', 'ПОЛИГОН ТКО', '«ВТОРРЕСУРС»', 'с актами на каждый вывоз'],
  ['АККРЕДИТАЦИЯ', 'ЕИС ЗАКУПКИ', '44/223-ФЗ', 'с 2025'],
]

const photoUrl = (
  photo: { url?: string; alt?: string } | string | number | null | undefined,
  fallback: string,
): string => {
  if (!photo) return fallback
  if (typeof photo === 'string') return photo
  if (typeof photo === 'object' && photo.url) return photo.url
  return fallback
}

export function Documents({ data }: { data?: HomepageGlobal }) {
  const docs = data?.documents
  const items =
    docs && docs.length > 0
      ? docs.map((d, i) => ({
          title: d.title,
          meta: d.meta,
          photo: photoUrl(d.photo, FALLBACK_DOCS[i]?.photo ?? '/img-generated/doc-sro.jpg'),
        }))
      : FALLBACK_DOCS

  return (
    <section className="hp-section alt">
      <div className="wrap">
        <div className="eyebrow">§ 08 · Доверие · лицензии · СРО · парк техники</div>
        <h2 style={{ maxWidth: '22ch' }}>Документы, которые мы прикрепляем к каждому договору</h2>
        <p className="lead">
          У клиента всегда есть основание спросить «а кто вы?». Ниже — формальные ответы. Все
          документы — в актуальной редакции, по запросу присылаем PDF до подписания договора.
        </p>

        <div className="hpc-trust">
          {items.map((d, i) => (
            <div className="hpc-trust-card" key={i}>
              <div
                className="doc"
                style={{
                  backgroundImage: `url('${d.photo}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center top',
                  minHeight: '120px',
                  position: 'relative',
                }}
              >
                <span className="badge-ok">✓</span>
                <span>
                  {(DOC_OVERLAYS[i] ?? DOC_OVERLAYS[0]).flatMap((line, j, arr) =>
                    j < arr.length - 1 ? [line, <br key={`br-${j}`} />] : [line],
                  )}
                </span>
              </div>
              <h3 className="t">{d.title}</h3>
              <p className="meta">{d.meta}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
