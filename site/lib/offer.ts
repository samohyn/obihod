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
