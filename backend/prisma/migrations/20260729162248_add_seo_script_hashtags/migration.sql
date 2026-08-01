-- AlterTable
ALTER TABLE "SeoResult" ADD COLUMN     "hashtags" JSONB,
ADD COLUMN     "scriptId" INTEGER;

-- CreateIndex
CREATE INDEX "SeoResult_scriptId_idx" ON "SeoResult"("scriptId");

-- AddForeignKey
ALTER TABLE "SeoResult" ADD CONSTRAINT "SeoResult_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "Script"("id") ON DELETE CASCADE ON UPDATE CASCADE;
