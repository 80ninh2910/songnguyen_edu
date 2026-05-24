import type { FastifyInstance, FastifyRequest } from "fastify";

import { AppError } from "../../common/errors/AppError.js";
import { errorResponseSchema, successSchema } from "../../common/utils/docs.js";
import { success } from "../../common/utils/response.js";
import { prisma } from "../../config/prisma.js";

const classIdParamSchema = {
  type: "object",
  required: ["classId"],
  properties: {
    classId: { type: "string", format: "uuid" },
  },
};

const paymentBodySchema = {
  type: "object",
  required: ["amount", "billImageUrl"],
  properties: {
    amount: { type: "number" },
    billImageUrl: { type: "string" },
    classId: { type: "string", format: "uuid" },
    note: { type: "string" },
  },
};

const sessionIdParamSchema = {
  type: "object",
  required: ["sessionId"],
  properties: {
    sessionId: { type: "string", format: "uuid" },
  },
};

const memberIdParamSchema = {
  type: "object",
  required: ["classId", "memberId"],
  properties: {
    classId: { type: "string", format: "uuid" },
    memberId: { type: "string", format: "uuid" },
  },
};

const createSessionBodySchema = {
  type: "object",
  required: ["sessionDate"],
  properties: {
    sessionDate: { type: "string", format: "date" },
    startTime: { type: "string" },
    endTime: { type: "string" },
    topic: { type: "string" },
    notes: { type: "string" },
  },
};

const updateSessionBodySchema = {
  type: "object",
  properties: {
    sessionDate: { type: "string", format: "date" },
    startTime: { type: "string" },
    endTime: { type: "string" },
    topic: { type: "string" },
    notes: { type: "string" },
  },
};

const feedbackBatchBodySchema = {
  type: "object",
  required: ["feedbacks"],
  properties: {
    feedbacks: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        required: ["memberId"],
        properties: {
          memberId: { type: "string", format: "uuid" },
          attendance: { type: "string" },
          attitudeScore: { type: "number" },
          comprehensionScore: { type: "number" },
          homeworkScore: { type: "number" },
          strengths: { type: "string" },
          weaknesses: { type: "string" },
          recommendation: { type: "string" },
          overallComment: { type: "string" },
        },
      },
    },
  },
};

const feedbackUpdateBodySchema = {
  type: "object",
  properties: {
    attendance: { type: "string" },
    attitudeScore: { type: "number" },
    comprehensionScore: { type: "number" },
    homeworkScore: { type: "number" },
    strengths: { type: "string" },
    weaknesses: { type: "string" },
    recommendation: { type: "string" },
    overallComment: { type: "string" },
  },
};

const attendanceValues = ["PRESENT", "ABSENT", "LATE", "EXCUSED"] as const;

function parseSessionDate(value: string): Date {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new AppError("INVALID_DATE", 400, "Invalid session date");
  }
  return parsed;
}

function validateScore(value: number | undefined, field: string): void {
  if (value === undefined || value === null) return;
  if (!Number.isFinite(value) || value < 1 || value > 5) {
    throw new AppError("INVALID_SCORE", 400, `${field} must be between 1 and 5`);
  }
}

