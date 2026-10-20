-- PANEL-GLOBAL-SEARCH rollback: drop trigram indexes + extension.
--
-- Замечание: DROP EXTENSION pg_trgm CASCADE автоматически дропает все объекты
-- зависящие от extension (operators, types). DROP INDEX явно — на случай
-- если extension dropped другим путём.

DROP INDEX IF EXISTS leads_search_trgm;
DROP INDEX IF EXISTS services_search_trgm;
DROP INDEX IF EXISTS service_districts_search_trgm;
DROP INDEX IF EXISTS cases_search_trgm;
DROP INDEX IF EXISTS blog_search_trgm;
DROP INDEX IF EXISTS b2b_pages_search_trgm;
DROP INDEX IF EXISTS authors_search_trgm;
DROP INDEX IF EXISTS districts_search_trgm;

DROP EXTENSION IF EXISTS pg_trgm;
