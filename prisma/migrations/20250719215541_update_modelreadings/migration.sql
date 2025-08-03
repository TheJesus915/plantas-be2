/*
  Warnings:

  - Made the column `device_id` on table `readings` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "readings" DROP CONSTRAINT "readings_device_id_fkey";

-- AlterTable
ALTER TABLE "readings" ALTER COLUMN "pot_id" DROP NOT NULL,
ALTER COLUMN "device_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "readings" ADD CONSTRAINT "readings_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("device_id") ON DELETE CASCADE ON UPDATE CASCADE;