export async function registerTutorRoutes(app: FastifyInstance): Promise<void> {
  const requireTutor = async (request: FastifyRequest): Promise<void> => {
    await request.jwtVerify();

    if (!request.user || request.user.role !== "TUTOR") {
      throw new AppError("FORBIDDEN", 403, "Insufficient permission");
    }
  };

  const getAssignedClassOrThrow = async (tutorId: string, classId: string) => {
    const assignment = await prisma.classAssignment.findUnique({
      where: { classId },
      select: {
        tutorId: true,
        class: {
          select: {
            id: true,
            title: true,
            subject: true,
            grade: true,
            district: true,
          },
        },
      },
    });

    if (!assignment) {
      throw new AppError("CLASS_NOT_ASSIGNED", 404, "Class is not assigned yet");
    }

    if (assignment.tutorId !== tutorId) {
      throw new AppError("FORBIDDEN", 403, "Insufficient permission");
    }

    return assignment.class;
  };

  app.get(
    "/profile",
    {
      preHandler: requireTutor,
      schema: {
        tags: ["Tutor"],
        summary: "Get tutor profile",
        response: {
          200: successSchema({ type: "object", additionalProperties: true }),
        },
      },
    },
    async (request, reply) => {
      const tutor = await prisma.tutor.findUnique({
        where: { id: request.user!.sub },
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          status: true,
          subjects: true,
          districts: true,
        },
      });

      if (!tutor) {
        throw new AppError("TUTOR_NOT_FOUND", 404, "Tutor not found");
      }

      void reply.send(success(tutor));
    },
  );

  app.patch(
    "/profile",
    {
      preHandler: requireTutor,
      schema: {
        tags: ["Tutor"],
        summary: "Update tutor profile",
        body: { type: "object", additionalProperties: true },
        response: {
          200: successSchema({
            type: "object",
            required: ["updated"],
            properties: {
              updated: { type: "boolean" },
              profile: { type: "object", additionalProperties: true },
            },
          }),
          400: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const body = request.body as {
        fullName?: string;
        phone?: string;
        subjects?: string[];
        districts?: string[];
      };

      const tutor = await prisma.tutor.update({
        where: { id: request.user!.sub },
        data: {
          fullName: body.fullName,
          phone: body.phone,
          subjects: body.subjects,
          districts: body.districts,
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          status: true,
          subjects: true,
          districts: true,
        },
      });

      void reply.send(success({ updated: true, profile: tutor }));
    },
  );

  app.get(
    "/classes",
    {
      preHandler: requireTutor,
      schema: {
        tags: ["Tutor"],
        summary: "List available classes for tutor",
        response: {
          200: successSchema({
            type: "array",
            items: { type: "object", additionalProperties: true },
          }),
        },
      },
    },
    async (request, reply) => {
      const classes = await prisma.class.findMany({
        where: { status: "OPEN" },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          subject: true,
          grade: true,
          district: true,
          feePerHour: true,
          schedule: true,
          status: true,
          applications: {
            where: { tutorId: request.user!.sub },
            select: { status: true },
          },
        },
      });

      const mapped = classes.map((item) => ({
        id: item.id,
        title: item.title,
        subject: item.subject,
        grade: item.grade,
        district: item.district,
        feePerHour: item.feePerHour,
        schedule: item.schedule,
        status: item.status,
        applicationStatus: item.applications[0]?.status ?? null,
      }));

      void reply.send(success(mapped));
    },
  );

  // GET /classes/:classId/apply — check application status for a class
  app.get(
    "/classes/:classId/apply",
    {
      preHandler: requireTutor,
      schema: {
        tags: ["Tutor"],
        summary: "Get application status for a class",
        params: classIdParamSchema,
        response: {
          200: successSchema({
            type: "object",
            properties: {
              applied: { type: "boolean" },
              status: { type: "string", nullable: true },
            },
          }),
        },
      },
    },
    async (request, reply) => {
      const { classId } = request.params as { classId: string };
      const application = await prisma.classApplication.findUnique({
        where: { classId_tutorId: { classId, tutorId: request.user!.sub } },
        select: { status: true },
      });
      void reply.send(success({
        applied: !!application,
        status: application?.status ?? null,
      }));
    },
  );

  app.post(
    "/classes/:classId/apply",
    {
      preHandler: requireTutor,
      schema: {
        tags: ["Tutor"],
        summary: "Apply to a class",
        params: classIdParamSchema,
        body: {
          type: "object",
          properties: {
            note: { type: "string" },
          },
        },
        response: {
          200: successSchema({
            type: "object",
            required: ["applied"],
            properties: {
              applied: { type: "boolean" },
            },
          }),
          400: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { classId } = request.params as { classId: string };
      const tutorId = request.user!.sub;

      // Guard: ensure tutor record still exists (handles stale JWT tokens)
      const tutorExists = await prisma.tutor.findUnique({
        where: { id: tutorId },
        select: { id: true, status: true },
      });

      if (!tutorExists) {
        throw new AppError("UNAUTHORIZED", 401, "Tutor account not found. Please login again.");
      }

      if (tutorExists.status !== "APPROVED") {
        throw new AppError("TUTOR_NOT_APPROVED", 403, "Tutor account is not approved yet.");
      }

      const existingClass = await prisma.class.findUnique({
        where: { id: classId },
        select: { id: true, status: true },
      });

      if (!existingClass || existingClass.status !== "OPEN") {
        throw new AppError(
          "CLASS_NOT_AVAILABLE",
          400,
          "Class is not available",
        );
      }

      const existing = await prisma.classApplication.findUnique({
        where: { classId_tutorId: { classId, tutorId } },
        select: { id: true },
      });

      if (!existing) {
        await prisma.classApplication.create({
          data: {
            classId,
            tutorId,
            note: (request.body as { note?: string } | undefined)?.note,
          },
        });
      }

      void reply.send(success({ applied: true }));
    },
  );

  app.delete(
    "/classes/:classId/apply",
    {
      preHandler: requireTutor,
      schema: {
        tags: ["Tutor"],
        summary: "Cancel class application",
        params: classIdParamSchema,
        response: {
          200: successSchema({
            type: "object",
            required: ["cancelled"],
            properties: {
              cancelled: { type: "boolean" },
            },
          }),
          400: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { classId } = request.params as { classId: string };
      const tutorId = request.user!.sub;

      // Only PENDING applications can be cancelled
      const application = await prisma.classApplication.findUnique({
        where: { classId_tutorId: { classId, tutorId } },
        select: { id: true, status: true },
      });

      if (!application) {
        throw new AppError("APPLICATION_NOT_FOUND", 404, "Application not found");
      }

      if (application.status !== "PENDING") {
        throw new AppError(
          "INVALID_STATE",
          409,
          `Cannot cancel an application with status ${application.status}`,
        );
      }

      await prisma.classApplication.delete({
        where: { classId_tutorId: { classId, tutorId } },
      });

      void reply.send(success({ cancelled: true }));
    },
  );

  app.get(
    "/applications",
    {
      preHandler: requireTutor,
      schema: {
        tags: ["Tutor"],
        summary: "List tutor applications",
        response: {
          200: successSchema({
            type: "array",
            items: { type: "object", additionalProperties: true },
          }),
        },
      },
    },
    async (request, reply) => {
      const applications = await prisma.classApplication.findMany({
        where: { tutorId: request.user!.sub },
        orderBy: { createdAt: "desc" },
        include: {
          class: {
            select: {
              id: true,
              title: true,
              subject: true,
              grade: true,
              district: true,
              feePerHour: true,
              schedule: true,
            },
          },
        },
      });

      const mapped = applications.map((item) => ({
        id: item.id,
        status: item.status,
        createdAt: item.createdAt,
        class: item.class,
      }));

      void reply.send(success(mapped));
    },
  );

  app.get(
    "/classes/:classId/sessions",
    {
      preHandler: requireTutor,
      schema: {
        tags: ["Tutor"],
        summary: "List sessions for assigned class",
        params: classIdParamSchema,
        response: {
          200: successSchema({
            type: "object",
            properties: {
              class: { type: "object", additionalProperties: true },
              memberCount: { type: "number" },
              sessions: { type: "array", items: { type: "object", additionalProperties: true } },
            },
          }),
        },
      },
    },
    async (request, reply) => {
      const { classId } = request.params as { classId: string };
      const classInfo = await getAssignedClassOrThrow(request.user!.sub, classId);
      const memberCount = await prisma.classMember.count({ where: { classId } });
      const sessions = await prisma.classSession.findMany({
        where: { classId },
        orderBy: { sessionNumber: "asc" },
        select: {
          id: true,
          sessionNumber: true,
          sessionDate: true,
          startTime: true,
          endTime: true,
          topic: true,
          notes: true,
          status: true,
          _count: { select: { feedbacks: true } },
        },
      });

      const mapped = sessions.map((session) => ({
        ...session,
        feedbackCount: session._count.feedbacks,
        totalMembers: memberCount,
      }));

      void reply.send(success({ class: classInfo, memberCount, sessions: mapped }));
    },
  );

  app.post(
    "/classes/:classId/sessions",
    {
      preHandler: requireTutor,
      schema: {
        tags: ["Tutor"],
        summary: "Create class session",
        params: classIdParamSchema,
        body: createSessionBodySchema,
        response: {
          200: successSchema({ type: "object", additionalProperties: true }),
          400: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { classId } = request.params as { classId: string };
      const tutorId = request.user!.sub;
      await getAssignedClassOrThrow(tutorId, classId);

      const body = request.body as {
        sessionDate: string;
        startTime?: string;
        endTime?: string;
        topic?: string;
        notes?: string;
      };

      const sessionDate = parseSessionDate(body.sessionDate);

      const created = await prisma.$transaction(async (tx) => {
        const maxRow = await tx.classSession.aggregate({
          where: { classId },
          _max: { sessionNumber: true },
        });
        const nextNumber = (maxRow._max.sessionNumber ?? 0) + 1;

        return tx.classSession.create({
          data: {
            classId,
            tutorId,
            sessionNumber: nextNumber,
            sessionDate,
            startTime: body.startTime,
            endTime: body.endTime,
            topic: body.topic,
            notes: body.notes,
          },
        });
      });

      void reply.send(success(created));
    },
  );

  app.get(
    "/sessions/:sessionId",
    {
      preHandler: requireTutor,
      schema: {
        tags: ["Tutor"],
        summary: "Get session detail",
        params: sessionIdParamSchema,
        response: {
          200: successSchema({ type: "object", additionalProperties: true }),
          404: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { sessionId } = request.params as { sessionId: string };
      const session = await prisma.classSession.findUnique({
        where: { id: sessionId },
        select: {
          id: true,
          classId: true,
          tutorId: true,
          sessionNumber: true,
          sessionDate: true,
          startTime: true,
          endTime: true,
          topic: true,
          notes: true,
          status: true,
          class: {
            select: {
              id: true,
              title: true,
              subject: true,
              grade: true,
              district: true,
              members: {
                select: {
                  id: true,
                  studentName: true,
                },
              },
            },
          },
        },
      });

      if (!session) {
        throw new AppError("SESSION_NOT_FOUND", 404, "Session not found");
      }

      if (session.tutorId !== request.user!.sub) {
        throw new AppError("FORBIDDEN", 403, "Insufficient permission");
      }

      void reply.send(success(session));
    },
  );

  app.patch(
    "/sessions/:sessionId",
    {
      preHandler: requireTutor,
      schema: {
        tags: ["Tutor"],
        summary: "Update session detail",
        params: sessionIdParamSchema,
        body: updateSessionBodySchema,
        response: {
          200: successSchema({ type: "object", additionalProperties: true }),
          404: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { sessionId } = request.params as { sessionId: string };
      const body = request.body as {
        sessionDate?: string;
        startTime?: string;
        endTime?: string;
        topic?: string;
        notes?: string;
      };

      const session = await prisma.classSession.findUnique({
        where: { id: sessionId },
        select: { tutorId: true },
      });

      if (!session) {
        throw new AppError("SESSION_NOT_FOUND", 404, "Session not found");
      }

      if (session.tutorId !== request.user!.sub) {
        throw new AppError("FORBIDDEN", 403, "Insufficient permission");
      }

      const data: {
        sessionDate?: Date;
        startTime?: string | null;
        endTime?: string | null;
        topic?: string | null;
        notes?: string | null;
      } = {};

      if (body.sessionDate) {
        data.sessionDate = parseSessionDate(body.sessionDate);
      }

      if (body.startTime !== undefined) data.startTime = body.startTime;
      if (body.endTime !== undefined) data.endTime = body.endTime;
      if (body.topic !== undefined) data.topic = body.topic;
      if (body.notes !== undefined) data.notes = body.notes;

      const updated = await prisma.classSession.update({
        where: { id: sessionId },
        data,
      });

      void reply.send(success(updated));
    },
  );

  app.patch(
    "/sessions/:sessionId/complete",
    {
      preHandler: requireTutor,
      schema: {
        tags: ["Tutor"],
        summary: "Complete session when all feedbacks are submitted",
        params: sessionIdParamSchema,
        response: {
          200: successSchema({ type: "object", additionalProperties: true }),
          400: errorResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { sessionId } = request.params as { sessionId: string };
      const session = await prisma.classSession.findUnique({
        where: { id: sessionId },
        select: { id: true, tutorId: true, classId: true, status: true },
      });

      if (!session) {
        throw new AppError("SESSION_NOT_FOUND", 404, "Session not found");
      }

      if (session.tutorId !== request.user!.sub) {
        throw new AppError("FORBIDDEN", 403, "Insufficient permission");
      }

      const totalMembers = await prisma.classMember.count({
        where: { classId: session.classId },
      });
      const feedbackCount = await prisma.sessionFeedback.count({
        where: { sessionId: session.id },
      });

      if (totalMembers === 0) {
        throw new AppError("NO_MEMBERS", 400, "Class has no members");
      }

      if (feedbackCount < totalMembers) {
        throw new AppError(
          "INCOMPLETE_FEEDBACK",
          400,
          "All students must be reviewed before completing the session",
        );
      }

      if (session.status === "COMPLETED") {
        void reply.send(success({ completed: true }));
        return;
      }

      const updated = await prisma.classSession.update({
        where: { id: session.id },
        data: { status: "COMPLETED" },
      });

      void reply.send(success(updated));
    },
  );

  app.get(
    "/sessions/:sessionId/feedbacks",
    {
      preHandler: requireTutor,
      schema: {
        tags: ["Tutor"],
        summary: "List feedbacks for a session",
        params: sessionIdParamSchema,
        response: {
          200: successSchema({ type: "array", items: { type: "object", additionalProperties: true } }),
          404: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { sessionId } = request.params as { sessionId: string };
      const session = await prisma.classSession.findUnique({
        where: { id: sessionId },
        select: { tutorId: true },
      });

      if (!session) {
        throw new AppError("SESSION_NOT_FOUND", 404, "Session not found");
      }

      if (session.tutorId !== request.user!.sub) {
        throw new AppError("FORBIDDEN", 403, "Insufficient permission");
      }

      const feedbacks = await prisma.sessionFeedback.findMany({
        where: { sessionId },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          memberId: true,
          attendance: true,
          attitudeScore: true,
          comprehensionScore: true,
          homeworkScore: true,
          strengths: true,
          weaknesses: true,
          recommendation: true,
          overallComment: true,
          createdAt: true,
          updatedAt: true,
          member: {
            select: {
              studentName: true,
            },
          },
        },
      });

      void reply.send(success(feedbacks));
    },
  );

  app.post(
    "/sessions/:sessionId/feedbacks",
    {
      preHandler: requireTutor,
      schema: {
        tags: ["Tutor"],
        summary: "Submit feedbacks for a session",
        params: sessionIdParamSchema,
        body: feedbackBatchBodySchema,
        response: {
          200: successSchema({ type: "object", additionalProperties: true }),
          400: errorResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { sessionId } = request.params as { sessionId: string };
      const tutorId = request.user!.sub;
      const body = request.body as {
        feedbacks: Array<{
          memberId: string;
          attendance?: string;
          attitudeScore?: number;
          comprehensionScore?: number;
          homeworkScore?: number;
          strengths?: string;
          weaknesses?: string;
          recommendation?: string;
          overallComment?: string;
        }>;
      };

      const session = await prisma.classSession.findUnique({
        where: { id: sessionId },
        select: { id: true, tutorId: true, classId: true, status: true },
      });

      if (!session) {
        throw new AppError("SESSION_NOT_FOUND", 404, "Session not found");
      }

      if (session.tutorId !== tutorId) {
        throw new AppError("FORBIDDEN", 403, "Insufficient permission");
      }

      if (session.status === "CANCELLED") {
        throw new AppError("SESSION_CANCELLED", 400, "Cannot submit feedback for cancelled session");
      }

      const members = await prisma.classMember.findMany({
        where: { classId: session.classId },
        select: { id: true },
      });

      if (members.length === 0) {
        throw new AppError("NO_MEMBERS", 400, "Class has no members");
      }

      const memberSet = new Set(members.map((member) => member.id));
      const submittedSet = new Set<string>();

      for (const feedback of body.feedbacks) {
        if (!memberSet.has(feedback.memberId)) {
          throw new AppError("INVALID_MEMBER", 400, "Member does not belong to class");
        }

        if (submittedSet.has(feedback.memberId)) {
          throw new AppError("DUPLICATE_MEMBER", 400, "Duplicate member feedback");
        }

        if (feedback.attendance && !attendanceValues.includes(feedback.attendance as any)) {
          throw new AppError("INVALID_ATTENDANCE", 400, "Invalid attendance status");
        }

        validateScore(feedback.attitudeScore, "attitudeScore");
        validateScore(feedback.comprehensionScore, "comprehensionScore");
        validateScore(feedback.homeworkScore, "homeworkScore");

        submittedSet.add(feedback.memberId);
      }

      if (submittedSet.size !== memberSet.size) {
        throw new AppError(
          "INCOMPLETE_FEEDBACK",
          400,
          "Feedback must include all students in the class",
        );
      }

      await prisma.$transaction(async (tx) => {
        for (const feedback of body.feedbacks) {
          await tx.sessionFeedback.upsert({
            where: {
              sessionId_memberId: {
                sessionId: session.id,
                memberId: feedback.memberId,
              },
            },
            update: {
              attendance: (feedback.attendance as any) ?? undefined,
              attitudeScore: feedback.attitudeScore,
              comprehensionScore: feedback.comprehensionScore,
              homeworkScore: feedback.homeworkScore,
              strengths: feedback.strengths,
              weaknesses: feedback.weaknesses,
              recommendation: feedback.recommendation,
              overallComment: feedback.overallComment,
              tutorId,
            },
            create: {
              sessionId: session.id,
              memberId: feedback.memberId,
              tutorId,
              attendance: (feedback.attendance as any) ?? "PRESENT",
              attitudeScore: feedback.attitudeScore,
              comprehensionScore: feedback.comprehensionScore,
              homeworkScore: feedback.homeworkScore,
              strengths: feedback.strengths,
              weaknesses: feedback.weaknesses,
              recommendation: feedback.recommendation,
              overallComment: feedback.overallComment,
            },
          });
        }
      });

      void reply.send(success({ submitted: body.feedbacks.length, sessionId: session.id }));
    },
  );

  app.patch(
    "/feedbacks/:feedbackId",
    {
      preHandler: requireTutor,
      schema: {
        tags: ["Tutor"],
        summary: "Update feedback",
        params: {
          type: "object",
          required: ["feedbackId"],
          properties: {
            feedbackId: { type: "string", format: "uuid" },
          },
        },
        body: feedbackUpdateBodySchema,
        response: {
          200: successSchema({ type: "object", additionalProperties: true }),
          404: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { feedbackId } = request.params as { feedbackId: string };
      const body = request.body as {
        attendance?: string;
        attitudeScore?: number;
        comprehensionScore?: number;
        homeworkScore?: number;
        strengths?: string;
        weaknesses?: string;
        recommendation?: string;
        overallComment?: string;
      };

      if (body.attendance && !attendanceValues.includes(body.attendance as any)) {
        throw new AppError("INVALID_ATTENDANCE", 400, "Invalid attendance status");
      }

      validateScore(body.attitudeScore, "attitudeScore");
      validateScore(body.comprehensionScore, "comprehensionScore");
      validateScore(body.homeworkScore, "homeworkScore");

      const feedback = await prisma.sessionFeedback.findUnique({
        where: { id: feedbackId },
        select: { tutorId: true, session: { select: { status: true } } },
      });

      if (!feedback) {
        throw new AppError("FEEDBACK_NOT_FOUND", 404, "Feedback not found");
      }

      if (feedback.tutorId !== request.user!.sub) {
        throw new AppError("FORBIDDEN", 403, "Insufficient permission");
      }

      if (feedback.session.status === "CANCELLED") {
        throw new AppError("SESSION_CANCELLED", 400, "Cannot update feedback for cancelled session");
      }

      const updated = await prisma.sessionFeedback.update({
        where: { id: feedbackId },
        data: {
          attendance: body.attendance as any,
          attitudeScore: body.attitudeScore,
          comprehensionScore: body.comprehensionScore,
          homeworkScore: body.homeworkScore,
          strengths: body.strengths,
          weaknesses: body.weaknesses,
          recommendation: body.recommendation,
          overallComment: body.overallComment,
        },
      });

      void reply.send(success(updated));
    },
  );

  app.get(
    "/classes/:classId/members/:memberId/progress",
    {
      preHandler: requireTutor,
      schema: {
        tags: ["Tutor"],
        summary: "Get member progress for a class",
        params: memberIdParamSchema,
        response: {
          200: successSchema({ type: "object", additionalProperties: true }),
          404: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { classId, memberId } = request.params as {
        classId: string;
        memberId: string;
      };

      await getAssignedClassOrThrow(request.user!.sub, classId);

      const member = await prisma.classMember.findUnique({
        where: { id: memberId },
        select: { id: true, studentName: true, classId: true },
      });

      if (!member || member.classId !== classId) {
        throw new AppError("MEMBER_NOT_FOUND", 404, "Member not found");
      }

      const feedbacks = await prisma.sessionFeedback.findMany({
        where: {
          memberId,
          session: { classId },
        },
        select: {
          attendance: true,
          attitudeScore: true,
          comprehensionScore: true,
          homeworkScore: true,
          session: { select: { sessionNumber: true, sessionDate: true } },
        },
        orderBy: { session: { sessionNumber: "asc" } },
      });

      const totals = {
        totalSessions: feedbacks.length,
        present: 0,
        absent: 0,
        late: 0,
        excused: 0,
      };

      let attitudeSum = 0;
      let attitudeCount = 0;
      let comprehensionSum = 0;
      let comprehensionCount = 0;
      let homeworkSum = 0;
      let homeworkCount = 0;

      for (const feedback of feedbacks) {
        if (feedback.attendance === "PRESENT") totals.present += 1;
        if (feedback.attendance === "ABSENT") totals.absent += 1;
        if (feedback.attendance === "LATE") totals.late += 1;
        if (feedback.attendance === "EXCUSED") totals.excused += 1;

        if (feedback.attitudeScore !== null && feedback.attitudeScore !== undefined) {
          attitudeSum += feedback.attitudeScore;
          attitudeCount += 1;
        }

        if (feedback.comprehensionScore !== null && feedback.comprehensionScore !== undefined) {
          comprehensionSum += feedback.comprehensionScore;
          comprehensionCount += 1;
        }

        if (feedback.homeworkScore !== null && feedback.homeworkScore !== undefined) {
          homeworkSum += feedback.homeworkScore;
          homeworkCount += 1;
        }
      }

      const averages = {
        attitude: attitudeCount ? Math.round((attitudeSum / attitudeCount) * 10) / 10 : null,
        comprehension: comprehensionCount ? Math.round((comprehensionSum / comprehensionCount) * 10) / 10 : null,
        homework: homeworkCount ? Math.round((homeworkSum / homeworkCount) * 10) / 10 : null,
      };

      void reply.send(success({
        member,
        totals,
        averages,
        sessions: feedbacks,
      }));
    },
  );

  app.post(
    "/payments",
    {
      preHandler: requireTutor,
      schema: {
        tags: ["Tutor"],
        summary: "Submit payment proof",
        body: paymentBodySchema,
        response: {
          200: successSchema({
            type: "object",
            required: ["submitted"],
            properties: {
              submitted: { type: "boolean" },
            },
          }),
          400: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const body = request.body as {
        amount: number;
        billImageUrl: string;
        classId?: string;
        note?: string;
      };

      if (body.classId) {
        const exists = await prisma.class.findUnique({
          where: { id: body.classId },
          select: { id: true },
        });

        if (!exists) {
          throw new AppError("CLASS_NOT_FOUND", 404, "Class not found");
        }
      }

      await prisma.payment.create({
        data: {
          tutorId: request.user!.sub,
          classId: body.classId,
          amount: Math.round(body.amount),
          billImageUrl: body.billImageUrl,
          note: body.note,
        },
      });

      void reply.send(success({ submitted: true }));
    },
  );

  app.get(
    "/payments",
    {
      preHandler: requireTutor,
      schema: {
        tags: ["Tutor"],
        summary: "List tutor payment submissions",
        response: {
          200: successSchema({
            type: "array",
            items: { type: "object", additionalProperties: true },
          }),
        },
      },
    },
    async (request, reply) => {
      const payments = await prisma.payment.findMany({
        where: { tutorId: request.user!.sub },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          amount: true,
          billImageUrl: true,
          status: true,
          note: true,
          classId: true,
          createdAt: true,
        },
      });

      void reply.send(success(payments));
    },
  );
}
