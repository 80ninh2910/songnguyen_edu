import type { FastifyInstance } from "fastify";
import crypto from "crypto";

import { AppError } from "../../common/errors/AppError.js";
import { errorResponseSchema, successSchema } from "../../common/utils/docs.js";
import { hashPassword } from "../../common/utils/password.js";
import { success } from "../../common/utils/response.js";
import { prisma } from "../../config/prisma.js";

const stringIdParamSchema = {
  type: "object",
  required: ["id"],
  properties: {
    id: { type: "string" },
  },
};

const classRequestBodySchema = {
  type: "object",
  required: ["parentName", "parentPhone", "subject", "grade", "district"],
  properties: {
    parentName: { type: "string" },
    parentPhone: { type: "string" },
    parentEmail: { type: "string", format: "email" },
    subject: { type: "string" },
    grade: { type: "string" },
    district: { type: "string" },
    budgetPerHour: { type: "number" },
    note: { type: "string" },
  },
};

const tutorRegisterBodySchema = {
  type: "object",
  required: ["fullName", "email", "phone", "password"],
  properties: {
    fullName: { type: "string" },
    email: { type: "string", format: "email" },
    phone: { type: "string" },
    password: { type: "string", minLength: 6 },
    subjects: {
      type: "array",
      items: { type: "string" },
    },
    districts: {
      type: "array",
      items: { type: "string" },
    },
  },
};

const uploadDocumentsBodySchema = {
  type: "object",
  required: ["documents"],
  properties: {
    documents: {
      type: "array",
      items: {
        type: "object",
        required: ["type", "url"],
        properties: {
          type: { type: "string" },
          url: { type: "string" },
        },
      },
    },
  },
};

export async function registerPublicRoutes(
  app: FastifyInstance,
): Promise<void> {
  app.get(
    "/classes",
    {
      schema: {
        tags: ["Public"],
        summary: "List public classes",
        response: {
          200: successSchema({
            type: "array",
            items: { type: "object", additionalProperties: true },
          }),
        },
      },
    },
    async (_request, reply) => {
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
        },
      });
      void reply.send(success(classes));
    },
  );

  app.get(
    "/classes/:id",
    {
      schema: {
        tags: ["Public"],
        summary: "Get class detail",
        params: stringIdParamSchema,
        response: {
          200: successSchema({
            type: "object",
            required: ["id"],
            properties: {
              id: { type: "string" },
            },
          }),
          404: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const id = (request.params as { id: string }).id;
      const classItem = await prisma.class.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          subject: true,
          grade: true,
          district: true,
          feePerHour: true,
          schedule: true,
          status: true,
        },
      });

      if (!classItem) {
        throw new AppError("CLASS_NOT_FOUND", 404, "Class not found");
      }

      void reply.send(success(classItem));
    },
  );

  app.get(
    "/tutors",
    {
      schema: {
        tags: ["Public"],
        summary: "List public tutors",
        response: {
          200: successSchema({
            type: "array",
            items: { type: "object", additionalProperties: true },
          }),
        },
      },
    },
    async (_request, reply) => {
      const tutors = await prisma.tutor.findMany({
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          fullName: true,
          subjects: true,
          districts: true,
          status: true,
        },
      });
      void reply.send(success(tutors));
    },
  );

  app.post(
    "/class-requests",
    {
      schema: {
        tags: ["Public"],
        summary: "Create class request",
        body: classRequestBodySchema,
        response: {
          200: successSchema({
            type: "object",
            required: ["created"],
            properties: {
              created: { type: "boolean" },
              id: { type: "string" },
            },
          }),
          400: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const body = request.body as {
        parentName: string;
        parentPhone: string;
        parentEmail?: string;
        subject: string;
        grade: string;
        district: string;
        budgetPerHour?: number;
        note?: string;
      };

      const created = await prisma.classRequest.create({
        data: {
          parentName: body.parentName,
          parentPhone: body.parentPhone,
          parentEmail: body.parentEmail,
          subject: body.subject,
          grade: body.grade,
          district: body.district,
          budgetPerHour: Math.max(Math.round(body.budgetPerHour ?? 0), 0),
          note: body.note,
        },
        select: { id: true },
      });

      void reply.send(success({ created: true, id: created.id }));
    },
  );

  app.post(
    "/tutors/register",
    {
      schema: {
        tags: ["Public"],
        summary: "Register tutor profile",
        body: tutorRegisterBodySchema,
        response: {
          200: successSchema({
            type: "object",
            required: ["tutorId", "uploadToken"],
            properties: {
              tutorId: { type: "string" },
              uploadToken: { type: "string" },
            },
          }),
          400: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const body = request.body as {
        fullName: string;
        email: string;
        phone: string;
        password: string;
        subjects?: string[];
        districts?: string[];
      };

      const existing = await prisma.tutor.findUnique({
        where: { email: body.email },
        select: { id: true },
      });

      if (existing) {
        throw new AppError("TUTOR_EXISTS", 409, "Tutor already registered");
      }

      const passwordHash = await hashPassword(body.password);
      const tutor = await prisma.tutor.create({
        data: {
          fullName: body.fullName,
          email: body.email,
          phone: body.phone,
          passwordHash,
          subjects: body.subjects ?? [],
          districts: body.districts ?? [],
        },
        select: { id: true },
      });

      void reply.send(
        success({ tutorId: tutor.id, uploadToken: crypto.randomUUID() }),
      );
    },
  );

  app.post(
    "/tutors/:id/documents",
    {
      schema: {
        tags: ["Public"],
        summary: "Upload tutor verification documents",
        params: stringIdParamSchema,
        body: uploadDocumentsBodySchema,
        response: {
          200: successSchema({
            type: "object",
            required: ["uploaded"],
            properties: {
              uploaded: { type: "boolean" },
            },
          }),
          400: errorResponseSchema,
        },
      },
    },
    async (_request, reply) => {
      void reply.send(success({ uploaded: true }));
    },
  );
}
