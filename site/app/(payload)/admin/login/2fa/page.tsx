import { headers as nextHeaders, cookies as nextCookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { payloadClient } from '@/lib/payload'
import { computeSecondFactorToken, SECOND_FACTOR_COOKIE } from '@/lib/auth/totp/secondFactorCookie'
import TwoFactorLoginForm from '@/components/admin/TwoFactorLoginForm'

/**
 * /admin/login/2fa — second-factor screen.
 *
 * Spec: PANEL-AUTH-2FA AC-4. §12.1 brand-guide карточка-форма 320px.
 *
 * Server logic:
 * - Если нет session (нет payload-token / невалиден) → redirect /admin/login.
 * - Если у user totpEnabled=false → set passed-cookie + redirect /admin/.
 *   Это покрывает случай когда middleware ложно сюда отправил пользователя
 *   без 2FA (после первого логина без passed-cookie).
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
    // У user нет 2FA — выставляем cookie и пускаем дальше.
    // Cookie set делается через next/headers cookies (server action).
    const cookieStore = await nextCookies()
    cookieStore.set({
      name: SECOND_FACTOR_COOKIE,
      value: computeSecondFactorToken(user.id),
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    })
    redirect('/admin')
  }

  return <TwoFactorLoginForm />
}
