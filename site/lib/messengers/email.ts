import nodemailer, { type Transporter } from 'nodemailer'

/**
 * site/lib/messengers/email.ts
 *
 * Helper для отправки email через SMTP (Beget по умолчанию).
 *
 * Закрыто 2026-04-28: PAN-10 finish — nodemailer установлен, реальная
 * имплементация ниже. SPF + DKIM (selector beget) настроены, DMARC ждёт
 * Beget support ticket (опционально, не блокирует send).
 *
 * Используется:
 * - Wave 2.B (PAN-11) — magic link login email fallback (через EmailChannel)
 *
 * ENV (требуются):
 *   SMTP_HOST            — smtp.beget.com
 *   SMTP_PORT            — 587 (STARTTLS)
 *   SMTP_USER            — noreply@obikhod.ru
 *   SMTP_PASS            — strong random password
 *   SMTP_FROM_NAME       — "Обиход admin"
 *   SMTP_FROM_EMAIL      — noreply@obikhod.ru
 */

export class EmailSendError extends Error {
  constructor(
    public reason: string,
    public statusCode?: number,
  ) {
    super(`Email send failed: ${reason}`)
    this.name = 'EmailSendError'
  }
}

export interface SendEmailOptions {
  /** Получатель email */
  to: string
  /** Subject */
  subject: string
  /** Plain text body */
  text: string
  /** HTML body (optional, если undefined — text-only) */
  html?: string
}

/**
 * Module-level cached transporter — переиспользуется между вызовами в одном
 * процессе (serverless instance). Создаётся лениво при первом sendEmail().
 */
let cached: Transporter | null = null

function getTransporter(): Transporter {
  if (cached) return cached
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new EmailSendError('SMTP env not configured (SMTP_HOST/USER/PASS)')
  }
  cached = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 587),
    secure: Number(SMTP_PORT ?? 587) === 465, // 465 = SMTPS, 587 = STARTTLS
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
  return cached
}

/**
 * Sends email via configured SMTP transport.
 *
 * Throws EmailSendError if SMTP not configured or send fails.
 *
 * @example
 * ```ts
 * await sendEmail({
 *   to: 'grigorij@obikhod.ru',
 *   subject: 'Вход в Обиход admin',
 *   text: 'Войти: https://obikhod.ru/admin/login?token=xyz',
 *   html: '<p>Войти: <a href="...">...</a></p>',
 * })
 * ```
 */
export async function sendEmail(opts: SendEmailOptions): Promise<{ ok: true; messageId: string }> {
  const { SMTP_FROM_NAME, SMTP_FROM_EMAIL } = process.env
  if (!SMTP_FROM_EMAIL) {
    throw new EmailSendError('SMTP_FROM_EMAIL not configured')
  }

  const transporter = getTransporter()
  try {
    const info = await transporter.sendMail({
      from: SMTP_FROM_NAME ? `${SMTP_FROM_NAME} <${SMTP_FROM_EMAIL}>` : SMTP_FROM_EMAIL,
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
    })
    return { ok: true, messageId: info.messageId }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    throw new EmailSendError(message)
  }
}
