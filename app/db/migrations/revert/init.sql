-- Revert apotest:init from pg

BEGIN;
DROP TABLE "user","post","photo","ecovil","category","friendship","post_has_category";
DROP DOMAIN "email_format", "phone_number_format", "hexa_format";
-- "zip_code_format", , "password_format"
COMMIT;
