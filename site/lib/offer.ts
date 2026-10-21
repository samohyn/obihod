/**
 * Компания и оффер без обращения к базе: тип, значения по умолчанию и склонения —
 * можно и в клиентских компонентах (форма). Чтение из админки — lib/company.ts.
 */
/** «Компания и контакты» (globals/Company.ts): контакты, реквизиты, часы и цифры оффера (contex/10_offer.md). */
export interface Company {
  phoneDisplay: string
  phoneE164: string
  email: string
  streetAddress: string
  addressLocality: string
  addressRegion: string
  postalCode: string
  legalName: string
  taxId: string | null
  kpp: string | null
  ogrn: string | null
  /** «08:00» */
  opens: string
  closes: string
  leadsAllDay: boolean
  nightCallbackTime: string
  callbackMinutes: number
  callbackLateDiscountRub: number
  photoEstimateMinutes: number
  emergencyHours: number
  emergencyRadiusKm: number
  freeVisitRadiusKm: number
  arrivalWindowHours: number
  lateArrivalDiscountPercent: number
  snowReactionHours: number
}

export const DEFAULT_COMPANY: Company = {
  phoneDisplay: '+7 (985) 170-51-11',
  phoneE164: '+79851705111',
  email: 'partner@obikhod.ru',
  streetAddress: 'ул. Амет-хан Султана, 15, к1',
  addressLocality: 'Жуковский',
  addressRegion: 'Московская область',
  postalCode: '140185',
  legalName: '',
  taxId: null,
  kpp: null,
  ogrn: null,
  opens: '08:00',
  closes: '22:00',
  leadsAllDay: true,
  nightCallbackTime: '08:15',
  callbackMinutes: 10,
  callbackLateDiscountRub: 500,
  photoEstimateMinutes: 30,
  emergencyHours: 2,
  emergencyRadiusKm: 30,
  freeVisitRadiusKm: 50,
  arrivalWindowHours: 2,
  lateArrivalDiscountPercent: 10,
  snowReactionHours: 6,
}

// ---------- склонения ----------

function plural(n: number, one: string, few: string, many: string): string {
  const n10 = n % 10
  const n100 = n % 100
  if (n10 === 1 && n100 !== 11) return one
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return few
  return many
}

/** «за 10 минут», «за 1 минуту» — винительный падеж после «за», «через». */
export const minutes = (n: number) => `${n} ${plural(n, 'минуту', 'минуты', 'минут')}`
/** «за 2 часа», «за 1 час». */
export const hours = (n: number) => `${n} ${plural(n, 'час', 'часа', 'часов')}`

/** «08:00» → «8:00» — как на сайте. */
export const clock = (hhmm: string) => hhmm.replace(/^0(\d)/, '$1')

/** «Ежедневно 8:00–22:00 · заявки 24/7» — под телефоном в шапке и подвале. */
export function hoursLine(c: Company): string {
  return `Ежедневно ${clock(c.opens)}–${clock(c.closes)}${c.leadsAllDay ? ' · заявки 24/7' : ''}`
}

// ---------- реквизиты ----------

/** Реквизит для сайта: заглушки из единиц («1111111111») не выводятся. */
export function filledRequisite(v: string | null | undefined): string | null {
  const s = v?.trim()
  return s && !/^1+$/.test(s) ? s : null
}

/** «ул. …, Жуковский, Московская область, 140185» */
export const addressLine = (c: Company) =>
  [c.streetAddress, c.addressLocality, c.addressRegion, c.postalCode].filter(Boolean).join(', ')

/** Оператор ПДн в документах: «Обиход, ИНН …, ОГРН …» — реквизиты, если заполнены. */
export function operatorLine(c: Company): string {
  const inn = filledRequisite(c.taxId)
  const ogrn = filledRequisite(c.ogrn)
  return `${c.legalName || 'Обиход'}${inn ? `, ИНН ${inn}` : ''}${ogrn ? `, ОГРН ${ogrn}` : ''}`
}

// ---------- метки в текстах (план 09, этап 4.3b) ----------

const NBSP = ' '
const unit = (n: number, u: string) => `${n}${NBSP}${u}`

/**
 * Метки, которые владелец пишет в текстах документов: на сайте вместо них — значения из
 * «Компания и контакты». Число и единица — через неразрывный пробел, как в текстах.
 */
