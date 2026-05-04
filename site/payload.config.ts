import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { ru } from '@payloadcms/translations/languages/ru'
import { en } from '@payloadcms/translations/languages/en'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Services } from './collections/Services'
import { Districts } from './collections/Districts'
import { ServiceDistricts } from './collections/ServiceDistricts'
import { Cases } from './collections/Cases'
import { Authors } from './collections/Authors'
import { Blog } from './collections/Blog'
import { B2BPages } from './collections/B2BPages'
import { Leads } from './collections/Leads'
import { Redirects } from './collections/Redirects'
import { SeoSettings } from './globals/SeoSettings'
import { SiteChrome } from './globals/SiteChrome'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: '— Обиход admin',
      // W9 (US-12 prod alignment): type/url mismatch fix — было
      // type: 'image/png' с url '/favicon.ico'. Браузер мог отвергать favicon
      // как corrupt (вид «кривого favicon» на скрине prod 2026-04-30).
      // Используем .ico с правильным MIME + добавляем PNG fallback для
      // современных браузеров (Next.js auto-публикует app/icon.png → /icon.png).
      // PANEL-FAVICON-BRAND (2026-05-01): зеркалим публичный набор от art
      // (favicon.ico + favicon.svg + apple-touch-icon.png). Бренд-favicon ОБИХОД
      // §3 master lockup — единый на admin + public, см. note-art.md.
      icons: [
        { rel: 'icon', type: 'image/x-icon', url: '/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', url: '/favicon.svg' },
        { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' },
      ],
    },
    components: {
      graphics: {
        // Logo убран: на login дублировался с beforeLogin lockup. Sidebar получает
        // default Payload, что приемлемо. Если sidebar нужен brand — отдельный PR
        // с детект login-route.
        Icon: '@/components/admin/BrandIcon',
      },
      beforeDashboard: ['@/components/admin/BeforeDashboardStartHere'],
      // Wave 3 part 1 (PAN-6): widget top-6 last updated. Full catalog
      // table остаётся в PageCatalog.tsx — будет подключён к /admin/catalog
      // route в Wave 3 part 2.
      afterDashboard: ['@/components/admin/PageCatalogWidget'],
      beforeLogin: ['@/components/admin/BeforeLoginLockup'],
      afterLogin: ['@/components/admin/AfterLoginFooter'],
      // Wave 3 part 3 (PAN-6): sidebar Leads badge counter polling 30s через
      // DOM injection [data-leads-count] (Plan B per ADR-0005 §2 +
      // sa-panel-wave3.md §3.5). CSS селектор в custom.scss блок «SIDEBAR».
      //
      // PANEL-AXE-PAYLOAD-CORE-A11Y (2026-05-01): A11yRowCheckboxProvider
      // вешает aria-label на Payload native row-select checkbox
      // (input.checkbox-input__input) во всех list-views — закрывает
      // critical axe violation (WCAG 2.2 SC 4.1.2 / SC 1.3.1) из
      // leadqa-RC-3-hotfix.md § Findings F1. JS injection через
      // MutationObserver — CSS pseudo-elements не дают input'у accessible name.
      providers: [
        '@/components/admin/LeadsBadgeProvider',
        '@/components/admin/A11yRowCheckboxProvider',
        // PANEL-GLOBAL-SEARCH (ADR-0013): Cmd+K hotkey + dropdown overlay по
        // 7 коллекциям + Districts через pg_trgm UNION + post-filter access.
        '@/components/admin/GlobalSearchProvider',
      ],
      // PANEL-GLOBAL-SEARCH: visible top-bar trigger (icon + ⌘K hint) рядом с
      // gear/account. brand-guide §12.2 ad-search slot, mockup line 3016.
      actions: ['@/components/admin/GlobalSearchTrigger'],
      // PANEL-HEADER-CHROME-POLISH (W10, 2026-05-01) §B: home-link первым
      // элементом в .nav__wrap через native Payload slot. Оператор 2026-05-01
      // переименовал «На сайт» (target=_blank → obikhod.ru/) на «Вернуться в
      // панель» (same-tab → /admin/). Spec §B обновлён.
      beforeNavLinks: [
        '@/components/admin/NavHomeLink',
        // PANEL-AUDIT-LOG (ADR-0014): unified `/admin/audit` timeline link.
        // Visible всем — server-side RBAC (admin only) enforced в AuditView.
        '@/components/admin/audit/NavAuditLink',
      ],
      // PANEL-HEADER-CHROME-POLISH (W10, 2026-05-01) §C: dark-theme toggle
      // UI-only stub в gear-popup (settingsMenu) рядом с logout. НЕТ реального
      // theme apply / persistence — placement reservation. Полная логика —
      // отдельный US PANEL-DARK-THEME-LOGIC. Spec: §C.
      settingsMenu: ['@/components/admin/ThemeToggleStub'],
      // Wave 2.A (PAN-5) revert 2026-04-29: views.login НЕ в Payload 3.84 API
      // (см. node_modules/payload/dist/config/types.d.ts:746-756 — views принимает
      // только account / dashboard / [key:string] custom views, login обрабатывается
      // через admin.routes.login path и собственный wrapper). AdminLogin.tsx остаётся
      // в репо для будущего proper override mechanism (research issue TBD).
      // Native Payload login + brand-lockup через beforeLogin slot — рабочий fallback.
      //
      // PANEL-AUTH-2FA — custom view /admin/security для управления TOTP 2FA
      // (включить / отключить / regenerate recovery codes). Server-rendered
      // SecurityView читает initPageResult.req.user, client-side SecurityPanel
      // оркестрирует setup → recovery codes → idle.
      views: {
        security: {
          Component: '@/components/admin/SecurityView',
          path: '/security',
          exact: true,
        },
        // PANEL-AUDIT-LOG (ADR-0014): /admin/audit unified timeline view +
        // /admin/audit/[id] diff view. Admin-only RBAC enforced server-side
        // (AuditView.tsx + AuditDiffView.tsx + REST endpoint).
        audit: {
          Component: '@/components/admin/audit/AuditView',
          path: '/audit',
          exact: true,
        },
        auditDiff: {
          Component: '@/components/admin/audit/AuditDiffView',
          path: '/audit/:id',
          exact: true,
        },
      },
    },
  },
  // Локализация admin на русский (brand-guide §12 mockup на ru). Pакет
  // @payloadcms/translations поставляется как transitive dep payload core,
  // direct install не требуется. fallbackLanguage='ru' покрывает «Войти»,
  // «Пароль», «Забыли пароль?» и сотни других admin-меток.
  i18n: {
    fallbackLanguage: 'ru',
    supportedLanguages: { ru, en },
  },
  // Wave 8 (US-12, sa-panel-wave8.md §8.1): порядок коллекций определяет
  // порядок групп в sidebar — Payload рендерит группы в порядке первой
  // коллекции с этим admin.group. Цель — 01 → 02 → 03 → 04 → 09 per
  // brand-guide §12.2 mockup (lines 2993-3011 brand-guide.html).
  collections: [
    // 01 · Заявки
    Leads,
    // 02 · Контент (порядок per brand-guide §12.2 mockup)
    Services,
    Districts,
    ServiceDistricts,
    Cases,
    Blog,
    Authors,
    B2BPages,
    // 03 · Медиа
    Media,
    // 04 · SEO
    Redirects,
    // 09 · Система
    Users,
  ],
  globals: [SeoSettings, SiteChrome],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || '' },
    // US-3: переход с db.push (интерактивный, опасный) на proper migrations на проде.
    // В dev/ci оставляем push:true для ephemeral schema bootstrap (иначе миграции,
    // написанные как diff к prod-state, не применятся на пустой БД).
    // На проде (NODE_ENV=production) миграции применяются отдельным step в deploy.yml
    // через psql (Payload CLI сломан на extensionless ESM — root cause d2cac65).
    //
    // PAYLOAD_DISABLE_PUSH=1 — local-verify escape hatch (US-3 Wave 0 verify
    // 2026-05-02): когда в БД есть raw-managed таблицы (audit_log из ADR-0014),
    // Payload push:true видит их как «orphan» и блокируется на интерактивном
    // prompt про DROP. Установка ENV даёт чистый non-interactive run против
    // уже-мигрированной БД. На prod env уже push:false по NODE_ENV.
    push: process.env.NODE_ENV !== 'production' && process.env.PAYLOAD_DISABLE_PUSH !== '1',
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
})
