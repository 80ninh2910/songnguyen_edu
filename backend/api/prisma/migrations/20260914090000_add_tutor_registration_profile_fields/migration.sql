ALTER TABLE "tutors"
ADD COLUMN "gender" TEXT,
ADD COLUMN "address" TEXT,
ADD COLUMN "school" TEXT,
ADD COLUMN "available_weekdays" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "note" TEXT;
