-- CreateTable
CREATE TABLE "tutor_documents" (
    "id" TEXT NOT NULL,
    "tutor_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tutor_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tutor_documents_tutor_id_idx" ON "tutor_documents"("tutor_id");

-- AddForeignKey
ALTER TABLE "tutor_documents" ADD CONSTRAINT "tutor_documents_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "tutors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
