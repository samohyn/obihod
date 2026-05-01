import type { AdminViewServerProps } from 'payload'
import { redirect } from 'next/navigation'
import { Gutter } from '@payloadcms/ui'
import SecurityPanel from './SecurityPanel'

/**
 * SecurityView — custom Payload view at /admin/security.
 *
 * Spec: PANEL-AUTH-2FA AC-2 / AC-5. Профиль «Безопасность · 2FA».
 *
 * Server component:
 *   - Проверяет initPageResult.req.user — если нет → /admin/login.
 *   - Рендерит client-side SecurityPanel с initial state из user (totpEnabled,
 *     remaining recovery codes count).
 *
 * Path: '/security' зарегистрирован в payload.config.ts admin.views.security.
 */
export default function SecurityView({ initPageResult }: AdminViewServerProps) {
  const user = initPageResult.req.user as
    | { id: string | number; email: string; totpEnabled?: boolean }
    | null
    | undefined

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <Gutter>
      <h1
        style={{
          fontSize: 24,
          fontWeight: 600,
          marginBottom: 8,
          color: 'var(--brand-obihod-ink, #1c1c1c)',
        }}
      >
        Безопасность
      </h1>
      <p
        style={{
          fontSize: 14,
          color: 'var(--brand-obihod-ink-muted, #6b6b6b)',
          marginTop: 0,
          marginBottom: 32,
          lineHeight: 1.5,
          maxWidth: 560,
        }}
      >
        Двухфакторная аутентификация (TOTP) защищает аккаунт от компрометации пароля. Код
        генерируется в Google Authenticator, 1Password, Authy или Yandex Key.
      </p>
      <SecurityPanel initialEnabled={Boolean(user.totpEnabled)} userEmail={user.email} />
    </Gutter>
  )
}
