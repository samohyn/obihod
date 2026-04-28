/**
 * site/lib/messengers/email.ts
 *
 * Helper для отправки email через SMTP (Beget или transactional ESP).
 *
 * SCAFFOLDING (PAN-10): тонкий stub — runtime реализация через nodemailer
 * добавится в dev-фазе Wave 2.B (PAN-11). Этот файл НЕ импортирует nodemailer
 * (dep ещё не установлена) — это decision, чтобы CI не падал на pre-dev стадии.
 *
 * Используется:
 * - Wave 2.B (PAN-11) — magic link login email fallback (через EmailChannel)
 *
 * ENV (заполнить в PAN-10 — `do` setup):
 *   SMTP_HOST            — smtp.beget.com (или Resend/Postmark host если ESP)
 *   SMTP_PORT            — 587 (STARTTLS)
 *   SMTP_USER            — noreply@obikhod.ru
 *   SMTP_PASS            — strong random password
 *   SMTP_FROM_NAME       — "Обиход admin"
 *   SMTP_FROM_EMAIL      — noreply@obikhod.ru
 *
 * После закрытия PAN-10:
 * 1. `pnpm add nodemailer` + `pnpm add -D @types/nodemailer`
 * 2. Replace TODO ниже на реальный nodemailer transport
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
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM_NAME, SMTP_FROM_EMAIL } =
    process.env

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !SMTP_FROM_EMAIL) {
    throw new EmailSendError('SMTP not configured (see PAN-10 do setup)')
  }

  // TODO (PAN-10): replace with real nodemailer call after `pnpm add nodemailer`.
  //
  // import nodemailer from 'nodemailer'
  //
  // const transporter = nodemailer.createTransport({
  //   host: SMTP_HOST,
  //   port: Number(SMTP_PORT ?? 587),
  //   secure: false, // STARTTLS
  //   auth: { user: SMTP_USER, pass: SMTP_PASS },
  // })
  //
  // try {
  //   const info = await transporter.sendMail({
  //     from: `${SMTP_FROM_NAME} <${SMTP_FROM_EMAIL}>`,
  //     to: opts.to,
  //     subject: opts.subject,
  //     text: opts.text,
  //     html: opts.html ?? `<pre>${opts.text}</pre>`,
  //   })
  //   return { ok: true, messageId: info.messageId }
  // } catch (err) {
  //   throw new EmailSendError(String(err))
  // }

  throw new EmailSendError('TODO: nodemailer integration (PAN-10 not closed yet)')
}
