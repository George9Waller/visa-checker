-- AlterTable
ALTER TABLE "Visa" ADD COLUMN     "documentNumber" TEXT,
ADD COLUMN     "includeEntryAndExitDates" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mustExitBeforeExpiry" BOOLEAN NOT NULL DEFAULT true;
