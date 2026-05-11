/**
 * EPIC-SERVICE-PAGES-REDESIGN D5 — A/B pilot cookie split helpers.
 *
 * Pilot scope: ТОЛЬКО /vyvoz-musora/ (T2 pillar). На первый visit `proxy.ts`
 * ставит cookie `obikhod_ab_var=v1|v2` (50/50, 1 year, SameSite=Lax,
 * httpOnly:false). На server-side в page.tsx читаем cookie и для service slug
 * `vyvoz-musora` + variant `v2` форсим useTemplateV2=true (без записи в
 * Payload doc).
 *
 * Why server-side override (а не Payload doc.useTemplateV2):
 *   - Doc-level field применяется ко всем посетителям одинаково.
 *   - A/B нужен per-user split — один и тот же URL должен render v1 ИЛИ v2
 *     в зависимости от cookie. Cookie sticky → один user всегда получает свой
 *     variant (no flicker, no inconsistent SSR/CSR).
 *   - Doc.useTemplateV2 остаётся source-of-truth для permanent rollout phase 3.
 *
 * Rollback: убрать condition в page.tsx или выставить cookie всем = 'v1'.
 */
import { cookies } from 'next/headers'

export const AB_PILOT_SLUG = 'vyvoz-musora'
export const AB_COOKIE_NAME = 'obikhod_ab_var'

export type AbVariant = 'v1' | 'v2'

/**
 * Читает A/B variant из cookies (server-side).
 *
 * Returns:
 *   - 'v1' | 'v2' если cookie set к валидному значению
 *   - null если cookie отсутствует или мусорное значение
 */
export async function readAbVariant(): Promise<AbVariant | null> {
  const store = await cookies()
  const value = store.get(AB_COOKIE_NAME)?.value
  if (value === 'v1' || value === 'v2') return value
  return null
}

/**
 * Решает, нужно ли force `useTemplateV2=true` для текущего visitor на pilot
 * service. Применять ТОЛЬКО для `service === AB_PILOT_SLUG`.
 *
 * IMPORTANT: вызов `cookies()` опт-аутит route из ISR cache (становится
 * dynamic per-request). Поэтому делаем early return для не-pilot slugs ДО
 * вызова cookies() — sustained pillars остаются на ISR.
 *
 * Returns true если:
 *   - service slug = pilot ('vyvoz-musora') AND
 *   - cookie variant = 'v2'
 *
 * Иначе false (default sustained rendering).
 */
export async function readAbVariantOverride(serviceSlug: string): Promise<boolean> {
  // PAUSED 2026-05-11: A/B pilot отключён до content-fill placeholder-секций
  // (pricing-block, process на T2 pillar показывают «черновик, в работе» stub cards).
  // useTemplateV2 override отключён глобально — все visitors получают sustained
  // legacy rendering. Re-enable: вернуть условие ниже + content-fill ready.
  //   if (serviceSlug !== AB_PILOT_SLUG) return false
  //   const variant = await readAbVariant()
  //   return variant === 'v2'
  void serviceSlug
  return false
}
