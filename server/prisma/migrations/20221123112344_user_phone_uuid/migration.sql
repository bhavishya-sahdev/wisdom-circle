/*
  Warnings:

  - A unique constraint covering the columns `[phone_number]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - The required column `uuid` was added to the `Users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "phone_number" TEXT,
ADD COLUMN     "uuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Users_phone_number_key" ON "Users"("phone_number");
