/*
  Warnings:

  - Made the column `catalog_plant_id` on table `pots` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "pots" DROP CONSTRAINT "pots_catalog_plant_id_fkey";

-- AlterTable
ALTER TABLE "pots" ALTER COLUMN "catalog_plant_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "pots" ADD CONSTRAINT "pots_catalog_plant_id_fkey" FOREIGN KEY ("catalog_plant_id") REFERENCES "catalog_plants"("catalog_plant_id") ON DELETE CASCADE ON UPDATE CASCADE;
