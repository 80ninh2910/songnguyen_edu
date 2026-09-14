UPDATE "tutors"
SET "status" = 'INACTIVE'
WHERE "status" = 'REJECTED'
  AND "reject_reason" = 'Center teacher inactive';
