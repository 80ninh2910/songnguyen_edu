import { Prisma } from "@prisma/client";

import { AppError } from "../../common/errors/AppError.js";
import { buildMeta, parsePagination } from "../../common/utils/pagination.js";
import {
  generateTempPassword,
  hashPassword,
} from "../../common/utils/password.js";
import { prisma } from "../../config/prisma.js";
import { env } from "../../config/env.js";
import { buildCacheKey, cacheService } from "../../services/cache.service.js";
import { auditLogService } from "../../services/auditLog.service.js";
import { emailService } from "../../services/email.service.js";

type AdminActor = {
  id: string;
  email: string;
};

type TutorApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";
type PaymentStatus = "PENDING" | "CONFIRMED" | "REJECTED";

type DashboardStatsRow = {
  pending_tutors: bigint | number;
  open_classes: bigint | number;
  pending_requests: bigint | number;
  pending_payments: bigint | number;
};

type MatchingRate = {
  success: number;
  rejected: number;
  pending: number;
  total: number;
  percent: number;
};

type TopTutor = {
  id: string;
  fullName: string;
  subjects: string[];
  lessonCount: number;
};

type SystemHealthItem = {
  service: string;
  status: string;
  ratio: string;
};

type LatestPaymentRow = {
  id: string;
  class_id: string;
  tutor_id: string;
  amount: number;
  bill_image_url: string;
  status: PaymentStatus;
  note: string | null;
  reviewed_by_id: string | null;
  reviewed_at: Date | null;
  created_at: Date;
  updated_at: Date;
  attempt_count: number;
  tutor_full_name: string;
  tutor_email: string;
  class_title: string | null;
  class_status: "OPEN" | "ASSIGNED" | "CLOSED" | null;
};

const AUTO_REJECT_NOTE = "Lop da duoc phan cho gia su khac";

function invalidState(message: string): never {
  throw new AppError("INVALID_STATE", 409, message);
}

function conflict(message: string): never {
  throw new AppError("CONFLICT", 409, message);
}

function normalizeCount(value: bigint | number | null | undefined): number {
  if (typeof value === "bigint") {
    return Number(value);
  }

  return Number(value ?? 0);
}

async function getMatchingRate(): Promise<MatchingRate> {
  const [total, success, rejected, pending] = await Promise.all([
    prisma.classRequest.count(),
    prisma.classRequest.count({ where: { status: "CONVERTED" } }),
    prisma.classRequest.count({ where: { status: "REJECTED" } }),
    prisma.classRequest.count({ where: { status: "PENDING" } }),
  ]);

  const percent = total > 0 ? Math.round((success / total) * 100) : 0;

  return {
    success,
    rejected,
    pending,
    total,
    percent,
  };
}

async function getTopTutors(): Promise<TopTutor[]> {
  const topAssignments = await prisma.classAssignment.groupBy({
    by: ["tutorId"],
    _count: { tutorId: true },
    orderBy: { _count: { tutorId: "desc" } },
    take: 3,
  });

  if (topAssignments.length === 0) {
    return [];
  }

  const tutorIds = topAssignments.map((item) => item.tutorId);
  const tutors = await prisma.tutor.findMany({
    where: { id: { in: tutorIds } },
    select: { id: true, fullName: true, subjects: true },
  });

  const tutorLookup = new Map(tutors.map((tutor) => [tutor.id, tutor]));

  return topAssignments.map((row) => {
    const tutor = tutorLookup.get(row.tutorId);

    return {
      id: row.tutorId,
      fullName: tutor?.fullName ?? "",
      subjects: tutor?.subjects ?? [],
      lessonCount: normalizeCount(row._count.tutorId),
    };
  });
}

async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw(Prisma.sql`SELECT 1`);
    return true;
  } catch {
    return false;
  }
}

async function checkCacheHealth(): Promise<boolean> {
  if (!cacheService.isEnabled()) {
    return false;
  }

  try {
    const key = buildCacheKey("health", "ping");
    await cacheService.set(key, "ok", 5);
    const value = await cacheService.get(key);
    await cacheService.del(key);
    return value === "ok";
  } catch {
    return false;
  }
}

async function getSystemHealth(): Promise<SystemHealthItem[]> {
  const [dbHealthy, cacheHealthy] = await Promise.all([
    checkDatabaseHealth(),
    checkCacheHealth(),
  ]);

  const emailConfigured = Boolean(env.RESEND_API_KEY && env.EMAIL_FROM);

  return [
    {
      service: "Dịch vụ lõi",
      status: "Hoạt động bình thường",
      ratio: "100%",
    },
    {
      service: "Cơ sở dữ liệu",
      status: dbHealthy ? "Hoạt động bình thường" : "Gián đoạn",
      ratio: dbHealthy ? "100%" : "0%",
    },
    {
      service: "Bộ nhớ đệm",
      status: cacheHealthy ? "Hoạt động bình thường" : "Chưa sẵn sàng",
      ratio: cacheHealthy ? "100%" : "0%",
    },
    {
      service: "Thư điện tử",
      status: emailConfigured ? "Sẵn sàng" : "Chưa cấu hình",
      ratio: emailConfigured ? "100%" : "0%",
    },
  ];
}

