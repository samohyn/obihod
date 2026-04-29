#!/usr/bin/env node
/**
 * Telegram bot smoke — проверяет prod-state без раскрытия секретов.
 *
 * Usage:
 *   node site/scripts/admin/telegram-smoke.mjs                # readiness only
 *   node site/scripts/admin/telegram-smoke.mjs --send         # + тест-сообщение оператору
 *
 * Env: TELEGRAM_BOT_TOKEN (req), TELEGRAM_WEBHOOK_URL (opt verify),
 *      OPERATOR_EMAIL + DATABASE_URI (для --send), TELEGRAM_OPERATOR_CHAT_ID_OVERRIDE (опц).
 *
 * Exit: 0 ok, 1 token invalid, 2 webhook не задан, 3 send failed.
 */

const args = new Set(process.argv.slice(2))
const SEND = args.has('--send')

const token = process.env.TELEGRAM_BOT_TOKEN
const expectedWebhook = process.env.TELEGRAM_WEBHOOK_URL
const operatorEmail = process.env.OPERATOR_EMAIL

if (!token) {
  console.error('FAIL: TELEGRAM_BOT_TOKEN не задан')
  process.exit(1)
}

const api = (m) => `https://api.telegram.org/bot${token}/${m}`

async function step(name, fn) {
  process.stdout.write(`→ ${name} ... `)
  try {
    const r = await fn()
    console.log('OK')
    return r
  } catch (e) {
    console.log('FAIL')
    console.error(`  ${e.message}`)
    throw e
  }
}

async function getJson(url, init) {
  const res = await fetch(url, init)
  const data = await res.json()
  if (!data.ok) throw new Error(data.description ?? `HTTP ${res.status}`)
  return data.result
}

const me = await step('getMe', () => getJson(api('getMe')))
console.log(`  bot: @${me.username} (${me.first_name}) id=${me.id}`)

const wh = await step('getWebhookInfo', () => getJson(api('getWebhookInfo')))
console.log(`  url: ${wh.url || '(пусто)'}`)
console.log(`  pending: ${wh.pending_update_count}`)
if (wh.last_error_message) {
  console.log(`  last_error: ${wh.last_error_date} — ${wh.last_error_message}`)
}
if (!wh.url) {
  console.error(
    'FAIL: webhook URL не зарегистрирован — выполни setWebhook (docs/telegram-bot-setup.md шаг 4)',
  )
  process.exit(2)
}
if (expectedWebhook && wh.url !== expectedWebhook) {
  console.error(`WARN: ${wh.url} ≠ TELEGRAM_WEBHOOK_URL ${expectedWebhook}`)
}

if (!SEND) {
  console.log('\nOK · readiness check passed. --send для тест-сообщения.')
  process.exit(0)
}

if (!operatorEmail) {
  console.error('FAIL: OPERATOR_EMAIL не задан')
  process.exit(3)
}

let chatId = process.env.TELEGRAM_OPERATOR_CHAT_ID_OVERRIDE
if (!chatId) {
  const databaseUri = process.env.DATABASE_URI
  if (!databaseUri) {
    console.error('FAIL: ни TELEGRAM_OPERATOR_CHAT_ID_OVERRIDE, ни DATABASE_URI')
    process.exit(3)
  }
  const { Client } = await import('pg')
  const client = new Client({ connectionString: databaseUri })
  await client.connect()
  const r = await client.query('SELECT telegram_chat_id FROM users WHERE email=$1 LIMIT 1', [
    operatorEmail,
  ])
  await client.end()
  chatId = r.rows[0]?.telegram_chat_id
  if (!chatId) {
    console.error(
      `FAIL: users.telegram_chat_id для ${operatorEmail} пуст — оператор не сделал /start боту`,
    )
    process.exit(3)
  }
}

const text = `🔧 Smoke от podev: ${new Date().toISOString().slice(0, 19)}Z — bot готов получать magic-link и Leads-уведомления.`
await step('sendMessage', () =>
  getJson(api('sendMessage'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
  }),
)
console.log(`\nOK · сообщение отправлено chat_id=${chatId}`)
