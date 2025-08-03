-- CreateEnum
CREATE TYPE "faq_node_types" AS ENUM ('pregunta', 'respuesta');

-- CreateTable
CREATE TABLE "faq_nodes" (
    "faq_node_id" TEXT NOT NULL,
    "parent_id" TEXT,
    "type" "faq_node_types" NOT NULL,
    "content" JSONB NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "faq_nodes_pkey" PRIMARY KEY ("faq_node_id")
);

-- CreateIndex
CREATE INDEX "faq_nodes_parent_id_idx" ON "faq_nodes"("parent_id");

-- AddForeignKey
ALTER TABLE "faq_nodes" ADD CONSTRAINT "faq_nodes_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "faq_nodes"("faq_node_id") ON DELETE SET NULL ON UPDATE CASCADE;
