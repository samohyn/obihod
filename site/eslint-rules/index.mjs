/**
 * Local ESLint plugin `obikhod` — кастомные rules для проекта.
 *
 * @see eslint-rules/no-spread-server-props-in-client.mjs (ADR-0015)
 */
import noSpreadServerPropsInClient from './no-spread-server-props-in-client.mjs'

export default {
  meta: {
    name: 'eslint-plugin-obikhod',
    version: '1.0.0',
  },
  rules: {
    'no-spread-server-props-in-client': noSpreadServerPropsInClient,
  },
}
