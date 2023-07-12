/*
  Warnings:

  - You are about to drop the column `rating` on the `items` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id,userId]` on the table `shops` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `items` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `price` on the `items` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_shopId_fkey";

-- AlterTable
ALTER TABLE "items" DROP COLUMN "rating",
ADD COLUMN     "userId" INTEGER NOT NULL,
DROP COLUMN "price",
ADD COLUMN     "price" MONEY NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "shops_id_userId_key" ON "shops"("id", "userId");

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_shopId_userId_fkey" FOREIGN KEY ("shopId", "userId") REFERENCES "shops"("id", "userId") ON DELETE RESTRICT ON UPDATE CASCADE;
