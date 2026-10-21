/**
 * pnpm revalidate:site — сбросить кеш всего сайта вручную (например, после правки базы psql).
 * Seed и скрипты данных делают это сами — scripts/_site-revalidate.ts.
 */
import { requestSiteRevalidate } from './_site-revalidate'

requestSiteRevalidate('revalidate:site').then((ok) => process.exit(ok ? 0 : 1))
