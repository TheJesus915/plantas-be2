/*
  Warnings:

  - A unique constraint covering the columns `[device_id]` on the table `pots` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('AVAILABLE', 'LINKED', 'DISABLED');

-- AlterTable
ALTER TABLE "pots" ALTER COLUMN "device_id" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "devices" (
    "device_id" TEXT NOT NULL,
    "identifier" VARCHAR(100) NOT NULL,
    "linking_key" VARCHAR(100) NOT NULL,
    "status" "DeviceStatus" NOT NULL DEFAULT 'AVAILABLE',
    "registered_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "linked_at" TIMESTAMP(6),

    CONSTRAINT "devices_pkey" PRIMARY KEY ("device_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "devices_identifier_key" ON "devices"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "devices_linking_key_key" ON "devices"("linking_key");

-- CreateIndex
CREATE UNIQUE INDEX "pots_device_id_key" ON "pots"("device_id");

-- AddForeignKey
ALTER TABLE "pots" ADD CONSTRAINT "pots_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("device_id") ON DELETE SET NULL ON UPDATE CASCADE;
