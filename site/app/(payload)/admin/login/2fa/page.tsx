import { headers as nextHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { payloadClient } from '@/lib/payload'
import TwoFactorLoginForm from '@/components/admin/TwoFactorLoginForm'

/**
 * /admin/login/2fa — second-factor screen.
 *
 * Spec: PANEL-AUTH-2FA AC-4. §12.1 brand-guide карточка-форма 320px.
 *
 * Server logic:
 * - Если нет session (нет payload-token / невалиден) → redirect /admin/login.
 * - Если у user totpEnabled=false → redirect /api/admin/auth/2fa-passthrough
 *   (Route Handler выставит obihod_2fa_passed cookie и кинет на /admin).
 *   В RSC нельзя `cookies().set()` — только в Server Actions / Route Handlers.
 * - Иначе рендерим форму OTP / recovery code (client component).
 */

export const dynamic = 'force-dynamic'

export default async function TwoFactorLoginPage() {
  const payload = await payloadClient()
  const headersList = await nextHeaders()
  const auth = await payload.auth({ headers: headersList })

  if (!auth.user) {
    redirect('/admin/login')
  }

  const user = auth.user as { id: string | number; totpEnabled?: boolean }

  if (!user.totpEnabled) {
    redirect('/api/admin/auth/2fa-passthrough')
  }

  return <TwoFactorLoginForm />
}
