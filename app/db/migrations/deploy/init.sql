-- Deploy apotest:init to pg

BEGIN;
CREATE DOMAIN "email_format" AS text CHECK (
    -- value ~ '^(?:[a-z0-9!#$%&''*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&''*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$'

       value ~ '^[a-zA-Z0-9._-]{1,64}@([a-zA-Z0-9-]{2,252}\.[a-zA-Z.]{2,6})$'
        );
 
/*  CREATE DOMAIN "zip_code_format" AS text CHECK (
    value ~ '^0[1-9]\d{3}$' -- code postaux metropole de 01 a 09
    OR value ~ '^20[1-2]\d{2}$|^20300$' -- code postaux de la Corse
    OR value ~ '^[13-8]\d{4}$' -- code postaux les plus génériques
    OR value ~ '^9[0-6]\d{3}$' -- code postaux metropole commencant par 9
    OR value ~ '^97[1-6]\d{2}$' -- code postaux DOM
    OR value ~ '^98[4678]\d{2}$' -- code postaux TOM
    OR value ~ '^9{5}$' -- code postal de la poste
); */
-- password doit contenir:
-- au moins un chiffre (entre 0 et 9)
-- au moins une lettre minuscule (de a à z)
-- au moins une lettre majuscule (de A à Z)
-- doit contenir au moins un caractère spécial
-- doit faire entre 8 et 20 caractères
-- (voir regex-pwd.png dans la doc)
/* CREATE DOMAIN "password_format" AS text CHECK (
    value ~ '^(?=.*[0-9])(?=.*[az])(?=.*[AZ])(?=.*[@#$%^&-+=() ])(?=\\S+$).{8, 20}$'
); */

-- un phone_number doit:
-- commencer par un 0 ou +33
-- ensuite un chiffre entre 1 et 9
-- puis 8 chiffre de 0 à 9
-- il est possible que des séparateurs (espace / - / .) se balade dans le numéro

CREATE DOMAIN "phone_number_format" AS text CHECK (
    value ~ '^(0|\+33)[ .-]?[1-9]([ -]?[0-9]){8}$'
);

CREATE TABLE "user" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "email" email_format NOT NULL UNIQUE,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "pseudo" TEXT NOT NULL,
    "date_of_birth" TIMESTAMPTZ,
    "password" text NOT NULL,
    "rights" TEXT NOT NULL DEFAULT 'user',
    "phone_number" phone_number_format,
    "address" TEXT,
    "region" TEXT NOT NULL,
    "zip_code" text NOT NULL,
    "city" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "post" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "user_id" INT NOT NULL REFERENCES "user"("id"),
    "content" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "ecovil" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "email" email_format NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "zip_code" text NOT NULL,
    "city" TEXT,
    "first_name_manager" TEXT NOT NULL,
    "last_name_manager" TEXT NOT NULL,
    "date_of_birth_manager" TIMESTAMPTZ,
    "password" text NOT NULL,
    "phone_number" phone_number_format,
    "website" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE DOMAIN "hexa_format" AS text CHECK (
    value ~ '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$'
);

CREATE TABLE "category" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" hexa_format NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "photo" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "path" TEXT NOT NULL,
    "user_id" INT REFERENCES "user"("id")
              ON DELETE CASCADE,
    "ev_id" INT REFERENCES "ecovil"("id"),
    "post_id" INT REFERENCES "post"("id"),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

-- On rajoute une contrainte pour que seul une des trois clés étrangère soit NOT NULL
/* ALTER TABLE "photo" 
ADD CONSTRAINT unique_parent_id
CHECK ((user_id IS NOT NULL AND ev_id IS NULL AND post_id IS NULL)
OR (user_id IS NULL AND ev_id IS NOT NULL AND post_id IS NULL)
OR (user_id IS NULL AND ev_id IS NULL AND post_id IS NOT NULL)); */

-- TABLES DE LIAISON --

CREATE TABLE "friendship" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "user_id" INT NOT NULL REFERENCES "user"("id")
              ON DELETE CASCADE,
    "friend_id" INT NOT NULL REFERENCES "user"("id")
                ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

-- On rajoute une contrainte pour véifier que le user_id et le friend_id ne soit pas les même

ALTER TABLE "friendship"
ADD CONSTRAINT user_different_friend 
CHECK ("user_id" != "friend_id");

CREATE TABLE "post_has_category" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "post_id" INTEGER NOT NULL REFERENCES "post" (id), 
    "category_id" INTEGER NOT NULL REFERENCES "category"("id"),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

COMMIT;
