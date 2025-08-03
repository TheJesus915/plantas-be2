/*
  Warnings:

  - You are about to drop the column `group_id` on the `pots` table. All the data in the column will be lost.
  - You are about to drop the `groups` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `area_id` on table `pots` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_user_id_fkey";

-- DropForeignKey
ALTER TABLE "pots" DROP CONSTRAINT "pots_area_id_fkey";

-- DropForeignKey
ALTER TABLE "pots" DROP CONSTRAINT "pots_group_id_fkey";

-- AlterTable
ALTER TABLE "pots" DROP COLUMN "group_id",
ADD COLUMN     "floor" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "area_id" SET NOT NULL;

-- DropTable
DROP TABLE "groups";

-- AddForeignKey
ALTER TABLE "pots" ADD CONSTRAINT "pots_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("area_id") ON DELETE CASCADE ON UPDATE CASCADE;
