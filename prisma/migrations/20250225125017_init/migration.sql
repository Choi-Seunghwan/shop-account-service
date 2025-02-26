-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('PENDING', 'ACTIVATE', 'DELETED');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "mobile" VARCHAR(16),
    "birth" INTEGER,
    "hash" VARCHAR(64),
    "gender" VARCHAR(10),
    "foreigner" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "login_id" VARCHAR(20),
    "email" VARCHAR(255),
    "mobile" VARCHAR(16),
    "encrypt_password" VARCHAR(255),
    "status" "AccountStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_account" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "provider" VARCHAR(20) NOT NULL,
    "provider_user_id" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "social_account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_user_id_key" ON "account"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "social_account_account_id_key" ON "social_account"("account_id");

-- CreateIndex
CREATE INDEX "social_account_provider_provider_user_id_idx" ON "social_account"("provider", "provider_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "social_account_provider_provider_user_id_key" ON "social_account"("provider", "provider_user_id");

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_account" ADD CONSTRAINT "social_account_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
