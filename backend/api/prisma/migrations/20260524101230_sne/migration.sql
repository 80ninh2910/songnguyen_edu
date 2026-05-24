-- CreateEnum
CREATE TYPE "TutorType" AS ENUM ('GIA_SU_TU_DO', 'GIA_SU_DAO_TAO', 'GIAO_VIEN_TRUNG_TAM', 'ANY');

-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('GIA_SU_TU_DO', 'GIA_SU_DAO_TAO', 'TRUNG_TAM');

-- CreateEnum
CREATE TYPE "ClassType" AS ENUM ('LOP_GIA_SU_TU_DO', 'LOP_GIA_SU_DAO_TAO', 'LOP_TRUNG_TAM');

-- CreateEnum
CREATE TYPE "CenterTeacherStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'CENTER_TEACHER';

-- AlterTable
ALTER TABLE "class_requests" ADD COLUMN     "request_type" "RequestType" NOT NULL DEFAULT 'GIA_SU_TU_DO',
ADD COLUMN     "tutor_type" "TutorType" NOT NULL DEFAULT 'GIA_SU_TU_DO';

-- AlterTable
ALTER TABLE "classes" ADD COLUMN     "center_teacher_id" TEXT,
ADD COLUMN     "class_type" "ClassType" NOT NULL DEFAULT 'LOP_GIA_SU_TU_DO',
ADD COLUMN     "tutor_type" "TutorType" NOT NULL DEFAULT 'GIA_SU_TU_DO';

-- CreateTable
CREATE TABLE "center_teachers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "full_name" TEXT NOT NULL,
    "status" "CenterTeacherStatus" NOT NULL DEFAULT 'ACTIVE',
    "subjects" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "districts" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "center_teachers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "center_teachers_email_key" ON "center_teachers"("email");

-- CreateIndex
CREATE INDEX "center_teachers_status_idx" ON "center_teachers"("status");

-- CreateIndex
CREATE INDEX "center_teachers_subjects_idx" ON "center_teachers" USING GIN ("subjects");

-- CreateIndex
CREATE INDEX "class_requests_request_type_idx" ON "class_requests"("request_type");

-- CreateIndex
CREATE INDEX "class_requests_tutor_type_idx" ON "class_requests"("tutor_type");

-- CreateIndex
CREATE INDEX "classes_class_type_idx" ON "classes"("class_type");

-- CreateIndex
CREATE INDEX "classes_tutor_type_idx" ON "classes"("tutor_type");

-- AddForeignKey
ALTER TABLE "center_teachers" ADD CONSTRAINT "center_teachers_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_center_teacher_id_fkey" FOREIGN KEY ("center_teacher_id") REFERENCES "center_teachers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
