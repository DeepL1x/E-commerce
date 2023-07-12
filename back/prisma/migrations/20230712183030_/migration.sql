/*
  Warnings:

  - The primary key for the `items` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `items` table. All the data in the column will be lost.
  - The primary key for the `reviews` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `reviews` table. All the data in the column will be lost.
  - The primary key for the `shops` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `shops` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shopId,userId]` on the table `shops` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_shopId_userId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_itemId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_userId_fkey";

-- DropForeignKey
ALTER TABLE "shops" DROP CONSTRAINT "shops_userId_fkey";

-- DropIndex
DROP INDEX "shops_id_userId_key";

-- AlterTable
ALTER TABLE "items" DROP CONSTRAINT "items_pkey",
DROP COLUMN "id",
ADD COLUMN     "itemId" SERIAL NOT NULL,
ADD CONSTRAINT "items_pkey" PRIMARY KEY ("itemId");

-- AlterTable
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_pkey",
DROP COLUMN "id",
ADD COLUMN     "reviewId" SERIAL NOT NULL,
ADD CONSTRAINT "reviews_pkey" PRIMARY KEY ("reviewId");

-- AlterTable
ALTER TABLE "shops" DROP CONSTRAINT "shops_pkey",
DROP COLUMN "id",
ADD COLUMN     "shopId" SERIAL NOT NULL,
ADD CONSTRAINT "shops_pkey" PRIMARY KEY ("shopId");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
ADD COLUMN     "userId" SERIAL NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("userId");

-- CreateIndex
CREATE UNIQUE INDEX "shops_shopId_userId_key" ON "shops"("shopId", "userId");

-- AddForeignKey
ALTER TABLE "shops" ADD CONSTRAINT "shops_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_shopId_userId_fkey" FOREIGN KEY ("shopId", "userId") REFERENCES "shops"("shopId", "userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("itemId") ON DELETE RESTRICT ON UPDATE CASCADE;
