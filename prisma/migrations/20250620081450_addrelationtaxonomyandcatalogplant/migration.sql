/*
  Warnings:

  - A unique constraint covering the columns `[catalog_plant_id]` on the table `taxonomy` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `catalog_plant_id` to the `taxonomy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "taxonomy" ADD COLUMN     "catalog_plant_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "taxonomy_catalog_plant_id_key" ON "taxonomy"("catalog_plant_id");

-- AddForeignKey
ALTER TABLE "taxonomy" ADD CONSTRAINT "taxonomy_catalog_plant_id_fkey" FOREIGN KEY ("catalog_plant_id") REFERENCES "catalog_plants"("catalog_plant_id") ON DELETE CASCADE ON UPDATE CASCADE;
