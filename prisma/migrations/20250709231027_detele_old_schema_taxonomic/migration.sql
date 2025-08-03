/*
  Warnings:

  - You are about to drop the `plant_families` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `plant_genus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `plant_species` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `taxonomy` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "taxonomy" DROP CONSTRAINT "taxonomy_catalog_plant_id_fkey";

-- DropForeignKey
ALTER TABLE "taxonomy" DROP CONSTRAINT "taxonomy_family_id_fkey";

-- DropForeignKey
ALTER TABLE "taxonomy" DROP CONSTRAINT "taxonomy_genus_id_fkey";

-- DropForeignKey
ALTER TABLE "taxonomy" DROP CONSTRAINT "taxonomy_species_id_fkey";

-- DropTable
DROP TABLE "plant_families";

-- DropTable
DROP TABLE "plant_genus";

-- DropTable
DROP TABLE "plant_species";

-- DropTable
DROP TABLE "taxonomy";
