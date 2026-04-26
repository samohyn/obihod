-- Down: rollback Authors collection.

BEGIN;

DROP TABLE IF EXISTS "_authors_v";
DROP TABLE IF EXISTS "authors_credentials";
DROP TABLE IF EXISTS "authors_same_as";
DROP TABLE IF EXISTS "authors_knows_about";
DROP TABLE IF EXISTS "authors_robots_directives";
DROP TYPE IF EXISTS "enum_authors_robots_directives";

ALTER TABLE "authors" DROP CONSTRAINT IF EXISTS "authors_avatar_id_fk";

DROP TABLE IF EXISTS "authors";

COMMIT;
