-- Cleanup unused columns per ADR-0002 (SEO × SiteChrome dedup, US-2)
-- Values migrated to persons (Organization schema) and site_chrome.requisites_*.
-- Ownership fix applied by operator via Beget VNC on 2026-04-25 (REASSIGN-style loop):
-- `obikhod` is now owner of public.seo_settings and public.seo_settings_same_as,
-- so DROP/ALTER succeeds without `must be owner of table` errors.
--
-- Context: US-3 migration (20260424_133242) intentionally skipped this cleanup
-- because at the time `obikhod` was not owner of those tables (they were
-- created by postgres superuser during an earlier db.push).

BEGIN;

-- 1. Drop the whole same_as side-table. It is empty on prod; sameAs is now
--    stored inside `organization_schema_override` JSON on seo_settings.
--    CASCADE removes any dependent indexes/FKs automatically.
DROP TABLE IF EXISTS public.seo_settings_same_as CASCADE;

-- 2. Drop 9 stale organization_* columns. Values migrated to:
--    • persons (Organization schema, ADR-0002) — legal_name, tax_id, ogrn,
--      founding_date, telephone
--    • site_chrome.requisites_* — address_region, address_locality,
--      street_address, postal_code
ALTER TABLE public.seo_settings
    DROP COLUMN IF EXISTS organization_legal_name,
    DROP COLUMN IF EXISTS organization_tax_id,
    DROP COLUMN IF EXISTS organization_ogrn,
    DROP COLUMN IF EXISTS organization_address_region,
    DROP COLUMN IF EXISTS organization_address_locality,
    DROP COLUMN IF EXISTS organization_street_address,
    DROP COLUMN IF EXISTS organization_postal_code,
    DROP COLUMN IF EXISTS organization_telephone,
    DROP COLUMN IF EXISTS organization_founding_date;

COMMIT;
