-- CreateTable
CREATE TABLE "areas" (
    "id_area" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "url_imagen" TEXT,
    "fecha_creacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "areas_pkey" PRIMARY KEY ("id_area")
);

-- CreateTable
CREATE TABLE "groups" (
    "id_grupo" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "url_imagen" TEXT,
    "fecha_creacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id_grupo")
);

-- CreateTable
CREATE TABLE "pots" (
    "id_maceta" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "id_area" TEXT,
    "id_grupo" TEXT,
    "id_planta" TEXT,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "imagen" TEXT,
    "dispositivo" VARCHAR(100),
    "riego_encendido" BOOLEAN NOT NULL DEFAULT false,
    "luz_encendida" BOOLEAN NOT NULL DEFAULT false,
    "fecha_creacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pots_pkey" PRIMARY KEY ("id_maceta")
);

-- AddForeignKey
ALTER TABLE "areas" ADD CONSTRAINT "areas_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pots" ADD CONSTRAINT "pots_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pots" ADD CONSTRAINT "pots_id_area_fkey" FOREIGN KEY ("id_area") REFERENCES "areas"("id_area") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pots" ADD CONSTRAINT "pots_id_grupo_fkey" FOREIGN KEY ("id_grupo") REFERENCES "groups"("id_grupo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pots" ADD CONSTRAINT "pots_id_planta_fkey" FOREIGN KEY ("id_planta") REFERENCES "catalog_plants"("catalog_plant_id") ON DELETE SET NULL ON UPDATE CASCADE;
