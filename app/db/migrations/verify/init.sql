-- Verify apotest:init on pg

BEGIN;

SELECT * FROM "user" WHERE false;
SELECT * FROM "post" WHERE false;
SELECT * FROM "ecovil" WHERE false;
SELECT * FROM "category" WHERE false;
SELECT * FROM "photo" WHERE false;
SELECT * FROM "friendship" WHERE false;
SELECT * FROM "post_has_category" WHERE false;

ROLLBACK;
