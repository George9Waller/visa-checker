-- CreateTable
CREATE TABLE "Visa" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "expires" TIMESTAMP(3),
    "countries" TEXT[],
    "maxNumTrips" INTEGER,
    "tripMaxLen" INTEGER,
    "totalMaxLen" INTEGER,
    "rollingPeriodLen" INTEGER,

    CONSTRAINT "Visa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisaTrip" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "visaId" TEXT NOT NULL,

    CONSTRAINT "VisaTrip_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Visa_user_id_idx" ON "Visa"("user_id");

-- AddForeignKey
ALTER TABLE "VisaTrip" ADD CONSTRAINT "VisaTrip_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisaTrip" ADD CONSTRAINT "VisaTrip_visaId_fkey" FOREIGN KEY ("visaId") REFERENCES "Visa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
