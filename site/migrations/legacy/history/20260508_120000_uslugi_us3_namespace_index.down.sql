-- Rollback US-3 namespace index.

BEGIN;

DROP INDEX IF EXISTS idx_service_districts_district_service;

COMMIT;
