-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "name" TEXT,
    "colour" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Trip_user_id_idx" ON "Trip"("user_id");
