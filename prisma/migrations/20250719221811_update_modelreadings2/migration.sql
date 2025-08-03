-- DropForeignKey
ALTER TABLE "readings" DROP CONSTRAINT "readings_pot_id_fkey";

-- AddForeignKey
ALTER TABLE "readings" ADD CONSTRAINT "readings_pot_id_fkey" FOREIGN KEY ("pot_id") REFERENCES "pots"("pot_id") ON DELETE SET NULL ON UPDATE CASCADE;
