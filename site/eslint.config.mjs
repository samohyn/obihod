import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier/flat'

import obikhod from './eslint-rules/index.mjs'

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    plugins: {
      obikhod,
    },
    rules: {
      // TODO(obikhod): поэтапно убираем any из production-кода и возвращаем
      // это правило на 'error'. Текущие 118 случаев — легаси baseline.
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    // ADR-0015 — RSC border lint. Запрещает JSX spread неотфильтрованных
    // server props через границу RSC к client component (incident PR #120).
    // Scope только Payload admin: components/admin/** + app/(payload)/** +
    // collections/** custom views — там где RSC border пересекает Payload's
    // client UI (DefaultListView, etc.). Marketing/blocks renderer (типизированные
    // AnyBlock primitives) и admin/icons.tsx (passthrough Svg wrapper) — out of
    // scope, false positive zone.
    //
    // Allowlist (внутри rule): pickClientProps(...), inline object literal,
    // identifier с именем clientProps/safeProps/pickedProps/whitelistProps.
    files: ['components/admin/**/*.{ts,tsx}', 'app/(payload)/**/*.{ts,tsx}'],
    ignores: ['components/admin/icons.tsx'],
    rules: {
      'obikhod/no-spread-server-props-in-client': 'error',
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'playwright-report/**',
    'test-results/**',
    'media/**',
    'payload-types.ts',
    'eslint-rules/**',
  ]),
])
