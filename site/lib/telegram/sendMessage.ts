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
 *   (chat_id берётся из аргументов / Users.telegramChatId)
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
