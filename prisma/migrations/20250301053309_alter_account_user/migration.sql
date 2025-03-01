/*
  Warnings:

  - You are about to drop the column `mobile` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `hash` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[hashed_ci]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Made the column `encrypt_password` on table `account` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `hashed_ci` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birth` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserGender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- AlterTable
ALTER TABLE "account" DROP COLUMN "mobile",
ALTER COLUMN "encrypt_password" SET NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "hash",
ADD COLUMN     "hashed_ci" VARCHAR(64) NOT NULL,
DROP COLUMN "birth",
ADD COLUMN     "birth" DATE NOT NULL,
DROP COLUMN "gender",
ADD COLUMN     "gender" "UserGender" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_hashed_ci_key" ON "user"("hashed_ci");
