-- CreateEnum
CREATE TYPE "taxonomic_ranks" AS ENUM ('DOMAIN', 'KINGDOM', 'SUBKINGDOM', 'DIVISION', 'SUBDIVISION', 'SUPERCLASS', 'CLASS', 'SUBCLASS', 'ORDER', 'SUBORDER', 'FAMILY', 'SUBFAMILY', 'TRIBE', 'SUBTRIBE', 'GENUS', 'SUBGENUS', 'SECTION', 'SPECIES');

-- AlterTable
ALTER TABLE "catalog_plants" ADD COLUMN     "taxonomic_node_id" TEXT;

-- CreateTable
CREATE TABLE "taxonomic_nodes" (
    "taxonomic_node_id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "rank" "taxonomic_ranks" NOT NULL,
    "parent_id" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "taxonomic_nodes_pkey" PRIMARY KEY ("taxonomic_node_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "taxonomic_nodes_name_rank_parent_id_key" ON "taxonomic_nodes"("name", "rank", "parent_id");

-- AddForeignKey
ALTER TABLE "catalog_plants" ADD CONSTRAINT "catalog_plants_taxonomic_node_id_fkey" FOREIGN KEY ("taxonomic_node_id") REFERENCES "taxonomic_nodes"("taxonomic_node_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taxonomic_nodes" ADD CONSTRAINT "taxonomic_nodes_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "taxonomic_nodes"("taxonomic_node_id") ON DELETE SET NULL ON UPDATE CASCADE;
