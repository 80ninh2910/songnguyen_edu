-- AlterTable
ALTER TABLE "tutors" ADD COLUMN     "must_change_password" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tutor_type" "TutorType" NOT NULL DEFAULT 'GIA_SU_TU_DO';
