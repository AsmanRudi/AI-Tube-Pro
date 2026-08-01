-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "thumbnail" TEXT,
ADD COLUMN     "youtubeId" TEXT;

-- CreateTable
CREATE TABLE "Script" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "outline" JSONB NOT NULL,
    "tags" JSONB NOT NULL,
    "keyword" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "videoId" INTEGER,

    CONSTRAINT "Script_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Script_videoId_key" ON "Script"("videoId");

-- AddForeignKey
ALTER TABLE "Script" ADD CONSTRAINT "Script_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE SET NULL ON UPDATE CASCADE;
