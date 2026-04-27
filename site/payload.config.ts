import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Services } from './collections/Services'
import { Districts } from './collections/Districts'
import { ServiceDistricts } from './collections/ServiceDistricts'
import { Cases } from './collections/Cases'
import { Persons } from './collections/Persons'
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
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: '— Обиход admin',
      icons: [{ rel: 'icon', type: 'image/png', url: '/favicon.ico' }],
    },
    components: {
      graphics: {
        Logo: '@/components/admin/BrandLogo',
        Icon: '@/components/admin/BrandIcon',
      },
      beforeDashboard: ['@/components/admin/BeforeDashboardStartHere'],
      afterDashboard: ['@/components/admin/PageCatalog'],
      beforeLogin: ['@/components/admin/BeforeLoginLockup'],
    },
  },
  collections: [
    Users,
    Media,
    Services,
    Districts,
    ServiceDistricts,
    Cases,
    Persons,
    Authors,
    Blog,
    B2BPages,
    Leads,
    Redirects,
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
    push: process.env.NODE_ENV !== 'production',
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
})
