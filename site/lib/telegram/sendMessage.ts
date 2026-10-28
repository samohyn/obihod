/**
 * Уведомление менеджеру в Telegram о новой заявке (бот @OBIHODLEADBOT).
 *
 * С VPS в РФ api.telegram.org недоступен (таймаут, проверено 28.10.2026), поэтому на проде
 * сообщение уходит через очередь: сайт кладёт файл в `TELEGRAM_OUTBOX_DIR`, systemd
 * (`deploy/telegram/`) пушит его в закрытый репозиторий-ретранслятор, а GitHub Actions
 * отправляет в Telegram. Без `TELEGRAM_OUTBOX_DIR` — прямой запрос к Bot API (локально и там,
 * где Telegram доступен).
 *
 * 152-ФЗ: серверы Telegram и GitHub за рубежом, поэтому телефон, имя, почту и текст задачи в
 * сообщение НЕ кладём — иначе это трансграничная передача ПДн (ст. 12, уведомление РКН).
 * Менеджер открывает заявку в админке по ссылке. Политика на сайте обещает, что передачи за рубеж нет.
 *
 * ENV: TELEGRAM_OUTBOX_DIR — очередь (прод); иначе TELEGRAM_BOT_TOKEN + TELEGRAM_OPERATOR_CHAT_ID.
 */
import { randomUUID } from 'node:crypto'
import { rename, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import type { Payload } from 'payload'

import { formatClockMsk } from '@/lib/leads/sla'
import { leadCardUrl, relationLabel } from '@/lib/leads/notifyEmail'

export class TelegramSendError extends Error {
  constructor(
    public reason: string,
    public statusCode?: number,
  ) {
    super(`Telegram send failed: ${reason}`)
    this.name = 'TelegramSendError'
  }
}

export interface SendMessageOptions {
  chatId: string | number
  /** Обычный текст, без разметки: названия услуг и районов не ломают отправку. */
  text: string
  disablePreview?: boolean
}

export async function sendMessage(opts: SendMessageOptions): Promise<{ ok: true }> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) throw new TelegramSendError('TELEGRAM_BOT_TOKEN is not configured')

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: opts.chatId,
      text: opts.text,
      disable_web_page_preview: opts.disablePreview ?? true,
    }),
  })
  if (!res.ok) {
    const errBody = await res.text().catch(() => '')
    throw new TelegramSendError(`HTTP ${res.status}: ${errBody}`, res.status)
  }
  const data = (await res.json()) as { ok: boolean; description?: string }
  if (!data.ok) throw new TelegramSendError(data.description ?? 'unknown', res.status)
  return { ok: true }
}

/** Поля заявки, которые нужны уведомлению. Связи — id или объект (afterChange до populate). */
export interface LeadDocLike {
  id?: string | number
  service?: number | string | { title?: string | null } | null
  district?: number | string | { nameNominative?: string | null } | null
  sourcePage?: string | null
  replyDueAt?: string | null
  photoFiles?: unknown[] | null
}

export interface LeadLabels {
  service?: string | null
  district?: string | null
}

/** Текст уведомления — без телефона, имени, почты и описания задачи (152-ФЗ, см. шапку). */
export function formatLeadMessage(doc: LeadDocLike, labels: LeadLabels = {}): string {
  const lines = [doc.id ? `Новая заявка № ${doc.id}` : 'Новая заявка']
  if (doc.replyDueAt) lines.push(`Ответить до ${formatClockMsk(new Date(doc.replyDueAt))} (МСК)`)
  if (labels.service) lines.push(`Услуга: ${labels.service}`)
  if (labels.district) lines.push(`Район: ${labels.district}`)
  const photos = doc.photoFiles?.length ?? 0
  if (photos) lines.push(`Фото: ${photos}`)
  if (doc.sourcePage) lines.push(`Страница: ${doc.sourcePage}`)
  if (doc.id) lines.push(`Открыть: ${leadCardUrl(doc.id)}`)
  return lines.join('\n')
}

/** Файл в очередь: сначала временный, потом переименование — ретранслятор не увидит недописанный. */
async function enqueue(dir: string, text: string, id: string | number | undefined) {
  const name = `${new Date().toISOString().replace(/[:.]/g, '-')}-lead-${id ?? randomUUID()}.json`
  const tmp = join(dir, `.${name}.tmp`)
  await writeFile(tmp, JSON.stringify({ text }), 'utf8')
  await rename(tmp, join(dir, name))
}

/**
 * Уведомление о новой заявке. Fire-and-forget из afterChange (Leads.ts): заявка уже сохранена,
 * сбой Telegram её не теряет — основной канал остаётся почта.
 */
export async function notifyOperatorAboutLead(doc: LeadDocLike, payload?: Payload): Promise<void> {
  const outbox = process.env.TELEGRAM_OUTBOX_DIR
  const chatId = process.env.TELEGRAM_OPERATOR_CHAT_ID
  if (!outbox && !(chatId && process.env.TELEGRAM_BOT_TOKEN)) {
    console.warn('[lead-telegram-notify] skipped: TELEGRAM_OUTBOX_DIR / bot env not configured')
    return
  }
  const [service, district] = payload
    ? await Promise.all([
        relationLabel(payload, 'services', doc.service),
        relationLabel(payload, 'districts', doc.district),
      ])
    : [null, null]
  const text = formatLeadMessage(doc, { service, district })
  if (outbox) await enqueue(outbox, text, doc.id)
  else await sendMessage({ chatId: chatId!, text })
}
