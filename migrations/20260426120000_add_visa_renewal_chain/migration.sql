-- AlterTable
ALTER TABLE "Visa" ADD COLUMN     "renewedFromId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Visa_renewedFromId_key" ON "Visa"("renewedFromId");

-- AddForeignKey
ALTER TABLE "Visa" ADD CONSTRAINT "Visa_renewedFromId_fkey" FOREIGN KEY ("renewedFromId") REFERENCES "Visa"("id") ON DELETE SET NULL ON UPDATE CASCADE;
