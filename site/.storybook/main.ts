import type { StorybookConfig } from '@storybook/nextjs-vite'

/**
 * Storybook 10.x + Next.js 16 + Tailwind 4 + RSC.
 *
 * Контракт: US-0 sa-seo AC-4 — Storybook only-local (без CI/Chromatic),
 * 12 block stories (5 базовых + 7 новых) + 8 page-type composition stories.
 *
 * Stories живут рядом с компонентами (`<Block>.stories.tsx`) для
 * 12 блоков и в `.storybook/pages/` для 8 page-композиций.
 *
 * Используем `@storybook/nextjs-vite` (а не `@storybook/nextjs`), потому что
 * webpack-based `@storybook/nextjs@8.x` падает на Next 16 (отсутствует
 * `next/config` экспорт). `nextjs-vite` использует Vite + Storybook 10 и
 * официально поддерживает Next 13/14/15/16.
 */
const config: StorybookConfig = {
  stories: ['../components/blocks/*.stories.@(ts|tsx)', './pages/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y'],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  },
  staticDirs: ['../public'],
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
  },
}

export default config
