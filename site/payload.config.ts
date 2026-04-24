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
    // US-3: переход с db.push (интерактивный, опасный) на proper migrations.
    // Источник истины — site/migrations/*.ts (+ .up.sql / .down.sql).
    // Применение: `pnpm payload migrate` (локально + в deploy.yml + ci.yml warmup).
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
})
