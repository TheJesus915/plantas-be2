-- CreateTable
CREATE TABLE "public"."marketplace_categories" (
    "category_id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "image_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "parent_id" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "marketplace_categories_pkey" PRIMARY KEY ("category_id")
);

-- AddForeignKey
ALTER TABLE "public"."marketplace_categories" ADD CONSTRAINT "marketplace_categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."marketplace_categories"("category_id") ON DELETE CASCADE ON UPDATE CASCADE;
