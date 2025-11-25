/*
  Warnings:

  - You are about to drop the column `organizer` on the `Event` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Recreation', 'Food', 'Career', 'Free', 'Cultural', 'Academic', 'Social', 'Sports', 'Workshop');

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "organizer",
ADD COLUMN     "categories" "Category"[] DEFAULT ARRAY[]::"Category"[],
ADD COLUMN     "createdById" INTEGER NOT NULL,
ADD COLUMN     "imageUrl" TEXT NOT NULL DEFAULT '/default-event.jpg';

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
