import { z } from "zod";

const CsvArraySchema = z
  .union([z.string(), z.array(z.string())])
  .transform((value) => {
    if (Array.isArray(value)) {
      return value.map((item) => item.trim()).filter((item) => item.length > 0);
    }

    return value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  })
  .refine((value) => value.length > 0, {
    message: "At least one value is required",
  });

const PaginationQuerySchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
});

export const IdParamSchema = z.object({
  id: z.string().uuid(),
});

export const AdminListTutorsQuerySchema = PaginationQuerySchema.extend({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  search: z.string().trim().min(1).optional(),
  phone: z.string().trim().min(3).optional(),
  subject: z.string().trim().min(1).optional(),
  subjects: CsvArraySchema.optional(),
  district: z.string().trim().min(1).optional(),
  districts: CsvArraySchema.optional(),
  sort: z.enum(["newest", "active-most", "rating"]).optional(),
});

const TutorSubjectsSchema = z
  .array(z.string().trim().min(1))
  .min(1, "At least one subject is required");

const TutorDistrictsSchema = z
  .array(z.string().trim().min(1))
  .min(1, "At least one district is required");

export const CreateTutorBodySchema = z.object({
  fullName: z.string().trim().min(3).max(200),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(3).max(30).optional(),
  subjects: TutorSubjectsSchema,
  districts: TutorDistrictsSchema,
});

export const UpdateTutorBodySchema = z
  .object({
    fullName: z.string().trim().min(3).max(200).optional(),
    email: z.string().trim().email().max(200).optional(),
    phone: z.string().trim().min(3).max(30).optional(),
    subjects: TutorSubjectsSchema.optional(),
    districts: TutorDistrictsSchema.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });

export const RejectTutorBodySchema = z.object({
  reason: z.string().trim().min(3).max(500),
});

export const AdminListClassRequestsQuerySchema = PaginationQuerySchema.extend({
  status: z.enum(["PENDING", "CONVERTED", "REJECTED"]).optional(),
});

export const ConvertRequestBodySchema = z.object({
  title: z.string().trim().min(3).max(200).optional(),
  feePerHour: z.number().int().positive().optional(),
  schedule: z.string().trim().min(3).max(200).optional(),
});

export const RejectRequestBodySchema = z.object({
  reason: z.string().trim().min(3).max(500),
});

export const AdminListClassesQuerySchema = PaginationQuerySchema.extend({
  status: z.enum(["OPEN", "ASSIGNED", "CLOSED"]).optional(),
  subject: z.string().trim().min(1).optional(),
  district: z.string().trim().min(1).optional(),
});

export const CreateClassBodySchema = z.object({
  title: z.string().trim().min(3).max(200),
  subject: z.string().trim().min(1).max(100),
  grade: z.string().trim().min(1).max(100),
  district: z.string().trim().min(1).max(100),
  feePerHour: z.number().int().positive(),
  schedule: z.string().trim().min(3).max(200).optional(),
  sourceRequestId: z.string().uuid().optional(),
});

export const UpdateClassBodySchema = z
  .object({
    title: z.string().trim().min(3).max(200).optional(),
    subject: z.string().trim().min(1).max(100).optional(),
    grade: z.string().trim().min(1).max(100).optional(),
    district: z.string().trim().min(1).max(100).optional(),
    feePerHour: z.number().int().positive().optional(),
    schedule: z.string().trim().min(3).max(200).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });

export const AssignClassBodySchema = z.object({
  tutorId: z.string().uuid(),
  note: z.string().trim().max(500).optional(),
});

export const AdminListPaymentsQuerySchema = PaginationQuerySchema.extend({
  status: z.enum(["PENDING", "CONFIRMED", "REJECTED"]).optional(),
  classId: z.string().uuid().optional(),
  tutorId: z.string().uuid().optional(),
  latestOnly: z.coerce.boolean().optional(),
});

export const ConfirmPaymentBodySchema = z.object({
  note: z.string().trim().max(500).optional(),
});

export const RejectPaymentBodySchema = z.object({
  reason: z.string().trim().min(3).max(500),
  note: z.string().trim().max(500).optional(),
});

export const AdminListAuditLogsQuerySchema = PaginationQuerySchema.extend({
  action: z.string().trim().min(1).optional(),
  targetType: z.string().trim().min(1).optional(),
  actorId: z.string().uuid().optional(),
});
