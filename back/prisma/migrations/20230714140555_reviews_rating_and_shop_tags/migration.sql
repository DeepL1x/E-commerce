/*
  Warnings:

  - You are about to alter the column `rating` on the `reviews` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "items" ADD COLUMN     "reservedAmount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalAmount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "price" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "reviews" ALTER COLUMN "rating" SET DEFAULT 5,
ALTER COLUMN "rating" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "shops" ADD COLUMN     "shopImage" TEXT,
ADD COLUMN     "tags" TEXT[];