function isPrismaConstraintError(error: unknown, code: string): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === code
  );
}

function getTutorOrderBy(
  sort?: string,
): Prisma.TutorOrderByWithRelationInput[] {
  if (sort === "active-most" || sort === "rating") {
    return [{ assignments: { _count: "desc" } }, { createdAt: "desc" }];
  }

  return [{ createdAt: "desc" }];
}

async function resolveActorName(actor: AdminActor): Promise<string> {
  const admin = await prisma.admin.findUnique({
    where: { id: actor.id },
    select: { fullName: true },
  });

  return admin?.fullName ?? actor.email;
}

async function getDashboardStatsFromDb(): Promise<{
  pendingTutors: number;
  pendingRequests: number;
  openClasses: number;
  pendingPayments: number;
}> {
  const rows = await prisma.$queryRaw<DashboardStatsRow[]>(Prisma.sql`
    SELECT
      (SELECT COUNT(*) FROM tutors WHERE status = 'PENDING') AS pending_tutors,
      (SELECT COUNT(*) FROM classes WHERE status = 'OPEN') AS open_classes,
      (SELECT COUNT(*) FROM class_requests WHERE status = 'PENDING') AS pending_requests,
      (
        SELECT COUNT(*)
        FROM (
          SELECT DISTINCT ON (class_id) class_id, status
          FROM payments
          WHERE class_id IS NOT NULL
          ORDER BY class_id, created_at DESC
        ) latest_payments
        WHERE latest_payments.status = 'PENDING'
      ) AS pending_payments
  `);

  const row = rows[0];

  return {
    pendingTutors: normalizeCount(row?.pending_tutors),
    pendingRequests: normalizeCount(row?.pending_requests),
    openClasses: normalizeCount(row?.open_classes),
    pendingPayments: normalizeCount(row?.pending_payments),
  };
}

