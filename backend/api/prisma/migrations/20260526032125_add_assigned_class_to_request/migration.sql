-- AlterTable
ALTER TABLE "class_requests" ADD COLUMN     "assigned_class_id" TEXT;

-- CreateIndex
CREATE INDEX "class_requests_assigned_class_id_idx" ON "class_requests"("assigned_class_id");

-- AddForeignKey
ALTER TABLE "class_requests" ADD CONSTRAINT "class_requests_assigned_class_id_fkey" FOREIGN KEY ("assigned_class_id") REFERENCES "classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
