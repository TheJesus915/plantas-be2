-- DropForeignKey
ALTER TABLE "faq_nodes" DROP CONSTRAINT "faq_nodes_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "taxonomic_nodes" DROP CONSTRAINT "taxonomic_nodes_parent_id_fkey";

-- AddForeignKey
ALTER TABLE "taxonomic_nodes" ADD CONSTRAINT "taxonomic_nodes_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "taxonomic_nodes"("taxonomic_node_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faq_nodes" ADD CONSTRAINT "faq_nodes_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "faq_nodes"("faq_node_id") ON DELETE CASCADE ON UPDATE CASCADE;
