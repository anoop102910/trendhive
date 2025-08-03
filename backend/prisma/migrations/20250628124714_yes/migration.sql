/*
  Warnings:

  - You are about to drop the column `plain_description` on the `Category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "plain_description",
ADD COLUMN     "description" TEXT;
