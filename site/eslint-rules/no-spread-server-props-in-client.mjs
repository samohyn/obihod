/**
 * ESLint custom rule — `obikhod/no-spread-server-props-in-client`.
 *
 * Запрещает JSX spread неотфильтрованных server props в client/RSC component
 * через границу RSC. Кодифицирует hotfix #122 (PR #120 incident — Payload
 * RenderServerComponent сливал serverProps + clientProps и спредил в client
 * `<DefaultListView>`, что приводило к runtime 500 «Functions cannot be
 * passed directly to Client Components»).
 *
 * Эвристика (AST-only, без cross-file resolution):
 *   - rule срабатывает на JSXSpreadAttribute в JSXOpeningElement с capitalized
 *     name (Custom Component, не нативный HTML).
 *   - ПРОПУСКАЕТСЯ если аргумент spread'а:
 *     · ObjectExpression (`<X {...{a, b}} />`) — explicit pick, безопасно;
 *     · CallExpression вида `pickClientProps(...)` — каноничный helper из
 *       `lib/admin/rsc/pickClientProps.ts`;
 *     · Identifier с именем содержащим `client`, `safe`, `picked` (case-insensitive)
 *       — программист явно отметил что объект уже whitelist-отфильтрован;
 *     · MemberExpression с такими-же именами (`obj.clientProps`).
 *   - Suppress per-line: `// eslint-disable-next-line obikhod/no-spread-server-props-in-client`
 *     с обязательным jsdoc-rationale (cr-panel checklist enforces).
 *
 * Defense in depth: даже false-negative этой rule — ловит Phase 4 Playwright
 * smoke на коллекциях с totalDocs > 0.
 *
 * @see ADR-0015 — RSC border lint (3-layer defense)
 * @see specs/PANEL-RSC-LINT/sa-panel.md
 * @see hotfix #122 (e9bd3c1)
 */

const SAFE_NAME_PATTERN = /^(client|safe|picked|whitelist)/i
const SAFE_SUFFIX_PATTERN = /(ClientProps|Whitelist|Picked|Safe)$/

function isPickHelperCall(node) {
  if (node.type !== 'CallExpression') return false
  const callee = node.callee
  if (callee.type === 'Identifier' && callee.name === 'pickClientProps') return true
  if (
    callee.type === 'MemberExpression' &&
    callee.property &&
    callee.property.type === 'Identifier' &&
    callee.property.name === 'pickClientProps'
  ) {
    return true
  }
  return false
}

function isSafeName(name) {
  return SAFE_NAME_PATTERN.test(name) || SAFE_SUFFIX_PATTERN.test(name)
}

const rule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Forbid JSX spread of raw server props into client/RSC component across RSC border',
      recommended: true,
    },
    schema: [],
    messages: {
      spreadIntoClient:
        'Spread в Custom Component "{{name}}" через RSC границу запрещён: serverProps содержат функции (Payload access/hooks) → runtime 500. Используй pickClientProps(serverProps, WHITELIST) — см. ADR-0015.',
    },
  },
  create(context) {
    return {
      JSXSpreadAttribute(node) {
        const parent = node.parent
        if (!parent || parent.type !== 'JSXOpeningElement') return

        const elName = parent.name
        // Только Custom Components (PascalCase). HTML элементы (lowercase) skip.
        if (!elName || elName.type !== 'JSXIdentifier') return
        if (!/^[A-Z]/.test(elName.name)) return

        const arg = node.argument

        // Explicit object — `{...{a, b}}` — программист собрал inline.
        if (arg.type === 'ObjectExpression') return

        // pickClientProps(...) call — каноничный helper.
        if (isPickHelperCall(arg)) return

        // Identifier с safe-именем (clientProps, safeProps, pickedProps, ...).
        if (arg.type === 'Identifier' && isSafeName(arg.name)) return

        // MemberExpression с safe-именем (obj.clientProps).
        if (
          arg.type === 'MemberExpression' &&
          arg.property &&
          arg.property.type === 'Identifier' &&
          isSafeName(arg.property.name)
        ) {
          return
        }

        context.report({
          node,
          messageId: 'spreadIntoClient',
          data: { name: elName.name },
        })
      },
    }
  },
}

export default rule
