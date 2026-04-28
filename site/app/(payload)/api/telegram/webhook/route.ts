/**
 * site/app/(payload)/api/telegram/webhook/route.ts
 *
 * Webhook endpoint для Telegram Bot updates (после `/setWebhook` в @BotFather).
 *
 * SCAFFOLDING (PAN-9): обрабатывает /start команду — сохраняет chat_id
 * оператора в Users.telegramChatId. После закрытия PAN-9 + Wave 2.B (PAN-11)
 * этот endpoint enabled.
 *
 * Security:
 * - Verify webhook secret через X-Telegram-Bot-Api-Secret-Token header
 *   (см. https://core.telegram.org/bots/api#setwebhook)
 * - Без secret — 401
 *
 * ENV:
 *   TELEGRAM_BOT_TOKEN
 *   TELEGRAM_WEBHOOK_SECRET — random 256-bit, set при `setWebhook`
 */

import { NextRequest, NextResponse } from 'next/server'
import config from '@/payload.config'
import { getPayload } from 'payload'

interface TelegramUpdate {
  update_id: number
  message?: {
    message_id: number
    from: {
      id: number
      first_name?: string
      last_name?: string
      username?: string
    }
    chat: { id: number; type: string }
    text?: string
  }
}

export async function POST(req: NextRequest) {
  // 1. Verify webhook secret
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET
  if (!expectedSecret) {
    console.error('[telegram/webhook] TELEGRAM_WEBHOOK_SECRET not configured')
    return NextResponse.json(
      { error: { code: 'misconfigured', message: 'Webhook not configured' } },
      { status: 500 },
    )
  }
  const providedSecret = req.headers.get('x-telegram-bot-api-secret-token')
  if (providedSecret !== expectedSecret) {
    return NextResponse.json(
      { error: { code: 'unauthorized', message: 'Invalid webhook secret' } },
      { status: 401 },
    )
  }

  // 2. Parse update
  const update = (await req.json()) as TelegramUpdate
  if (!update.message) {
    return NextResponse.json({ ok: true }) // ignore non-message updates
  }

  const { from, chat, text } = update.message

  // 3. Handle /start command — save chat_id to user
  if (text === '/start') {
    const payload = await getPayload({ config })

    // Lookup user by Telegram username (если @username совпадает с email pattern)
    // или сохранять для всех authenticated users — оператор позже свяжет
    // через admin UI.
    //
    // TODO (PAN-9): решить strategy lookup. Минимум — найти оператора через
    // Users.email = process.env.OPERATOR_EMAIL и сохранить его chat_id.
    const operatorEmail = process.env.OPERATOR_EMAIL
    if (operatorEmail) {
      const users = await payload.find({
        collection: 'users',
        where: { email: { equals: operatorEmail } },
        limit: 1,
      })
      const user = users.docs[0]
      if (user) {
        await payload.update({
          collection: 'users',
          id: user.id,
          data: { telegramChatId: String(chat.id) } as Record<string, unknown>,
        })
      }
    }

    // Send greeting back through bot (через sendMessage helper)
    // TODO (PAN-9): import sendMessage и отправить «Привет, готов получать ссылки.»
  }

  // 4. Always 200 to acknowledge (Telegram retries on non-2xx)
  return NextResponse.json({ ok: true })
}
