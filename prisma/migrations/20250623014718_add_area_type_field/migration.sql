-- CreateEnum
CREATE TYPE "area_types" AS ENUM ('EXTERIOR', 'INTERIOR');

-- AlterTable
ALTER TABLE "areas" ADD COLUMN     "area_type" "area_types" NOT NULL DEFAULT 'INTERIOR';
