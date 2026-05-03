/**
 * site/lib/telegram/sendMessage.ts
 *
 * Helper для отправки сообщения через Telegram Bot HTTP API.
 *
 * SCAFFOLDING (PAN-9): тонкий stub без runtime-зависимостей. После закрытия
 * PAN-9 (Telegram bot setup, podev) этот файл получит реальную имплементацию.
 *
 * Используется:
 * - Wave 2.B (PAN-11) — magic link login через Telegram (через TelegramChannel)
 * - US-8 Leads pipeline — уведомления оператору о новых заявках
 *
 * Контракт: возвращает { ok: true } или throws TelegramSendError.
 *
 * ENV (заполнить в PAN-9):
 *   TELEGRAM_BOT_TOKEN — токен от @BotFather
 *   TELEGRAM_OPERATOR_CHAT_ID — chat_id оператора (US-8 leads notifications)
 *   (Для magic-link chat_id берётся из Users.telegramChatId)
 */

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
  /** Chat ID оператора (берётся из Users.telegramChatId) */
  chatId: string | number
  /** Текст сообщения. Markdown поддерживается. */
  text: string
  /** parse_mode (default: 'Markdown') */
  parseMode?: 'Markdown' | 'HTML' | 'MarkdownV2'
  /** disable_web_page_preview (default: true для admin notifications) */
  disablePreview?: boolean
}

export async function sendMessage(opts: SendMessageOptions): Promise<{ ok: true }> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) {
    throw new TelegramSendError('TELEGRAM_BOT_TOKEN is not configured')
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`
  const body = {
    chat_id: opts.chatId,
    text: opts.text,
    parse_mode: opts.parseMode ?? 'Markdown',
    disable_web_page_preview: opts.disablePreview ?? true,
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errBody = await res.text().catch(() => '')
    throw new TelegramSendError(`HTTP ${res.status}: ${errBody}`, res.status)
  }

  const data = (await res.json()) as { ok: boolean; description?: string }
  if (!data.ok) {
    throw new TelegramSendError(data.description ?? 'unknown', res.status)
  }

  return { ok: true }
}

// ─── US-8 helpers: lead notifications для оператора ──────────────────────────

/**
 * Минимальный shape лида для форматирования. Совпадает с Payload doc shape
 * (afterChange hook передаёт raw doc до populate, поэтому relationship-поля
 * могут быть либо ID-строкой, либо объектом — обрабатываем оба варианта).
 */
export interface LeadDocLike {
  id?: string | number
  phone?: string | null
  name?: string | null
  service?: string | number | { title?: string; slug?: string } | null
  district?: string | number | { title?: string; slug?: string } | null
  sourcePage?: string | null
  utmSource?: string | null
}

function relationLabel(v: LeadDocLike['service'] | LeadDocLike['district']): string | null {
  if (!v) return null
  if (typeof v === 'string' || typeof v === 'number') return String(v)
  return v.title ?? v.slug ?? null
}

/**
 * Формирует Markdown-сообщение оператору о новой заявке.
 * Sustained brand TOV: «Caregiver+Ruler», deferred-тон, без эмодзи-спама.
 */
export function formatLeadMessage(doc: LeadDocLike): string {
  const lines: string[] = ['*Новая заявка*']
  if (doc.phone) lines.push(`Тел: \`${doc.phone}\``)
  if (doc.name) lines.push(`Имя: ${doc.name}`)
  const service = relationLabel(doc.service)
  if (service) lines.push(`Услуга: ${service}`)
  const district = relationLabel(doc.district)
  if (district) lines.push(`Район: ${district}`)
  if (doc.sourcePage) lines.push(`Страница: ${doc.sourcePage}`)
  if (doc.utmSource) lines.push(`UTM: ${doc.utmSource}`)
  const ts = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })
  lines.push(`Время: ${ts} (MSK)`)
  return lines.join('\n')
}

/**
 * Отправляет уведомление о новом лиде оператору. Безопасно вызывается
 * fire-and-forget из afterChange hook (см. Leads.ts).
 *
 * No-op если TELEGRAM_BOT_TOKEN или TELEGRAM_OPERATOR_CHAT_ID не заданы —
 * это позволяет MVP работать без Telegram (env vars set после PAN-9).
 */
export async function notifyOperatorAboutLead(doc: LeadDocLike): Promise<void> {
  const chatId = process.env.TELEGRAM_OPERATOR_CHAT_ID
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!chatId || !token) {
    // Soft-no-op: env не настроен, лид всё равно сохранён в БД
    console.warn('[lead-telegram-notify] skipped: env vars not configured')
    return
  }
  await sendMessage({ chatId, text: formatLeadMessage(doc) })
}
