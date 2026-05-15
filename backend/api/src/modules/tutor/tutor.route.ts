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

export async function registerTutorRoutes(app: FastifyInstance): Promise<void> {
  const requireTutor = async (request: FastifyRequest): Promise<void> => {
    await request.jwtVerify();

    if (!request.user || request.user.role !== "TUTOR") {
      throw new AppError("FORBIDDEN", 403, "Insufficient permission");
    }
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
        where: { classId_tutorId: { classId, tutorId: request.user!.sub } },
        select: { id: true },
      });

      if (!existing) {
        await prisma.classApplication.create({
          data: {
            classId,
            tutorId: request.user!.sub,
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
        },
      },
    },
    async (request, reply) => {
      const { classId } = request.params as { classId: string };
      const result = await prisma.classApplication.deleteMany({
        where: { classId, tutorId: request.user!.sub },
      });

      void reply.send(success({ cancelled: result.count > 0 }));
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