export const OFFER_TOKENS: { token: string; hint: string; value: (c: Company) => string }[] = [
  {
    token: '{перезвон}',
    hint: 'срок перезвона — «10 минут»',
    value: (c) => minutes(c.callbackMinutes).replace(' ', NBSP),
  },
  { token: '{перезвон, мин}', hint: '«10 мин»', value: (c) => unit(c.callbackMinutes, 'мин') },
  {
    token: '{смета по фото}',
    hint: '«30 минут»',
    value: (c) => minutes(c.photoEstimateMinutes).replace(' ', NBSP),
  },
  {
    token: '{смета по фото, мин}',
    hint: '«30 мин»',
    value: (c) => unit(c.photoEstimateMinutes, 'мин'),
  },
  {
    token: '{аварийный выезд}',
    hint: '«2 часа»',
    value: (c) => hours(c.emergencyHours).replace(' ', NBSP),
  },
  { token: '{аварийный выезд, ч}', hint: '«2 ч»', value: (c) => unit(c.emergencyHours, 'ч') },
  { token: '{аварийная зона}', hint: '«30 км»', value: (c) => unit(c.emergencyRadiusKm, 'км') },
  { token: '{бесплатный выезд}', hint: '«50 км»', value: (c) => unit(c.freeVisitRadiusKm, 'км') },
  {
    token: '{окно приезда}',
    hint: '«2 часа»',
    value: (c) => hours(c.arrivalWindowHours).replace(' ', NBSP),
  },
  { token: '{окно приезда, ч}', hint: '«2 ч»', value: (c) => unit(c.arrivalWindowHours, 'ч') },
  {
    token: '{скидка за опоздание}',
    hint: '«10%»',
    value: (c) => `${c.lateArrivalDiscountPercent}%`,
  },
  {
    token: '{скидка за перезвон}',
    hint: '«500 ₽»',
    value: (c) => unit(c.callbackLateDiscountRub, '₽'),
  },
  {
    token: '{снегопад}',
    hint: '«6 часов»',
    value: (c) => hours(c.snowReactionHours).replace(' ', NBSP),
  },
  { token: '{снегопад, ч}', hint: '«6 ч»', value: (c) => unit(c.snowReactionHours, 'ч') },
  {
    token: '{часы работы}',
    hint: '«8:00–22:00»',
    value: (c) => `${clock(c.opens)}–${clock(c.closes)}`,
  },
  { token: '{телефон}', hint: '«+7 (985) 170-51-11»', value: (c) => c.phoneDisplay },
  {
    token: '{телефон-ссылка}',
    hint: '«+79851705111» — в адрес ссылки: tel:{телефон-ссылка}',
    value: (c) => c.phoneE164,
  },
  {
    token: '{почта}',
    hint: '«partner@obikhod.ru»; в адрес ссылки — mailto:{почта}',
    value: (c) => c.email,
  },
  { token: '{адрес}', hint: '«ул. …, Жуковский, Московская область, 140185»', value: addressLine },
  {
    token: '{оператор}',
    hint: 'для документов ПДн: «Обиход, ИНН …, ОГРН …» — реквизиты, если заполнены',
    value: operatorLine,
  },
]

const TOKEN_RE = /\{[^{}\n]{2,40}\}/g
const KNOWN = new Map(OFFER_TOKENS.map((t) => [t.token, t]))

/** Строка с метками → строка со значениями; неизвестные метки остаются как есть. */
export function fillOffer(text: string, c: Company): string {
  if (!text.includes('{')) return text
  return text.replace(TOKEN_RE, (m) => KNOWN.get(m)?.value(c) ?? m)
}

/** То же по всему документу: все строки, включая тексты внутри форматированного текста. */
export function fillOfferDeep<T>(value: T, c: Company): T {
  if (typeof value === 'string') return fillOffer(value, c) as T
  if (Array.isArray(value)) return value.map((v) => fillOfferDeep(v, c)) as T
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) out[k] = fillOfferDeep(v, c)
    return out as T
  }
  return value
}

/** Метки в фигурных скобках, которых нет в списке (опечатка) — для проверки при сохранении. */
export function unknownOfferTokens(value: unknown): string[] {
  const found = new Set<string>()
  const walk = (v: unknown) => {
    if (typeof v === 'string') {
      for (const m of v.match(TOKEN_RE) ?? []) if (!KNOWN.has(m)) found.add(m)
    } else if (Array.isArray(v)) v.forEach(walk)
    else if (v && typeof v === 'object') Object.values(v).forEach(walk)
  }
  walk(value)
  return [...found]
}
