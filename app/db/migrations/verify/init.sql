-- Verify apotest:init on pg

BEGIN;

SELECT * FROM "user" WHERE false;
SELECT * FROM "photo" WHERE false;

ROLLBACK;
