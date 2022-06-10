-- Revert apotest:init from pg

BEGIN;
DROP TABLE "user","photo";
DROP DOMAIN "email";
COMMIT;
