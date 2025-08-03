/*
  Warnings:

  - You are about to drop the column `humiditylevel` on the `catalog_plants` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "pots" DROP CONSTRAINT "pots_device_id_fkey";

-- AlterTable
ALTER TABLE "catalog_plants" DROP COLUMN "humiditylevel",
ADD COLUMN     "maxhum" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "minhum" DOUBLE PRECISION DEFAULT 0;

-- AddForeignKey
ALTER TABLE "pots" ADD CONSTRAINT "pots_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("device_id") ON DELETE CASCADE ON UPDATE CASCADE;
