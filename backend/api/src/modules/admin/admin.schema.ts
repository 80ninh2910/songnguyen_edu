import { z } from "zod";

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
  subject: z.string().trim().min(1).optional(),
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
});

export const UpdatePaymentStatusBodySchema = z.object({
  note: z.string().trim().max(500).optional(),
});

export const AdminListAuditLogsQuerySchema = PaginationQuerySchema.extend({
  action: z.string().trim().min(1).optional(),
  targetType: z.string().trim().min(1).optional(),
  actorId: z.string().uuid().optional(),
});
