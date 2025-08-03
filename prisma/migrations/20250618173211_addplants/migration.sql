-- CreateEnum
CREATE TYPE "humidity_levels" AS ENUM ('LOW', 'LOW_MEDIUM', 'MEDIUM', 'MEDIUM_HIGH', 'HIGH');

-- CreateTable
CREATE TABLE "plant_families" (
    "plan_family_id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plant_families_pkey" PRIMARY KEY ("plan_family_id")
);

-- CreateTable
CREATE TABLE "plant_genus" (
    "plan_genus_id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plant_genus_pkey" PRIMARY KEY ("plan_genus_id")
);

-- CreateTable
CREATE TABLE "plant_species" (
    "plan_species_id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plant_species_pkey" PRIMARY KEY ("plan_species_id")
);

-- CreateTable
CREATE TABLE "catalog_plants" (
    "catalog_plant_id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "planttype" VARCHAR(50) NOT NULL,
    "mintemp" DOUBLE PRECISION,
    "maxtemp" DOUBLE PRECISION,
    "humiditylevel" "humidity_levels" NOT NULL DEFAULT 'LOW_MEDIUM',
    "WARNINGS" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "catalog_plants_pkey" PRIMARY KEY ("catalog_plant_id")
);

-- CreateTable
CREATE TABLE "plant_images" (
    "plant_image_id" TEXT NOT NULL,
    "catalog_plant_id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plant_images_pkey" PRIMARY KEY ("plant_image_id")
);

-- CreateTable
CREATE TABLE "taxonomy" (
    "taxonomy_id" TEXT NOT NULL,
    "family_id" TEXT NOT NULL,
    "genus_id" TEXT NOT NULL,
    "species_id" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "taxonomy_pkey" PRIMARY KEY ("taxonomy_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "plant_families_name_key" ON "plant_families"("name");

-- CreateIndex
CREATE UNIQUE INDEX "plant_genus_name_key" ON "plant_genus"("name");

-- CreateIndex
CREATE UNIQUE INDEX "plant_species_name_key" ON "plant_species"("name");

-- CreateIndex
CREATE UNIQUE INDEX "catalog_plants_name_key" ON "catalog_plants"("name");

-- CreateIndex
CREATE UNIQUE INDEX "taxonomy_family_id_genus_id_species_id_key" ON "taxonomy"("family_id", "genus_id", "species_id");

-- AddForeignKey
ALTER TABLE "plant_images" ADD CONSTRAINT "plant_images_catalog_plant_id_fkey" FOREIGN KEY ("catalog_plant_id") REFERENCES "catalog_plants"("catalog_plant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taxonomy" ADD CONSTRAINT "taxonomy_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "plant_families"("plan_family_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taxonomy" ADD CONSTRAINT "taxonomy_genus_id_fkey" FOREIGN KEY ("genus_id") REFERENCES "plant_genus"("plan_genus_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taxonomy" ADD CONSTRAINT "taxonomy_species_id_fkey" FOREIGN KEY ("species_id") REFERENCES "plant_species"("plan_species_id") ON DELETE CASCADE ON UPDATE CASCADE;
