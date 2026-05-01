/**
 * PANEL-AUDIT-LOG (ADR-0014 §PII masking pipeline) —
 *   write-time masking PII полей перед записью в audit_log.diff jsonb.
 *
 * Ключевой инвариант: сырой phone/email НИКОГДА не лежит в audit_log.
 * Это гарантирует что:
 *   - утечка audit_log → не утечка PII в clear;
 *   - read API не нуждается в re-masking (idempotent);
 *   - admin UI отображает masked values без специальной логики.
 *
 * Маскирование делается на capture-time (в HybridAuditLogAdapter.capture)
 * и в content-collection version snapshots (для коллекций где могут быть
 * PII — но в текущей схеме content collections PII не содержат, т.к. PII
 * отделена в Leads/Users которые НЕ имеют versions: true).
 */

type FieldMasker = (value: unknown) => string

/**
 * Mask phone в формате `***-**-NN` где NN — последние 2 цифры.
 * E.g. «+79991234567» → «***-**-67».
 * Если value не строка — возвращает «***».
 */
const maskPhone: FieldMasker = (v) => {
  if (typeof v !== 'string' || v.length < 2) return '***'
  return `***-**-${v.slice(-2)}`
}

/**
 * Mask email: первая буква + `***@<domain>`.
 * E.g. «ivan@example.com» → «i***@example.com».
 */
const maskEmail: FieldMasker = (v) => {
  if (typeof v !== 'string') return '***'
  const match = v.match(/^(.).*@(.*)$/)
  if (!match) return '***'
  return `${match[1]}***@${match[2]}`
}

/**
 * Маскировка ФИО — оставляем только первую букву + «***».
 * Используется для customer_name в Leads (152-ФЗ — name тоже PII).
 */
const maskName: FieldMasker = (v) => {
  if (typeof v !== 'string' || v.length === 0) return '***'
  return `${v.charAt(0)}***`
}

/**
 * Per-collection правила маскирования.
 * Field path использует dot-notation для nested полей если потребуется.
 */
const PII_RULES: Record<string, Record<string, FieldMasker>> = {
  leads: {
    phone: maskPhone,
    email: maskEmail,
    name: maskName,
  },
  users: {
    email: maskEmail,
    name: maskName,
    telegramChatId: () => '***',
    // totpSecretEnc / recoveryCodes уже hidden access в Users.ts —
    // но в diff snapshot могут попасть. Strip полностью.
    totpSecretEnc: () => '[REDACTED]',
    recoveryCodes: () => '[REDACTED]',
  },
}

/**
 * Применяет PII-маскировку к snapshot объекту.
 * Не мутирует input — возвращает новый объект.
 *
 * Для коллекций без правил — возвращает объект as-is (mutation-safe shallow clone).
 * Для коллекций с правилами — заменяет указанные поля masked-значениями.
 */
export function maskPII(
  collection: string,
  doc: Record<string, unknown> | null | undefined,
): Record<string, unknown> | null {
  if (doc === null || doc === undefined) return null
  const rules = PII_RULES[collection]
  if (!rules) return { ...doc }

  const masked: Record<string, unknown> = { ...doc }
  for (const [field, mask] of Object.entries(rules)) {
    if (field in masked) {
      masked[field] = mask(masked[field])
    }
  }
  return masked
}

/**
 * Возвращает true если коллекция содержит PII fields (для диагностики /
 * documentation purposes). Используется в тестах.
 */
export function hasPIIRules(collection: string): boolean {
  return collection in PII_RULES
}

/**
 * Список полей, которые маскируются для коллекции (для UI hint
 * «PII masked» badge).
 */
export function getPIIFields(collection: string): string[] {
  return Object.keys(PII_RULES[collection] ?? {})
}
