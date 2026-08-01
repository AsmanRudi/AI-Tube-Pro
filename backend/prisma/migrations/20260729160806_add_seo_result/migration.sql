-- CreateTable
CREATE TABLE "SeoResult" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" JSONB NOT NULL,
    "keywords" JSONB,
    "score" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeoResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SeoResult_projectId_idx" ON "SeoResult"("projectId");

-- AddForeignKey
ALTER TABLE "SeoResult" ADD CONSTRAINT "SeoResult_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
