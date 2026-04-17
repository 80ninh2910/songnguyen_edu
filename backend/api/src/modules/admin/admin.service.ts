import { AppError } from "../../common/errors/AppError.js";
import { buildMeta, parsePagination } from "../../common/utils/pagination.js";
import {
  generateTempPassword,
  hashPassword,
} from "../../common/utils/password.js";
import { prisma } from "../../config/prisma.js";
import { auditLogService } from "../../services/auditLog.service.js";
import { emailService } from "../../services/email.service.js";

type AdminActor = {
  id: string;
  email: string;
};

type TutorApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

function invalidState(message: string): never {
  throw new AppError("INVALID_STATE", 409, message);
}

async function resolveActorName(actor: AdminActor): Promise<string> {
  const admin = await prisma.admin.findUnique({
    where: { id: actor.id },
    select: { fullName: true },
  });

  return admin?.fullName ?? actor.email;
}

export const adminService = {
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
  }> {
    const [
      pendingTutors,
      pendingRequests,
      openClasses,
      pendingPayments,
      recentAudit,
    ] = await Promise.all([
      prisma.tutor.count({ where: { status: "PENDING" } }),
      prisma.classRequest.count({ where: { status: "PENDING" } }),
      prisma.class.count({ where: { status: "OPEN" } }),
      prisma.payment.count({ where: { status: "PENDING" } }),
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
    ]);

    return {
      stats: {
        pendingTutors,
        pendingRequests,
        openClasses,
        pendingPayments,
      },
      recentAudit,
    };
  },

  async listTutors(query: {
    page?: string | number;
    limit?: string | number;
    status?: TutorApprovalStatus;
    search?: string;
    subject?: string;
  }): Promise<{
    data: Array<{
      id: string;
      fullName: string;
      email: string;
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

    const where: any = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      where.OR = [
        { email: { contains: query.search, mode: "insensitive" } },
        { fullName: { contains: query.search, mode: "insensitive" } },
      ];
    }

    if (query.subject) {
      where.subjects = { has: query.subject };
    }

    const [data, total] = await Promise.all([
      prisma.tutor.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          fullName: true,
          email: true,
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

  async getTutorById(tutorId: string): Promise<{
    id: string;
    fullName: string;
    email: string;
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
        status: true,
      },
    });

    if (!classItem) {
      throw new AppError("CLASS_NOT_FOUND", 404, "Class not found");
    }

    if (classItem.status !== "OPEN") {
      invalidState("Only OPEN class can be assigned");
    }

    const selectedApplication = await prisma.classApplication.findUnique({
      where: {
        classId_tutorId: {
          classId,
          tutorId,
        },
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!selectedApplication) {
      throw new AppError(
        "APPLICATION_NOT_FOUND",
        404,
        "Selected tutor has not applied for this class",
      );
    }

    const existingAssignment = await prisma.classAssignment.findUnique({
      where: { classId },
      select: { id: true },
    });

    if (existingAssignment) {
      invalidState("Class is already assigned");
    }

    const actorName = await resolveActorName(actor);

    return prisma.$transaction(async (tx: any) => {
      const assignment = await tx.classAssignment.create({
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

      return assignment;
    });
  },

  async listPayments(query: {
    page?: string | number;
    limit?: string | number;
    status?: "PENDING" | "CONFIRMED" | "REJECTED";
  }) {
    const { page, limit, skip } = parsePagination(query);

    const where: any = {};

    if (query.status) {
      where.status = query.status;
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
        },
      }),
      prisma.payment.count({ where }),
    ]);

    return {
      data,
      meta: buildMeta(page, limit, total),
    };
  },

  async getPaymentById(paymentId: string) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
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
      select: {
        id: true,
        status: true,
      },
    });

    if (!payment) {
      throw new AppError("PAYMENT_NOT_FOUND", 404, "Payment not found");
    }

    if (payment.status === "CONFIRMED") {
      invalidState("Payment is already confirmed");
    }

    const actorName = await resolveActorName(actor);

    return prisma.$transaction(async (tx: any) => {
      const updated = await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: "CONFIRMED",
          note,
          reviewedAt: new Date(),
          reviewedById: actor.id,
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
          },
        },
        tx,
      );

      return updated;
    });
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

    if (payment.status === "REJECTED") {
      invalidState("Payment is already rejected");
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
