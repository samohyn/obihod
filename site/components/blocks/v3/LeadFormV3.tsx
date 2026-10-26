'use client'

// Форма заявки → POST /api/leads (план 09, этапы 2 и 5; brand-guide «LeadForm полная»).
// Обязательны телефон и отдельный неотмеченный чекбокс согласия (152-ФЗ, сервер проверяет его
// сам); фото, описание задачи, адрес и имя — по кнопке «Добавить фото и описание» (совет
// Perplexity: одна короткая форма с раскрытием вместо трёх разных). Фото сжимаем в браузере
// до 2000 px — с телефона уходит быстрее; сервер всё равно проверяет и перекодирует.
// Пять состояний: ожидание, ошибка поля, отправка с процентом загрузки, успех, ошибка сервера
// (введённое сохраняется, можно отправить ещё раз).

import { goal } from '@/lib/analytics/goal'
import Link from 'next/link'
import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent } from 'react'

import { CALC_EVENT } from '@/lib/leads/calcEvent'
import { callbackDeadline, type CallbackRule } from '@/lib/leads/callbackDeadline'
import { normalizePhone } from '@/lib/leads/phone'
import { DEFAULT_COMPANY } from '@/lib/offer'

import { Icon } from './shared'
import s from './FinalForm.module.css'

const MAX_PHOTOS = 5
const MAX_BYTES = 10 * 1024 * 1024
const SIDE = 2000

type Shot = { key: string; file: Blob; url: string; error?: string }
type Field = 'phone' | 'consent' | 'message' | 'address' | 'name' | 'photos'

async function shrink(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' })
  const k = Math.min(1, SIDE / Math.max(bmp.width, bmp.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bmp.width * k)
  canvas.height = Math.round(bmp.height * k)
  canvas.getContext('2d')?.drawImage(bmp, 0, 0, canvas.width, canvas.height)
  bmp.close()
  return await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob'))), 'image/jpeg', 0.85),
  )
}

/** Сжать или оставить как есть; не открылось (HEIC в Chrome) — ошибка у фото. */
async function prepare(file: File): Promise<Shot> {
  const key = `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`
  try {
    const blob = await shrink(file)
    return { key, file: blob, url: URL.createObjectURL(blob) }
  } catch {
    const plain = /^image\/(jpeg|png|webp)$/.test(file.type) && file.size <= MAX_BYTES
    return plain
      ? { key, file, url: URL.createObjectURL(file) }
      : { key, file, url: '', error: 'Не открылось — сохраните фото как JPG' }
  }
}

