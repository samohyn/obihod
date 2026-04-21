import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier/flat'

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    rules: {
      // TODO(obikhod): поэтапно убираем any из production-кода и возвращаем
      // это правило на 'error'. Текущие 118 случаев — легаси baseline.
      '@typescript-eslint/no-explicit-any': 'warn',
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
  ]),
])
