-- CreateTable
CREATE TABLE "DailySong" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailySong_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Song" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "appleMusic" TEXT NOT NULL,
    "dailySongId" INTEGER NOT NULL,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailySong_date_key" ON "DailySong"("date");

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_dailySongId_fkey" FOREIGN KEY ("dailySongId") REFERENCES "DailySong"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