export function LeadFormV3({
  title,
  source,
  phoneDisplay,
  callback = DEFAULT_COMPANY,
  photoMinutes = DEFAULT_COMPANY.photoEstimateMinutes,
  openDetails = false,
}: {
  title: string
  source: string
  phoneDisplay: string
  /** Часы и срок перезвона — из «Компания и контакты» */
  callback?: CallbackRule
  /** Смета по фото, минут — из «Компания и контакты» */
  photoMinutes?: number
  /** Фото и описание открыты сразу (страница «Фото → смета») */
  openDetails?: boolean
}) {
  const uid = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const [phone, setPhone] = useState('')
  const [consent, setConsent] = useState(false)
  const [details, setDetails] = useState(openDetails)
  const [message, setMessage] = useState('')
  const [address, setAddress] = useState('')
  const [name, setName] = useState('')
  const [shots, setShots] = useState<Shot[]>([])
  const [honeypot, setHoneypot] = useState('')
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [formError, setFormError] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [progress, setProgress] = useState(0)
  const [sent, setSent] = useState<{ id: string; deadline: string; photos: number } | null>(null)

  // Калькулятор → описание заявки (если клиент ещё ничего не написал)
  useEffect(() => {
    const onCalc = (e: Event) => {
      const text = (e as CustomEvent<string>).detail
      if (!text) return
      setMessage((m) => m || text)
      setDetails(true)
    }
    window.addEventListener(CALC_EVENT, onCalc)
    return () => window.removeEventListener(CALC_EVENT, onCalc)
  }, [])

  // превью фото живут, пока они в форме
  const shotsRef = useRef(shots)
  useEffect(() => {
    shotsRef.current = shots
  }, [shots])
  useEffect(() => () => shotsRef.current.forEach((x) => x.url && URL.revokeObjectURL(x.url)), [])

  const addPhotos = async (e: ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []).slice(0, MAX_PHOTOS - shots.length)
    e.target.value = ''
    if (!picked.length) return
    const ready = await Promise.all(picked.map(prepare))
    setShots((prev) => [...prev, ...ready].slice(0, MAX_PHOTOS))
    setErrors((x) => ({ ...x, photos: undefined }))
  }

  /** Клиент поправил поле — его ошибка и сводка «проверьте поля» уходят. */
  const clear = (f: Field) => {
    setErrors((x) => (x[f] ? { ...x, [f]: undefined } : x))
    setFormError((m) => (m.startsWith('Проверьте') ? '' : m))
  }

  const removeShot = (key: string) =>
    setShots((prev) => {
      const gone = prev.find((x) => x.key === key)
      if (gone?.url) URL.revokeObjectURL(gone.url)
      return prev.filter((x) => x.key !== key)
    })

  const focusFirst = (bad: Partial<Record<Field, string>>) => {
    const first = (['phone', 'consent', 'message', 'address', 'name'] as const).find((f) => bad[f])
    if (first) formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus()
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const bad: Partial<Record<Field, string>> = {}
    if (!normalizePhone(phone)) bad.phone = 'Укажите телефон: 10 цифр после +7'
    if (!consent) bad.consent = 'Отметьте согласие на обработку персональных данных'
    setErrors(bad)
    setFormError('')
    if (Object.keys(bad).length) {
      focusFirst(bad)
      return
    }

    const good = shots.filter((x) => !x.error)
    const fd = new FormData()
    const utm = new URLSearchParams(window.location.search)
    const put = (k: string, v: string | null | undefined) => v && fd.append(k, v)
    put('phone', phone)
    put('consent', 'true')
    put('name', name.trim())
    put('message', message.trim())
    put('address', address.trim())
    put('source', source)
    put('sourcePage', window.location.pathname)
    put('utmSource', utm.get('utm_source'))
    put('utmMedium', utm.get('utm_medium'))
    put('utmCampaign', utm.get('utm_campaign'))
    put('email_url', honeypot)
    good.forEach((x, i) => fd.append('photos', x.file, `photo-${i + 1}.jpg`))

    setStatus('sending')
    setProgress(0)
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/leads/')
    xhr.responseType = 'json'
    xhr.upload.onprogress = (ev) => ev.lengthComputable && setProgress(ev.loaded / ev.total)
    const fail = (text: string) => {
      setFormError(text)
      setStatus('idle')
    }
    xhr.onerror = () =>
      fail('Нет связи с сервером. Проверьте интернет и отправьте ещё раз или позвоните')
    xhr.onload = () => {
      const body = (xhr.response ?? {}) as {
        id?: string | number
        details?: { field: string; message: string; index?: number }[]
      }
      if (xhr.status === 201) {
        setSent({
          id: String(body.id ?? ''),
          deadline: callbackDeadline(new Date(), callback),
          photos: good.length,
        })
        goal('lead_sent')
        setStatus('sent')
        return
      }
      if (xhr.status === 400 && body.details?.length) {
        const next: Partial<Record<Field, string>> = {}
        for (const d of body.details) {
          if (d.field === 'photos' && typeof d.index === 'number' && d.index >= 0) {
            const target = good[d.index]
            if (target)
              setShots((prev) =>
                prev.map((x) => (x.key === target.key ? { ...x, error: d.message } : x)),
              )
          } else next[d.field as Field] = d.message
        }
        setErrors(next)
        focusFirst(next)
        fail('Проверьте отмеченные поля')
        return
      }
      fail(
        xhr.status === 429
          ? 'Слишком много заявок подряд. Попробуйте через минуту или позвоните'
          : 'Не удалось отправить заявку. Отправьте ещё раз или позвоните',
      )
    }
    xhr.send(fd)
  }

  if (status === 'sent' && sent) {
    return (
      <div className={s.card} role="status" aria-live="polite">
        <div className={s.sent}>
          <Icon name="checkCircle" size={40} />
          <b>Заявка{sent.id ? ` № ${sent.id}` : ''} принята</b>
          <p>
            Перезвоним до <span className={s.mono}>{sent.deadline}</span>.
            {sent.photos > 0
              ? ` Фото у менеджера — смету по ним пришлём за ${photoMinutes} минут.`
              : ' Обсудим задачу по телефону; если есть фото — менеджер подскажет, куда прислать.'}
          </p>
        </div>
      </div>
    )
  }

  const sending = status === 'sending'
  const err = (f: Field) =>
    errors[f] ? (
      <span id={`${uid}-${f}-err`} className={s.fieldError}>
        {errors[f]}
      </span>
    ) : null
  const describe = (f: Field) => (errors[f] ? `${uid}-${f}-err` : undefined)
  // сводка над кнопкой: ошибка отправки, согласие (у чекбокса своей подписи нет) или «проверьте поля»
  const summary =
    formError ||
    errors.consent ||
    (Object.values(errors).some(Boolean) ? 'Проверьте отмеченные поля' : '')

  // ym-hide-content — Вебвизор Метрики не показывает в записях, что вводит посетитель
  return (
    <form
      ref={formRef}
      className={`${s.card} ym-hide-content`}
      onSubmit={onSubmit}
      noValidate
      aria-busy={sending}
    >
      <div className={s.cardHead}>
        <b>{title}</b>
        <span>ответ за {callback.callbackMinutes} мин</span>
      </div>

      <div className={s.field}>
        <label htmlFor={`${uid}-phone`}>
          Телефон <span aria-hidden>*</span>
        </label>
        <input
          id={`${uid}-phone`}
          data-field="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+7 (___) ___-__-__"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value)
            clear('phone')
          }}
          aria-required
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={describe('phone')}
        />
        {err('phone')}
      </div>

      <button
        type="button"
        className={s.more}
        aria-expanded={details}
        aria-controls={`${uid}-details`}
        onClick={() => setDetails((d) => !d)}
      >
        <Icon name="camera" size={20} />
        <span>
          <b>Фото и описание задачи</b>
          <small>необязательно · смета по фото за {photoMinutes} мин</small>
        </span>
        <span className={s.moreChevron} aria-hidden>
          <Icon name="chevron" size={18} />
        </span>
      </button>

      <div id={`${uid}-details`} className={s.details} hidden={!details}>
        <div className={s.field}>
          <span className={s.fieldLabel} id={`${uid}-photos-label`}>
            Фото объекта — до {MAX_PHOTOS}
          </span>
          {shots.length > 0 && (
            <ul className={s.shots} aria-labelledby={`${uid}-photos-label`}>
              {shots.map((x, i) => (
                <li key={x.key} className={x.error ? s.shotBad : undefined}>
                  {x.url ? (
                    // eslint-disable-next-line @next/next/no-img-element -- превью из blob:, next/image не нужен
                    <img src={x.url} alt={`Фото ${i + 1}`} />
                  ) : (
                    <span className={s.shotStub} aria-hidden>
                      <Icon name="image" size={22} />
                    </span>
                  )}
                  <button
                    type="button"
                    className={s.shotRemove}
                    onClick={() => removeShot(x.key)}
                    aria-label={`Убрать фото ${i + 1}`}
                    disabled={sending}
                  >
                    ×
                  </button>
                  {x.error && <span className={s.shotError}>{x.error}</span>}
                </li>
              ))}
            </ul>
          )}
          {shots.length < MAX_PHOTOS && (
            <label className={s.photoPick}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={addPhotos}
                disabled={sending}
                className={s.visuallyHidden}
              />
              <Icon name="upload" size={20} />
              {shots.length ? 'Добавить ещё фото' : 'Прикрепить фото'}
            </label>
          )}
          <span className={s.hint}>
            Участок или объект целиком и крупно — то, что нужно сделать
          </span>
        </div>
        <div className={s.field}>
          <label htmlFor={`${uid}-message`}>Что нужно сделать</label>
          <textarea
            id={`${uid}-message`}
            data-field="message"
            rows={3}
            maxLength={2000}
            placeholder="Например: спилить две берёзы у забора и вывезти ветки"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={describe('message')}
          />
          {err('message')}
        </div>
        <div className={s.pair}>
          <div className={s.field}>
            <label htmlFor={`${uid}-address`}>Адрес или район</label>
            <input
              id={`${uid}-address`}
              data-field="address"
              type="text"
              autoComplete="street-address"
              maxLength={200}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              aria-invalid={Boolean(errors.address)}
              aria-describedby={describe('address')}
            />
            {err('address')}
          </div>
          <div className={s.field}>
            <label htmlFor={`${uid}-name`}>Как к вам обращаться</label>
            <input
              id={`${uid}-name`}
              data-field="name"
              type="text"
              autoComplete="given-name"
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={describe('name')}
            />
            {err('name')}
          </div>
        </div>
      </div>

      <input
        className={s.hp}
        type="text"
        name="email_url"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
      />
      <button type="submit" className={s.submit} disabled={sending}>
        {sending
          ? shots.some((x) => !x.error)
            ? `Отправляем фото… ${Math.round(progress * 100)}%`
            : 'Отправляем…'
          : 'Получить смету'}
        {!sending && <Icon name="arrow" size={18} />}
      </button>
      {sending && (
        <span className={s.progress} aria-hidden>
          <span style={{ width: `${Math.round(progress * 100)}%` }} />
        </span>
      )}
      <label className={s.consent}>
        <input
          type="checkbox"
          data-field="consent"
          checked={consent}
          onChange={(e) => {
            setConsent(e.target.checked)
            clear('consent')
          }}
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={errors.consent ? `${uid}-summary` : undefined}
        />
        <span>
          Согласен на обработку персональных данных в соответствии с{' '}
          <Link href="/soglasie-na-obrabotku-personalnyh-dannyh/">согласием</Link> и{' '}
          <Link href="/politika-konfidentsialnosti/">политикой конфиденциальности</Link>
        </span>
      </label>
      {summary && (
        <p id={`${uid}-summary`} className={s.error} role="alert">
          {summary}
          {formError && !formError.startsWith('Проверьте') && (
            <>
              {': '}
              <a href={`tel:${phoneDisplay.replace(/[^\d+]/g, '')}`} className={s.errorCall}>
                {phoneDisplay}
              </a>
            </>
          )}
        </p>
      )}
    </form>
  )
}
