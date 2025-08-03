/*
  Warnings:

  - You are about to drop the column `description` on the `Category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "description",
ADD COLUMN     "private_metadata" JSONB,
ADD COLUMN     "seoSlug" TEXT;