export const adminService = {
  async getDashboardStats(): Promise<{
    pendingTutors: number;
    pendingRequests: number;
    openClasses: number;
    pendingPayments: number;
  }> {
    return getDashboardStatsFromDb();
  },

  async getDashboard(): Promise<{
    stats: {
      pendingTutors: number;
      pendingRequests: number;
      openClasses: number;
      pendingPayments: number;
    };
    recentAudit: Array<{
      id: string;
      action: string;
      targetType: string;
      targetId: string;
      actorName: string;
      createdAt: Date;
    }>;
    matchingRate: MatchingRate;
    topTutors: TopTutor[];
    systemHealth: SystemHealthItem[];
  }> {
    const [stats, recentAudit, matchingRate, topTutors, systemHealth] =
      await Promise.all([
        getDashboardStatsFromDb(),
        prisma.auditLog.findMany({
          take: 10,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            action: true,
            targetType: true,
            targetId: true,
            actorName: true,
            createdAt: true,
          },
        }),
        getMatchingRate(),
        getTopTutors(),
        getSystemHealth(),
      ]);

    return {
      stats,
      recentAudit,
      matchingRate,
      topTutors,
      systemHealth,
    };
  },

  async listTutors(query: {
    page?: string | number;
    limit?: string | number;
    status?: TutorApprovalStatus;
    search?: string;
    phone?: string;
    subject?: string;
    subjects?: string[];
    district?: string;
    districts?: string[];
    sort?: "newest" | "active-most" | "rating";
  }): Promise<{
    data: Array<{
      id: string;
      fullName: string;
      email: string;
      phone: string | null;
      status: TutorApprovalStatus;
      subjects: string[];
      districts: string[];
      createdAt: Date;
      approvedAt: Date | null;
    }>;
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const { page, limit, skip } = parsePagination(query);

    const where: any = { AND: [] };

    if (query.status) {
      where.AND.push({ status: query.status });
    }

    if (query.search) {
      where.AND.push({
        OR: [
          { email: { contains: query.search, mode: "insensitive" } },
          { fullName: { contains: query.search, mode: "insensitive" } },
          { phone: { contains: query.search, mode: "insensitive" } },
        ],
      });
    }

    if (query.phone) {
      where.AND.push({
        phone: { contains: query.phone, mode: "insensitive" },
      });
    }

    if (query.subject) {
      where.AND.push({ subjects: { has: query.subject } });
    }

    if (query.subjects && query.subjects.length > 0) {
      where.AND.push({ subjects: { hasSome: query.subjects } });
    }

    if (query.district) {
      where.AND.push({ districts: { has: query.district } });
    }

    if (query.districts && query.districts.length > 0) {
      where.AND.push({ districts: { hasSome: query.districts } });
    }

    if (where.AND.length === 0) {
      delete where.AND;
    }

    const orderBy = getTutorOrderBy(query.sort);
    const [data, total] = await Promise.all([
      prisma.tutor.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          status: true,
          subjects: true,
          districts: true,
          createdAt: true,
          approvedAt: true,
        },
      }),
      prisma.tutor.count({ where }),
    ]);

    return {
      data,
      meta: buildMeta(page, limit, total),
    };
  },

  async createTutor(
    actor: AdminActor,
    body: {
      fullName: string;
      email: string;
      phone?: string;
      subjects: string[];
      districts: string[];
    },
  ): Promise<{ id: string }> {
    const tempPassword = generateTempPassword();
    const passwordHash = await hashPassword(tempPassword);
    const actorName = await resolveActorName(actor);

    try {
      const tutor = await prisma.$transaction(async (tx: any) => {
        const created = await tx.tutor.create({
          data: {
            fullName: body.fullName,
            email: body.email,
            phone: body.phone ?? null,
            subjects: body.subjects,
            districts: body.districts,
            status: "APPROVED",
            approvedAt: new Date(),
            approvedById: actor.id,
            passwordHash,
          },
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        });

        await auditLogService.log(
          {
            actorId: actor.id,
            actorName,
            action: "CREATE_TUTOR",
            targetType: "TUTOR",
            targetId: created.id,
          },
          tx,
        );

        return created;
      });

      await emailService.sendTutorApproved(
        tutor.email,
        tutor.fullName,
        tempPassword,
      );

      return { id: tutor.id };
    } catch (error) {
      if (isPrismaConstraintError(error, "P2002")) {
        conflict("Tutor email already exists");
      }

      throw error;
    }
  },

  async updateTutor(
    actor: AdminActor,
    tutorId: string,
    body: {
      fullName?: string;
      email?: string;
      phone?: string;
      subjects?: string[];
      districts?: string[];
    },
  ): Promise<{
    id: string;
    fullName: string;
    email: string;
    phone: string | null;
    status: TutorApprovalStatus;
    subjects: string[];
    districts: string[];
    rejectReason: string | null;
    approvedAt: Date | null;
    approvedBy: { id: string; fullName: string } | null;
    createdAt: Date;
    updatedAt: Date;
    _count: {
      applications: number;
      assignments: number;
      payments: number;
    };
  }> {
    const existing = await prisma.tutor.findUnique({
      where: { id: tutorId },
      select: {
        fullName: true,
        email: true,
        phone: true,
        subjects: true,
        districts: true,
      },
    });

    if (!existing) {
      throw new AppError("TUTOR_NOT_FOUND", 404, "Tutor not found");
    }

    const data: Prisma.TutorUpdateInput = {};

    if (body.fullName !== undefined) {
      data.fullName = body.fullName;
    }

    if (body.email !== undefined) {
      data.email = body.email;
    }

    if (body.phone !== undefined) {
      data.phone = body.phone ?? null;
    }

    if (body.subjects !== undefined) {
      data.subjects = body.subjects;
    }

    if (body.districts !== undefined) {
      data.districts = body.districts;
    }

    const actorName = await resolveActorName(actor);

    try {
      await prisma.$transaction(async (tx: any) => {
        const result = await tx.tutor.update({
          where: { id: tutorId },
          data,
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            subjects: true,
            districts: true,
          },
        });

        await auditLogService.log(
          {
            actorId: actor.id,
            actorName,
            action: "UPDATE_TUTOR",
            targetType: "TUTOR",
            targetId: tutorId,
            payload: {
              before: existing,
              after: {
                fullName: result.fullName,
                email: result.email,
                phone: result.phone,
                subjects: result.subjects,
                districts: result.districts,
              },
            },
          },
          tx,
        );
      });

      const detail = await prisma.tutor.findUnique({
        where: { id: tutorId },
        include: {
          approvedBy: {
            select: {
              id: true,
              fullName: true,
            },
          },
          _count: {
            select: {
              applications: true,
              assignments: true,
              payments: true,
            },
          },
        },
      });

      if (!detail) {
        throw new AppError("TUTOR_NOT_FOUND", 404, "Tutor not found");
      }

      return detail;
    } catch (error) {
      if (isPrismaConstraintError(error, "P2002")) {
        conflict("Tutor email already exists");
      }

      throw error;
    }
  },

  async getTutorById(tutorId: string): Promise<{
    id: string;
    fullName: string;
    email: string;
    phone: string | null;
    status: TutorApprovalStatus;
    subjects: string[];
    districts: string[];
    rejectReason: string | null;
    approvedAt: Date | null;
    approvedBy: { id: string; fullName: string } | null;
    createdAt: Date;
    updatedAt: Date;
    _count: {
      applications: number;
      assignments: number;
      payments: number;
    };
  }> {
    const tutor = await prisma.tutor.findUnique({
      where: { id: tutorId },
      include: {
        approvedBy: {
          select: {
            id: true,
            fullName: true,
          },
        },
        _count: {
          select: {
            applications: true,
            assignments: true,
            payments: true,
          },
        },
      },
    });

    if (!tutor) {
      throw new AppError("TUTOR_NOT_FOUND", 404, "Tutor not found");
    }

    return tutor;
  },

  async approveTutor(
    actor: AdminActor,
    tutorId: string,
  ): Promise<{ tutorId: string; approved: true }> {
    const tutor = await prisma.tutor.findUnique({
      where: { id: tutorId },
      select: {
        id: true,
        email: true,
        fullName: true,
        status: true,
      },
    });

    if (!tutor) {
      throw new AppError("TUTOR_NOT_FOUND", 404, "Tutor not found");
    }

    if (tutor.status !== "PENDING") {
      invalidState("Only pending tutor can be approved");
    }

    const tempPassword = generateTempPassword();
    const passwordHash = await hashPassword(tempPassword);
    const actorName = await resolveActorName(actor);

    await prisma.$transaction(async (tx: any) => {
      await tx.tutor.update({
        where: { id: tutorId },
        data: {
          status: "APPROVED",
          rejectReason: null,
          approvedAt: new Date(),
          approvedById: actor.id,
          passwordHash,
        },
      });

      await auditLogService.log(
        {
          actorId: actor.id,
          actorName,
          action: "APPROVE_TUTOR",
          targetType: "TUTOR",
          targetId: tutorId,
          payload: {
            previousStatus: tutor.status,
            nextStatus: "APPROVED",
          },
        },
        tx,
      );
    });

    await emailService.sendTutorApproved(
      tutor.email,
      tutor.fullName,
      tempPassword,
    );

    return { tutorId, approved: true };
  },

  async rejectTutor(
    actor: AdminActor,
    tutorId: string,
    reason: string,
  ): Promise<{ tutorId: string; rejected: true }> {
    const tutor = await prisma.tutor.findUnique({
      where: { id: tutorId },
      select: {
        id: true,
        status: true,
        email: true,
        fullName: true,
      },
    });

    if (!tutor) {
      throw new AppError("TUTOR_NOT_FOUND", 404, "Tutor not found");
    }

    if (tutor.status !== "PENDING") {
      invalidState("Only pending tutor can be rejected");
    }

    const actorName = await resolveActorName(actor);

    await prisma.$transaction(async (tx: any) => {
      await tx.tutor.update({
        where: { id: tutorId },
        data: {
          status: "REJECTED",
          rejectReason: reason,
          approvedAt: null,
          approvedById: null,
        },
      });

      await auditLogService.log(
        {
          actorId: actor.id,
          actorName,
          action: "REJECT_TUTOR",
          targetType: "TUTOR",
          targetId: tutorId,
          payload: {
            previousStatus: tutor.status,
            nextStatus: "REJECTED",
            reason,
          },
        },
        tx,
      );
    });

    await emailService.sendTutorRejected(tutor.email, tutor.fullName, reason);

    return { tutorId, rejected: true };
  },

  async listClassRequests(query: {
    page?: string | number;
    limit?: string | number;
    status?: "PENDING" | "CONVERTED" | "REJECTED";
  }): Promise<{
    data: Array<{
      id: string;
      parentName: string;
      parentPhone: string;
      subject: string;
      grade: string;
      district: string;
      budgetPerHour: number;
      status: "PENDING" | "CONVERTED" | "REJECTED";
      createdAt: Date;
    }>;
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const { page, limit, skip } = parsePagination(query);

    const where: any = {};

    if (query.status) {
      where.status = query.status;
    }

    const [data, total] = await Promise.all([
      prisma.classRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          parentName: true,
          parentPhone: true,
          subject: true,
          grade: true,
          district: true,
          budgetPerHour: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.classRequest.count({ where }),
    ]);

    return {
      data,
      meta: buildMeta(page, limit, total),
    };
  },

  async getClassRequestById(requestId: string) {
    const request = await prisma.classRequest.findUnique({
      where: { id: requestId },
      include: {
        members: {
          select: {
            id: true,
            studentName: true,
            studentGrade: true,
            parentName: true,
            parentPhone: true,
            parentEmail: true,
            address: true,
            classId: true,
          },
        },
        processedBy: {
          select: {
            id: true,
            fullName: true,
          },
        },
        classes: {
          select: {
            id: true,
            title: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!request) {
      throw new AppError(
        "CLASS_REQUEST_NOT_FOUND",
        404,
        "Class request not found",
      );
    }

    return request;
  },

  async convertClassRequest(
    actor: AdminActor,
    requestId: string,
    input: {
      title?: string;
      feePerHour?: number;
      schedule?: string;
    },
  ): Promise<{ classId: string; converted: true }> {
    const request = await prisma.classRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new AppError(
        "CLASS_REQUEST_NOT_FOUND",
        404,
        "Class request not found",
      );
    }

    if (request.status !== "PENDING") {
      invalidState("Only pending request can be converted");
    }

    const actorName = await resolveActorName(actor);

    const createdClass = await prisma.$transaction(async (tx: any) => {
      const newClass = await tx.class.create({
        data: {
          title: input.title ?? `${request.subject} ${request.grade}`,
          subject: request.subject,
          grade: request.grade,
          district: request.district,
          feePerHour: input.feePerHour ?? request.budgetPerHour,
          schedule: input.schedule,
          status: "OPEN",
          sourceRequestId: request.id,
          createdById: actor.id,
        },
        select: {
          id: true,
        },
      });

      const updatedMembers = await tx.classMember.updateMany({
        where: { requestId: request.id },
        data: { classId: newClass.id },
      });

      if (updatedMembers.count === 0) {
        await tx.classMember.create({
          data: {
            requestId: request.id,
            classId: newClass.id,
            studentName: "Hoc vien",
            studentGrade: request.grade,
            parentName: request.parentName,
            parentPhone: request.parentPhone,
            parentEmail: request.parentEmail,
          },
        });
      }

      await tx.classRequest.update({
        where: { id: request.id },
        data: {
          status: "CONVERTED",
          processedAt: new Date(),
          processedById: actor.id,
        },
      });

      await auditLogService.log(
        {
          actorId: actor.id,
          actorName,
          action: "CONVERT_REQUEST",
          targetType: "CLASS_REQUEST",
          targetId: request.id,
          payload: {
            classId: newClass.id,
            migratedMembers: updatedMembers.count,
          },
        },
        tx,
      );

      return newClass;
    });

    return {
      classId: createdClass.id,
      converted: true,
    };
  },

  async rejectClassRequest(
    actor: AdminActor,
    requestId: string,
    reason: string,
  ): Promise<{ requestId: string; rejected: true }> {
    const request = await prisma.classRequest.findUnique({
      where: { id: requestId },
      select: {
        id: true,
        status: true,
      },
    });

    if (!request) {
      throw new AppError(
        "CLASS_REQUEST_NOT_FOUND",
        404,
        "Class request not found",
      );
    }

    if (request.status !== "PENDING") {
      invalidState("Only pending request can be rejected");
    }

    const actorName = await resolveActorName(actor);

    await prisma.$transaction(async (tx: any) => {
      await tx.classRequest.update({
        where: { id: requestId },
        data: {
          status: "REJECTED",
          processedAt: new Date(),
          processedById: actor.id,
        },
      });

      await auditLogService.log(
        {
          actorId: actor.id,
          actorName,
          action: "REJECT_REQUEST",
          targetType: "CLASS_REQUEST",
          targetId: requestId,
          payload: {
            reason,
          },
        },
        tx,
      );
    });

    return { requestId, rejected: true };
  },

  async listClasses(query: {
    page?: string | number;
    limit?: string | number;
    status?: "OPEN" | "ASSIGNED" | "CLOSED";
    subject?: string;
    district?: string;
  }): Promise<{
    data: Array<{
      id: string;
      title: string;
      subject: string;
      grade: string;
      district: string;
      feePerHour: number;
      status: "OPEN" | "ASSIGNED" | "CLOSED";
      createdAt: Date;
      _count: {
        applications: number;
        members: number;
      };
    }>;
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const { page, limit, skip } = parsePagination(query);

    const where: any = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.subject) {
      where.subject = { contains: query.subject, mode: "insensitive" };
    }

    if (query.district) {
      where.district = { contains: query.district, mode: "insensitive" };
    }

    const [data, total] = await Promise.all([
      prisma.class.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          subject: true,
          grade: true,
          district: true,
          feePerHour: true,
          status: true,
          createdAt: true,
          _count: {
            select: {
              applications: true,
              members: true,
            },
          },
        },
      }),
      prisma.class.count({ where }),
    ]);

    return {
      data,
      meta: buildMeta(page, limit, total),
    };
  },

  async createClass(
    actor: AdminActor,
    input: {
      title: string;
      subject: string;
      grade: string;
      district: string;
      feePerHour: number;
      schedule?: string;
      sourceRequestId?: string;
    },
  ) {
    const actorName = await resolveActorName(actor);

    const created = await prisma.$transaction(async (tx: any) => {
      const newClass = await tx.class.create({
        data: {
          title: input.title,
          subject: input.subject,
          grade: input.grade,
          district: input.district,
          feePerHour: input.feePerHour,
          schedule: input.schedule,
          sourceRequestId: input.sourceRequestId,
          createdById: actor.id,
          status: "OPEN",
        },
      });

      if (input.sourceRequestId) {
        await tx.classMember.updateMany({
          where: { requestId: input.sourceRequestId },
          data: { classId: newClass.id },
        });
      }

      await auditLogService.log(
        {
          actorId: actor.id,
          actorName,
          action: "CREATE_CLASS",
          targetType: "CLASS",
          targetId: newClass.id,
          payload: {
            subject: newClass.subject,
            district: newClass.district,
          },
        },
        tx,
      );

      return newClass;
    });

    return created;
  },

  async getClassById(classId: string) {
    const classItem = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        members: {
          select: {
            id: true,
            studentName: true,
            studentGrade: true,
            parentName: true,
            parentPhone: true,
            parentEmail: true,
            address: true,
          },
        },
        payments: {
          take: 5,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            status: true,
            amount: true,
            attemptCount: true,
            createdAt: true,
          },
        },
        sourceRequest: true,
        assignment: {
          include: {
            tutor: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
            assignedBy: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!classItem) {
      throw new AppError("CLASS_NOT_FOUND", 404, "Class not found");
    }

    return classItem;
  },

  async updateClass(
    actor: AdminActor,
    classId: string,
    input: {
      title?: string;
      subject?: string;
      grade?: string;
      district?: string;
      feePerHour?: number;
      schedule?: string;
    },
  ) {
    const classItem = await prisma.class.findUnique({
      where: { id: classId },
      select: { id: true, status: true },
    });

    if (!classItem) {
      throw new AppError("CLASS_NOT_FOUND", 404, "Class not found");
    }

    if (classItem.status === "CLOSED") {
      invalidState("Closed class cannot be updated");
    }

    const actorName = await resolveActorName(actor);

    return prisma.$transaction(async (tx: any) => {
      const updated = await tx.class.update({
        where: { id: classId },
        data: input,
      });

      await auditLogService.log(
        {
          actorId: actor.id,
          actorName,
          action: "UPDATE_CLASS",
          targetType: "CLASS",
          targetId: classId,
          payload: input,
        },
        tx,
      );

      return updated;
    });
  },

  async closeClass(actor: AdminActor, classId: string) {
    const classItem = await prisma.class.findUnique({
      where: { id: classId },
      select: { id: true, status: true },
    });

    if (!classItem) {
      throw new AppError("CLASS_NOT_FOUND", 404, "Class not found");
    }

    if (classItem.status === "CLOSED") {
      invalidState("Class is already closed");
    }

    const actorName = await resolveActorName(actor);

    return prisma.$transaction(async (tx: any) => {
      const updated = await tx.class.update({
        where: { id: classId },
        data: {
          status: "CLOSED",
          closedAt: new Date(),
        },
      });

      await auditLogService.log(
        {
          actorId: actor.id,
          actorName,
          action: "CLOSE_CLASS",
          targetType: "CLASS",
          targetId: classId,
          payload: {
            previousStatus: classItem.status,
            nextStatus: "CLOSED",
          },
        },
        tx,
      );

      return updated;
    });
  },

  async listClassApplicants(classId: string) {
    const classItem = await prisma.class.findUnique({
      where: { id: classId },
      select: { id: true },
    });

    if (!classItem) {
      throw new AppError("CLASS_NOT_FOUND", 404, "Class not found");
    }

    return prisma.classApplication.findMany({
      where: { classId },
      orderBy: { createdAt: "asc" },
      include: {
        tutor: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            subjects: true,
            districts: true,
            status: true,
          },
        },
      },
    });
  },

  async assignClass(
    actor: AdminActor,
    classId: string,
    tutorId: string,
    note?: string,
  ) {
    const classItem = await prisma.class.findUnique({
      where: { id: classId },
      select: {
        id: true,
        title: true,
      },
    });

    if (!classItem) {
      throw new AppError("CLASS_NOT_FOUND", 404, "Class not found");
    }

    const selectedApplication = await prisma.classApplication.findUnique({
      where: {
        classId_tutorId: {
          classId,
          tutorId,
        },
      },
      include: {
        tutor: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!selectedApplication) {
      throw new AppError(
        "APPLICATION_NOT_FOUND",
        404,
        "Selected tutor has not applied for this class",
      );
    }

    if (selectedApplication.status === "REJECTED") {
      invalidState("Rejected application cannot be assigned");
    }

    const actorName = await resolveActorName(actor);

    try {
      const assignment = await prisma.$transaction(async (tx: any) => {
        const openGuard = await tx.class.updateMany({
          where: {
            id: classId,
            status: "OPEN",
          },
          data: {
            status: "OPEN",
          },
        });

        if (openGuard.count === 0) {
          conflict("Class is no longer OPEN");
        }

        const createdAssignment = await tx.classAssignment.create({
          data: {
            classId,
            tutorId,
            assignedById: actor.id,
            note,
          },
        });

        await tx.classApplication.update({
          where: {
            classId_tutorId: {
              classId,
              tutorId,
            },
          },
          data: {
            status: "ACCEPTED",
          },
        });

        await tx.classApplication.updateMany({
          where: {
            classId,
            tutorId: {
              not: tutorId,
            },
          },
          data: {
            status: "REJECTED",
            note: AUTO_REJECT_NOTE,
          },
        });

        await tx.class.update({
          where: { id: classId },
          data: {
            status: "ASSIGNED",
          },
        });

        await auditLogService.log(
          {
            actorId: actor.id,
            actorName,
            action: "ASSIGN_CLASS",
            targetType: "CLASS",
            targetId: classId,
            payload: {
              tutorId,
              note,
            },
          },
          tx,
        );

        return createdAssignment;
      });

      await emailService.sendClassAssignmentFeeRequest(
        selectedApplication.tutor.email,
        selectedApplication.tutor.fullName,
        {
          classId,
          classTitle: classItem.title,
          note,
        },
      );

      return assignment;
    } catch (error) {
      if (
        isPrismaConstraintError(error, "P2002") ||
        isPrismaConstraintError(error, "P2034")
      ) {
        conflict("Class has already been assigned by another admin");
      }

      throw error;
    }
  },

  async listPayments(query: {
    page?: string | number;
    limit?: string | number;
    status?: PaymentStatus;
    classId?: string;
    tutorId?: string;
    latestOnly?: boolean;
  }) {
    const { page, limit, skip } = parsePagination(query);
    const latestOnly = query.latestOnly ?? true;

    if (!latestOnly) {
      const where: any = {};

      if (query.status) {
        where.status = query.status;
      }

      if (query.classId) {
        where.classId = query.classId;
      }

      if (query.tutorId) {
        where.tutorId = query.tutorId;
      }

      const [data, total] = await Promise.all([
        prisma.payment.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            tutor: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
            class: {
              select: {
                id: true,
                title: true,
                status: true,
              },
            },
          },
        }),
        prisma.payment.count({ where }),
      ]);

      return {
        data,
        meta: buildMeta(page, limit, total),
      };
    }

    const filterConditions: Prisma.Sql[] = [Prisma.sql`p.class_id IS NOT NULL`];

    if (query.classId) {
      filterConditions.push(Prisma.sql`p.class_id = ${query.classId}`);
    }

    if (query.tutorId) {
      filterConditions.push(Prisma.sql`p.tutor_id = ${query.tutorId}`);
    }

    const latestConditions: Prisma.Sql[] = [];

    if (query.status) {
      latestConditions.push(Prisma.sql`l.status = ${query.status}`);
    }

    const filteredWhere = Prisma.sql`
      WHERE ${Prisma.join(filterConditions, " AND ")}
    `;

    const latestWhere =
      latestConditions.length > 0
        ? Prisma.sql`WHERE ${Prisma.join(latestConditions, " AND ")}`
        : Prisma.empty;

    const data = await prisma.$queryRaw<LatestPaymentRow[]>(Prisma.sql`
      WITH filtered AS (
        SELECT p.*
        FROM payments p
        ${filteredWhere}
      ),
      latest AS (
        SELECT DISTINCT ON (class_id)
          id,
          class_id,
          tutor_id,
          amount,
          bill_image_url,
          status,
          note,
          reviewed_by_id,
          reviewed_at,
          created_at,
          updated_at
        FROM filtered
        ORDER BY class_id, created_at DESC
      ),
      attempts AS (
        SELECT class_id, COUNT(*)::int AS attempt_count
        FROM filtered
        GROUP BY class_id
      )
      SELECT
        l.id,
        l.class_id,
        l.tutor_id,
        l.amount,
        l.bill_image_url,
        l.status,
        l.note,
        l.reviewed_by_id,
        l.reviewed_at,
        l.created_at,
        l.updated_at,
        a.attempt_count,
        t.full_name AS tutor_full_name,
        t.email AS tutor_email,
        c.title AS class_title,
        c.status AS class_status
      FROM latest l
      JOIN attempts a ON a.class_id = l.class_id
      JOIN tutors t ON t.id = l.tutor_id
      LEFT JOIN classes c ON c.id = l.class_id
      ${latestWhere}
      ORDER BY l.created_at DESC
      LIMIT ${limit} OFFSET ${skip}
    `);

    const totalRows = await prisma.$queryRaw<Array<{ total: bigint | number }>>(
      Prisma.sql`
        WITH filtered AS (
          SELECT p.*
          FROM payments p
          ${filteredWhere}
        ),
        latest AS (
          SELECT DISTINCT ON (class_id)
            class_id,
            status,
            created_at
          FROM filtered
          ORDER BY class_id, created_at DESC
        )
        SELECT COUNT(*) AS total
        FROM latest l
        ${latestWhere}
      `,
    );

    return {
      data: data.map((row) => ({
        id: row.id,
        classId: row.class_id,
        tutorId: row.tutor_id,
        amount: row.amount,
        billImageUrl: row.bill_image_url,
        status: row.status,
        note: row.note,
        reviewedById: row.reviewed_by_id,
        reviewedAt: row.reviewed_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        attemptCount: row.attempt_count,
        tutor: {
          id: row.tutor_id,
          fullName: row.tutor_full_name,
          email: row.tutor_email,
        },
        class: {
          id: row.class_id,
          title: row.class_title ?? `Lop ${row.class_id}`,
          status: row.class_status ?? "OPEN",
        },
      })),
      meta: buildMeta(page, limit, normalizeCount(totalRows[0]?.total)),
    };
  },

  async getPaymentById(paymentId: string) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        class: {
          select: {
            id: true,
            title: true,
            status: true,
            members: {
              select: {
                id: true,
                studentName: true,
                studentGrade: true,
                parentName: true,
                parentPhone: true,
                parentEmail: true,
                address: true,
              },
            },
          },
        },
        tutor: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        reviewedBy: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });

    if (!payment) {
      throw new AppError("PAYMENT_NOT_FOUND", 404, "Payment not found");
    }

    return payment;
  },

  async confirmPayment(actor: AdminActor, paymentId: string, note?: string) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        class: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
        tutor: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!payment) {
      throw new AppError("PAYMENT_NOT_FOUND", 404, "Payment not found");
    }

    if (payment.status !== "PENDING") {
      invalidState("Only pending payment can be confirmed");
    }

    if (!payment.classId || !payment.class) {
      invalidState("Payment is not linked to a class");
    }

    if (payment.class.status !== "ASSIGNED") {
      invalidState("Class must be ASSIGNED before confirming payment");
    }

    const actorName = await resolveActorName(actor);

    const result = await prisma.$transaction(async (tx: any) => {
      const updated = await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: "CONFIRMED",
          note,
          reviewedAt: new Date(),
          reviewedById: actor.id,
        },
      });

      const members = await tx.classMember.findMany({
        where: { classId: payment.classId },
        select: {
          studentName: true,
          studentGrade: true,
          parentName: true,
          parentPhone: true,
          parentEmail: true,
          address: true,
        },
      });

      await auditLogService.log(
        {
          actorId: actor.id,
          actorName,
          action: "CONFIRM_PAYMENT",
          targetType: "PAYMENT",
          targetId: paymentId,
          payload: {
            previousStatus: payment.status,
            nextStatus: "CONFIRMED",
            note,
            classId: payment.classId,
            unlockedMembers: members.length,
          },
        },
        tx,
      );

      return { updated, members };
    });

    await emailService.sendPaymentConfirmedWithMembers(
      payment.tutor.email,
      payment.tutor.fullName,
      {
        classId: payment.classId,
        classTitle: payment.class.title,
        members: result.members,
      },
    );

    return result.updated;
  },

  async rejectPayment(actor: AdminActor, paymentId: string, note?: string) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      select: {
        id: true,
        status: true,
      },
    });

    if (!payment) {
      throw new AppError("PAYMENT_NOT_FOUND", 404, "Payment not found");
    }

    if (payment.status !== "PENDING") {
      invalidState("Only pending payment can be rejected");
    }

    const actorName = await resolveActorName(actor);

    return prisma.$transaction(async (tx: any) => {
      const updated = await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: "REJECTED",
          note,
          reviewedAt: new Date(),
          reviewedById: actor.id,
        },
      });

      await auditLogService.log(
        {
          actorId: actor.id,
          actorName,
          action: "REJECT_PAYMENT",
          targetType: "PAYMENT",
          targetId: paymentId,
          payload: {
            previousStatus: payment.status,
            nextStatus: "REJECTED",
            note,
          },
        },
        tx,
      );

      return updated;
    });
  },

  async listAuditLogs(query: {
    page?: string | number;
    limit?: string | number;
    action?: string;
    targetType?: string;
    actorId?: string;
  }) {
    const { page, limit, skip } = parsePagination(query);

    const where: any = {};

    if (query.action) {
      where.action = { contains: query.action, mode: "insensitive" };
    }

    if (query.targetType) {
      where.targetType = { contains: query.targetType, mode: "insensitive" };
    }

    if (query.actorId) {
      where.actorId = query.actorId;
    }

    const [data, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return {
      data,
      meta: buildMeta(page, limit, total),
    };
  },
};
