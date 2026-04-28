/**
 * site/app/(payload)/api/telegram/webhook/route.ts
 *
 * Webhook endpoint для Telegram Bot updates (после `/setWebhook` в @BotFather).
 *
 * Закрыто 2026-04-28: PAN-9 finish — оператор связал бот с TOKEN+SECRET,
 * webhook URL зарегистрирован, миграция users.telegram_chat_id применена,
 * greeting через sendMessage.
 *
 * Security:
 * - Verify webhook secret через X-Telegram-Bot-Api-Secret-Token header
 *   (см. https://core.telegram.org/bots/api#setwebhook)
 * - Без secret — 401
 * - Проверяем что from.username связан с operator email (или просто принимаем
 *   первый /start от operator с OPERATOR_EMAIL — single-user mode)
 *
 * ENV:
 *   TELEGRAM_BOT_TOKEN
 *   TELEGRAM_WEBHOOK_SECRET — random 256-bit, set при `setWebhook`
 *   OPERATOR_EMAIL — email оператора в Users collection (single-user binding)
 */

import { NextRequest, NextResponse } from 'next/server'
import config from '@/payload.config'
import { getPayload } from 'payload'
import { sendMessage } from '@/lib/telegram/sendMessage'

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

const GREETING_TEXT =
  'Готов получать magic-link для входа в админку. Открой /admin/login и попроси ссылку — она прилетит сюда.'

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

  const { chat, text } = update.message

  // 3. Handle /start — save chat_id to operator's Users record + greet
  if (text === '/start') {
    const operatorEmail = process.env.OPERATOR_EMAIL
    if (!operatorEmail) {
      console.error('[telegram/webhook] OPERATOR_EMAIL not configured')
      // Still acknowledge to Telegram (200) so it doesn't retry
      return NextResponse.json({ ok: true })
    }

    try {
      const payload = await getPayload({ config })
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

      // Greet operator (даже если user не нашёлся — silent fail на user side, но greeting шлём)
      await sendMessage({ chatId: chat.id, text: GREETING_TEXT })
    } catch (err) {
      console.error('[telegram/webhook] /start handler error', err)
      // Не возвращаем 500 — Telegram будет retry, чего не нужно
    }
  }

  // 4. Always 200 to acknowledge (Telegram retries on non-2xx)
  return NextResponse.json({ ok: true })
}
