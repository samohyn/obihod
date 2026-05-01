/**
 * Type-safe whitelist для props пробрасываемых в client component через RSC border.
 *
 * Payload server props содержат функции (access.create, access.read, ...), которые
 * не сериализуемы и throw'ают `Functions cannot be passed to Client Components`.
 *
 * Используй вместе с whitelist-константой (см. `clientPropKeys.ts`):
 *
 * ```tsx
 * import { pickClientProps } from '@/lib/admin/rsc/pickClientProps'
 * import { LIST_VIEW_CLIENT_PROP_KEYS } from '@/lib/admin/rsc/clientPropKeys'
 *
 * const clientProps = pickClientProps(serverProps, LIST_VIEW_CLIENT_PROP_KEYS)
 * return <DefaultListView {...clientProps} />
 * ```
 *
 * @see ADR-0015 — RSC border lint (3-layer defense)
 * @see RC-2 PR #120 incident, hotfix #122 (e9bd3c1)
 * @see node_modules/payload/dist/index.bundled.d.ts:7849-7854 (ListViewClientProps + ListViewSlots)
 */
export function pickClientProps<T extends Record<string, unknown>, K extends keyof T>(
  props: T,
  keys: readonly K[],
): Pick<T, K> {
  const result = {} as Record<string, unknown>
  for (const key of keys) {
    const value = props[key as keyof T]
    if (value !== undefined) {
      result[key as string] = value
    }
  }
  return result as Pick<T, K>
}
