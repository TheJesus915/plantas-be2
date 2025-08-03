-- Primero eliminar todas las restricciones de clave foránea existentes
ALTER TABLE IF EXISTS "pots" DROP CONSTRAINT IF EXISTS "pots_id_area_fkey";
ALTER TABLE IF EXISTS "pots" DROP CONSTRAINT IF EXISTS "pots_id_grupo_fkey";
ALTER TABLE IF EXISTS "pots" DROP CONSTRAINT IF EXISTS "pots_id_planta_fkey";

-- Crear las nuevas columnas sin restricciones
ALTER TABLE "areas" ADD COLUMN IF NOT EXISTS "area_id" TEXT;
ALTER TABLE "areas" ADD COLUMN IF NOT EXISTS "name" VARCHAR(100);
ALTER TABLE "areas" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "areas" ADD COLUMN IF NOT EXISTS "image_url" TEXT;
ALTER TABLE "areas" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "groups" ADD COLUMN IF NOT EXISTS "group_id" TEXT;
ALTER TABLE "groups" ADD COLUMN IF NOT EXISTS "name" VARCHAR(100);
ALTER TABLE "groups" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "groups" ADD COLUMN IF NOT EXISTS "image_url" TEXT;
ALTER TABLE "groups" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "pots" ADD COLUMN IF NOT EXISTS "pot_id" TEXT;
ALTER TABLE "pots" ADD COLUMN IF NOT EXISTS "name" VARCHAR(100);
ALTER TABLE "pots" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "pots" ADD COLUMN IF NOT EXISTS "image" TEXT;
ALTER TABLE "pots" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "pots" ADD COLUMN IF NOT EXISTS "area_id" TEXT;
ALTER TABLE "pots" ADD COLUMN IF NOT EXISTS "group_id" TEXT;
ALTER TABLE "pots" ADD COLUMN IF NOT EXISTS "catalog_plant_id" TEXT;
ALTER TABLE "pots" ADD COLUMN IF NOT EXISTS "device_id" VARCHAR(100);
ALTER TABLE "pots" ADD COLUMN IF NOT EXISTS "light_activated" BOOLEAN DEFAULT false;
ALTER TABLE "pots" ADD COLUMN IF NOT EXISTS "watering_activated" BOOLEAN DEFAULT false;

-- Migrar datos de las columnas antiguas a las nuevas
UPDATE "areas" SET
    "area_id" = "id_area"::TEXT,
  "name" = "nombre",
  "description" = "descripcion",
  "image_url" = "url_imagen",
  "created_at" = COALESCE("fecha_creacion", CURRENT_TIMESTAMP)
WHERE "area_id" IS NULL;

UPDATE "groups" SET
    "group_id" = "id_grupo"::TEXT,
  "name" = "nombre",
  "description" = "descripcion",
  "image_url" = "url_imagen",
  "created_at" = COALESCE("fecha_creacion", CURRENT_TIMESTAMP)
WHERE "group_id" IS NULL;

UPDATE "pots" SET
    "pot_id" = "id_maceta"::TEXT,
  "name" = COALESCE("nombre", 'Default Pot'),
  "description" = "descripcion",
  "image" = "imagen",
  "created_at" = COALESCE("fecha_creacion", CURRENT_TIMESTAMP),
  "area_id" = "id_area"::TEXT,
  "group_id" = "id_grupo"::TEXT,
  "catalog_plant_id" = "id_planta"::TEXT,
  "device_id" = "dispositivo",
  "light_activated" = COALESCE("luz_encendida", false),
  "watering_activated" = COALESCE("riego_encendido", false)
WHERE "pot_id" IS NULL;

-- Generar UUIDs para cualquier registro que no tenga un ID
UPDATE "areas" SET "area_id" = gen_random_uuid()::TEXT WHERE "area_id" IS NULL;
UPDATE "areas" SET "name" = 'Default Area' WHERE "name" IS NULL;

UPDATE "groups" SET "group_id" = gen_random_uuid()::TEXT WHERE "group_id" IS NULL;
UPDATE "groups" SET "name" = 'Default Group' WHERE "name" IS NULL;

