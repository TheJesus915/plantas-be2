-- CreateEnum
CREATE TYPE "light_types" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateTable
CREATE TABLE "watering_groups" (
    "watering_group_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "image_url" TEXT NOT NULL,

    CONSTRAINT "watering_groups_pkey" PRIMARY KEY ("watering_group_id")
);

-- CreateTable
CREATE TABLE "watering_schedules" (
    "watering_schedule_id" TEXT NOT NULL,
    "watering_group_id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "days" JSON NOT NULL,
    "start_time" VARCHAR(8) NOT NULL,
    "end_time" VARCHAR(8) NOT NULL,

    CONSTRAINT "watering_schedules_pkey" PRIMARY KEY ("watering_schedule_id")
);

-- CreateTable
CREATE TABLE "lighting_groups" (
    "lighting_group_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "image_url" TEXT NOT NULL,

    CONSTRAINT "lighting_groups_pkey" PRIMARY KEY ("lighting_group_id")
);

-- CreateTable
CREATE TABLE "lighting_schedules" (
    "lighting_schedule_id" TEXT NOT NULL,
    "lighting_group_id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "days" JSON NOT NULL,
    "start_time" VARCHAR(8) NOT NULL,
    "end_time" VARCHAR(8) NOT NULL,
    "light_type" "light_types" NOT NULL DEFAULT 'MEDIUM',
    "light_color" VARCHAR(50) NOT NULL,

    CONSTRAINT "lighting_schedules_pkey" PRIMARY KEY ("lighting_schedule_id")
);

-- CreateTable
CREATE TABLE "_PotWateringGroups" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PotWateringGroups_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PotLightingGroups" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PotLightingGroups_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PotWateringGroups_B_index" ON "_PotWateringGroups"("B");

-- CreateIndex
CREATE INDEX "_PotLightingGroups_B_index" ON "_PotLightingGroups"("B");

-- AddForeignKey
ALTER TABLE "watering_groups" ADD CONSTRAINT "watering_groups_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watering_schedules" ADD CONSTRAINT "watering_schedules_watering_group_id_fkey" FOREIGN KEY ("watering_group_id") REFERENCES "watering_groups"("watering_group_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lighting_groups" ADD CONSTRAINT "lighting_groups_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lighting_schedules" ADD CONSTRAINT "lighting_schedules_lighting_group_id_fkey" FOREIGN KEY ("lighting_group_id") REFERENCES "lighting_groups"("lighting_group_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PotWateringGroups" ADD CONSTRAINT "_PotWateringGroups_A_fkey" FOREIGN KEY ("A") REFERENCES "pots"("pot_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PotWateringGroups" ADD CONSTRAINT "_PotWateringGroups_B_fkey" FOREIGN KEY ("B") REFERENCES "watering_groups"("watering_group_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PotLightingGroups" ADD CONSTRAINT "_PotLightingGroups_A_fkey" FOREIGN KEY ("A") REFERENCES "lighting_groups"("lighting_group_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PotLightingGroups" ADD CONSTRAINT "_PotLightingGroups_B_fkey" FOREIGN KEY ("B") REFERENCES "pots"("pot_id") ON DELETE CASCADE ON UPDATE CASCADE;
