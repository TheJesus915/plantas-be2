/*
  Warnings:

  - Made the column `created_at` on table `areas` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `groups` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `pots` required. This step will fail if there are existing NULL values in that column.
  - Made the column `light_activated` on table `pots` required. This step will fail if there are existing NULL values in that column.
  - Made the column `watering_activated` on table `pots` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "areas" ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "groups" ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "pots" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "light_activated" SET NOT NULL,
ALTER COLUMN "watering_activated" SET NOT NULL;
