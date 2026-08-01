/*
  Warnings:

  - The `status` column on the `Video` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updatedAt` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VideoStatus" AS ENUM ('DRAFT', 'SCRIPT_GENERATED', 'SEO_GENERATED', 'THUMBNAIL_READY', 'VOICEOVER_READY', 'SUBTITLE_READY', 'READY_TO_UPLOAD', 'PUBLISHED', 'FAILED');

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "channelId" INTEGER,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "durationText" TEXT,
ADD COLUMN     "keyword" TEXT,
ADD COLUMN     "language" TEXT,
ADD COLUMN     "publishStatus" TEXT NOT NULL DEFAULT 'NOT_READY',
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "readyAt" TIMESTAMP(3),
ADD COLUMN     "seoResultId" INTEGER,
ADD COLUMN     "subtitle" JSONB,
ADD COLUMN     "thumbnailConcept" JSONB,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "voiceover" JSONB,
DROP COLUMN "status",
ADD COLUMN     "status" "VideoStatus" NOT NULL DEFAULT 'DRAFT';

-- CreateTable
CREATE TABLE "Channel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "youtubeChannelId" TEXT,
    "description" TEXT,
    "projectId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Channel_projectId_idx" ON "Channel"("projectId");

-- CreateIndex
CREATE INDEX "Channel_userId_idx" ON "Channel"("userId");

-- CreateIndex
CREATE INDEX "Video_projectId_idx" ON "Video"("projectId");

-- CreateIndex
CREATE INDEX "Video_channelId_idx" ON "Video"("channelId");

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_seoResultId_fkey" FOREIGN KEY ("seoResultId") REFERENCES "SeoResult"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