UPDATE "pots" SET "pot_id" = gen_random_uuid()::TEXT WHERE "pot_id" IS NULL;
UPDATE "pots" SET "name" = 'Default Pot' WHERE "name" IS NULL;

-- Eliminar las restricciones de clave primaria antiguas (si existen)
-- Utiliza CASCADE para asegurarse de que también se eliminen las restricciones dependientes
ALTER TABLE IF EXISTS "areas" DROP CONSTRAINT IF EXISTS "areas_pkey" CASCADE;
ALTER TABLE IF EXISTS "groups" DROP CONSTRAINT IF EXISTS "groups_pkey" CASCADE;
ALTER TABLE IF EXISTS "pots" DROP CONSTRAINT IF EXISTS "pots_pkey" CASCADE;

-- Hacer que las columnas sean obligatorias
ALTER TABLE "areas" ALTER COLUMN "area_id" SET NOT NULL;
ALTER TABLE "areas" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "groups" ALTER COLUMN "group_id" SET NOT NULL;
ALTER TABLE "groups" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "pots" ALTER COLUMN "pot_id" SET NOT NULL;
ALTER TABLE "pots" ALTER COLUMN "name" SET NOT NULL;

-- Agregar las nuevas restricciones de clave primaria
ALTER TABLE "areas" ADD CONSTRAINT "areas_pkey" PRIMARY KEY ("area_id");
ALTER TABLE "groups" ADD CONSTRAINT "groups_pkey" PRIMARY KEY ("group_id");
ALTER TABLE "pots" ADD CONSTRAINT "pots_pkey" PRIMARY KEY ("pot_id");

-- Agregar las nuevas claves foráneas
ALTER TABLE "pots" ADD CONSTRAINT "pots_area_id_fkey"
    FOREIGN KEY ("area_id") REFERENCES "areas"("area_id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "pots" ADD CONSTRAINT "pots_group_id_fkey"
    FOREIGN KEY ("group_id") REFERENCES "groups"("group_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Solo añade esta restricción si exists la tabla catalog_plants
ALTER TABLE "pots" ADD CONSTRAINT "pots_catalog_plant_id_fkey"
    FOREIGN KEY ("catalog_plant_id") REFERENCES "catalog_plants"("catalog_plant_id")
        ON DELETE SET NULL ON UPDATE CASCADE;

-- Finalmente, eliminar las columnas antiguas después de migrar los datos
ALTER TABLE "areas" DROP COLUMN IF EXISTS "id_area";
ALTER TABLE "areas" DROP COLUMN IF EXISTS "nombre";
ALTER TABLE "areas" DROP COLUMN IF EXISTS "descripcion";
ALTER TABLE "areas" DROP COLUMN IF EXISTS "url_imagen";
ALTER TABLE "areas" DROP COLUMN IF EXISTS "fecha_creacion";

ALTER TABLE "groups" DROP COLUMN IF EXISTS "id_grupo";
ALTER TABLE "groups" DROP COLUMN IF EXISTS "nombre";
ALTER TABLE "groups" DROP COLUMN IF EXISTS "descripcion";
ALTER TABLE "groups" DROP COLUMN IF EXISTS "url_imagen";
ALTER TABLE "groups" DROP COLUMN IF EXISTS "fecha_creacion";

ALTER TABLE "pots" DROP COLUMN IF EXISTS "id_maceta";
ALTER TABLE "pots" DROP COLUMN IF EXISTS "nombre";
ALTER TABLE "pots" DROP COLUMN IF EXISTS "descripcion";
ALTER TABLE "pots" DROP COLUMN IF EXISTS "imagen";
ALTER TABLE "pots" DROP COLUMN IF EXISTS "fecha_creacion";
ALTER TABLE "pots" DROP COLUMN IF EXISTS "id_area";
ALTER TABLE "pots" DROP COLUMN IF EXISTS "id_grupo";
ALTER TABLE "pots" DROP COLUMN IF EXISTS "id_planta";
ALTER TABLE "pots" DROP COLUMN IF EXISTS "dispositivo";
ALTER TABLE "pots" DROP COLUMN IF EXISTS "luz_encendida";
ALTER TABLE "pots" DROP COLUMN IF EXISTS "riego_encendido";