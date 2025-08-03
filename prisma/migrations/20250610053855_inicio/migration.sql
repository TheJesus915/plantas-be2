-- CreateEnum
CREATE TYPE "Role" AS ENUM ('superadmin', 'admin', 'general');

-- CreateEnum
CREATE TYPE "StatusAccount" AS ENUM ('Pending', 'Active', 'Inactive');

-- CreateTable
CREATE TABLE "users" (
    "user_id" TEXT NOT NULL,
    "type" "Role" NOT NULL DEFAULT 'general',
    "name" VARCHAR(100) NOT NULL,
    "lastname" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password" VARCHAR(260) NOT NULL,
    "token_recovery" TEXT,
    "token_exp" TIMESTAMP,
    "reset_token" TEXT,
    "reset_token_exp" TIMESTAMP,
    "registration_date" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status_account" "StatusAccount" NOT NULL DEFAULT 'Pending',

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "profile_data" (
    "id_datos" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "profile_picture" TEXT,
    "birthdate" DATE NOT NULL,
    "phone" CHAR(15) NOT NULL,
    "country" VARCHAR(100) NOT NULL,
    "province" VARCHAR(100) NOT NULL,
    "city" VARCHAR(100) NOT NULL,

    CONSTRAINT "profile_data_pkey" PRIMARY KEY ("id_datos")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_token_recovery_key" ON "users"("token_recovery");

-- CreateIndex
CREATE UNIQUE INDEX "users_reset_token_key" ON "users"("reset_token");

-- CreateIndex
CREATE UNIQUE INDEX "profile_data_user_id_key" ON "profile_data"("user_id");

-- AddForeignKey
ALTER TABLE "profile_data" ADD CONSTRAINT "profile_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
