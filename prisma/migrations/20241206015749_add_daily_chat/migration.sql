/*
  Warnings:

  - You are about to drop the column `name` on the `Message` table. All the data in the column will be lost.
  - Added the required column `dailyChatId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "name",
ADD COLUMN     "dailyChatId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "DailyChat" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyChat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyChat_date_key" ON "DailyChat"("date");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_dailyChatId_fkey" FOREIGN KEY ("dailyChatId") REFERENCES "DailyChat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
