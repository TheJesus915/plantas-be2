/*
  Warnings:

  - You are about to drop the column `light_activated` on the `pots` table. All the data in the column will be lost.
  - You are about to drop the column `watering_activated` on the `pots` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "devices" ADD COLUMN     "light_activated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "watering_activated" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "pots" DROP COLUMN "light_activated",
DROP COLUMN "watering_activated";

-- DropEnum
DROP TYPE "humidity_levels";

-- CreateTable
CREATE TABLE "readings" (
    "reading_id" TEXT NOT NULL,
    "pot_id" TEXT NOT NULL,
    "device_id" TEXT,
    "temperature" DOUBLE PRECISION NOT NULL,
    "humidity" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "readings_pkey" PRIMARY KEY ("reading_id")
);

-- AddForeignKey
ALTER TABLE "readings" ADD CONSTRAINT "readings_pot_id_fkey" FOREIGN KEY ("pot_id") REFERENCES "pots"("pot_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "readings" ADD CONSTRAINT "readings_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("device_id") ON DELETE SET NULL ON UPDATE CASCADE;
