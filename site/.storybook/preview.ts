import type { Preview } from '@storybook/react'

/**
 * Storybook preview — глобальные параметры + импорт globals.css (Tailwind 4 +
 * brand-tokens из brand-guide §4/§6/§7).
 *
 * `next/font` в Storybook не работает напрямую (font-loader на уровне
 * Next.js compiler), поэтому шрифты грузятся через preview-head.html
 * (Google Fonts CDN: Golos Text + JetBrains Mono).
 */
import '../app/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'site',
      values: [
        { name: 'site', value: '#f7f5f0' /* --c-bg */ },
        { name: 'alt', value: '#efebe0' /* --c-bg-alt */ },
        { name: 'ink', value: '#1c1c1c' /* --c-ink */ },
        { name: 'white', value: '#ffffff' },
      ],
    },
    a11y: {
      // axe-core опции: WCAG 2.1 AA — соответствует brand-guide accessibility.
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'aria-valid-attr', enabled: true },
        ],
      },
    },
    layout: 'fullscreen',
  },
}

export default preview
