-- PANEL-GLOBAL-SEARCH (ADR-0013): pg_trgm extension + GIN trigram indexes
-- для top-bar global search по 7 коллекциям.
--
-- Spec: specs/PANEL-GLOBAL-SEARCH/sa-panel.md
-- ADR: team/adr/ADR-0013-panel-global-search-performance.md (Strategy 2)
--
-- Что делает:
--   1. CREATE EXTENSION pg_trgm (доступен в PG ≥9.1, contrib).
--   2. 7 GIN индексов с gin_trgm_ops по поисковым полям коллекций:
--      - leads → name, phone (PII; access control в endpoint post-filter)
--      - services → title, slug
--      - service_districts → computed_title (composite Service+District)
--      - cases → title, slug
--      - blog → title, slug
--      - b2b_pages → title, slug
--      - authors → full_name, slug
--      - districts → name_nominative, slug
--   3. Index expression использует LOWER + COALESCE для устойчивости к регистру
--      и NULL fields (см. ADR §Russian text handling).
--
-- Acceptance: ADR §AC4 — p95 ≤ 500ms на dev-data; UX target ≤ 300ms на проде.
--
-- Idempotency: IF NOT EXISTS на extension и индексах.
-- Rollback: см. .down.sql (DROP INDEX CASCADE + DROP EXTENSION).
--
-- Замечание: CONCURRENTLY НЕ используем в этой миграции — текущая prod-БД
-- обновляется через `psql -f` в deploy.yml вне транзакции; concurrent index
-- build в dev не нужен (push:true ephemeral). Если данных >100k появится —
-- тогда rebuild через CONCURRENTLY вручную dba.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 1. Leads — phone + name (admin-only access, см. endpoint post-filter)
CREATE INDEX IF NOT EXISTS leads_search_trgm
  ON leads USING gin (
    (LOWER(COALESCE(name, '') || ' ' || COALESCE(phone, ''))) gin_trgm_ops
  );

-- 2. Services — title + slug
CREATE INDEX IF NOT EXISTS services_search_trgm
  ON services USING gin (
    (LOWER(COALESCE(title, '') || ' ' || COALESCE(slug, ''))) gin_trgm_ops
  );

-- 3. ServiceDistricts — computed_title (composite Service-Район)
CREATE INDEX IF NOT EXISTS service_districts_search_trgm
  ON service_districts USING gin (
    (LOWER(COALESCE(computed_title, ''))) gin_trgm_ops
  );

-- 4. Cases — title + slug
CREATE INDEX IF NOT EXISTS cases_search_trgm
  ON cases USING gin (
    (LOWER(COALESCE(title, '') || ' ' || COALESCE(slug, ''))) gin_trgm_ops
  );

-- 5. Blog — title + slug
CREATE INDEX IF NOT EXISTS blog_search_trgm
  ON blog USING gin (
    (LOWER(COALESCE(title, '') || ' ' || COALESCE(slug, ''))) gin_trgm_ops
  );

-- 6. B2BPages — title + slug
CREATE INDEX IF NOT EXISTS b2b_pages_search_trgm
  ON b2b_pages USING gin (
    (LOWER(COALESCE(title, '') || ' ' || COALESCE(slug, ''))) gin_trgm_ops
  );

-- 7. Authors — full_name + slug
CREATE INDEX IF NOT EXISTS authors_search_trgm
  ON authors USING gin (
    (LOWER(COALESCE(full_name, '') || ' ' || COALESCE(slug, ''))) gin_trgm_ops
  );

-- 8. Districts — name_nominative + slug (extra over spec 7 — districts тоже
--    нужны оператору для быстрого jump в edit-view района)
CREATE INDEX IF NOT EXISTS districts_search_trgm
  ON districts USING gin (
    (LOWER(COALESCE(name_nominative, '') || ' ' || COALESCE(slug, ''))) gin_trgm_ops
  );
