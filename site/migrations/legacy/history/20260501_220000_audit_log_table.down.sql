-- 20260501_220000_audit_log_table (rollback)
-- Drops audit_log table. История теряется — это OK для rollback,
-- т.к. content audit покрыт Payload <collection>_versions tables, а PII
-- audit (Leads/Users) — secondary safety net (152-ФЗ recommended retention).

DROP INDEX IF EXISTS "audit_log_doc_idx";
DROP INDEX IF EXISTS "audit_log_action_idx";
DROP INDEX IF EXISTS "audit_log_user_idx";
DROP INDEX IF EXISTS "audit_log_collection_idx";
DROP INDEX IF EXISTS "audit_log_changed_at_idx";
DROP TABLE IF EXISTS "audit_log";

-- pgcrypto extension не дропаем — может использоваться другими таблицами.
