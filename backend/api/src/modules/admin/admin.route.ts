import type { FastifyInstance, FastifyRequest } from "fastify";

import { AppError } from "../../common/errors/AppError.js";
import {
  errorResponseSchema,
  fromZodSchema,
  successListSchema,
  successSchema,
} from "../../common/utils/docs.js";
import {
  approveTutorHandler,
  assignClassHandler,
  closeClassHandler,
  confirmPaymentHandler,
  convertClassRequestHandler,
  createClassHandler,
  createTutorHandler,
  dashboardHandler,
  dashboardStatsHandler,
  getClassByIdHandler,
  getClassRequestByIdHandler,
  getPaymentByIdHandler,
  getTutorByIdHandler,
  listAuditLogsHandler,
  listClassApplicantsHandler,
  listClassesHandler,
  listClassRequestsHandler,
  listPaymentsHandler,
  listTutorsHandler,
  rejectClassRequestHandler,
  rejectPaymentHandler,
  rejectTutorHandler,
  updateClassHandler,
  updateTutorHandler,
} from "./admin.handler.js";
import {
  AdminListAuditLogsQuerySchema,
  AdminListClassesQuerySchema,
  AdminListClassRequestsQuerySchema,
  AdminListPaymentsQuerySchema,
  AdminListTutorsQuerySchema,
  AssignClassBodySchema,
  ConfirmPaymentBodySchema,
  ConvertRequestBodySchema,
  CreateClassBodySchema,
  CreateTutorBodySchema,
  IdParamSchema,
  RejectPaymentBodySchema,
  RejectRequestBodySchema,
  RejectTutorBodySchema,
  UpdateTutorBodySchema,
  UpdateClassBodySchema,
} from "./admin.schema.js";

const anyDataSchema = {};
const listItemSchema = { type: "object", additionalProperties: true };

export async function registerAdminRoutes(app: FastifyInstance): Promise<void> {
  const requireAdmin = async (request: FastifyRequest): Promise<void> => {
    await request.jwtVerify();

    if (
      !request.user ||
      (request.user.role !== "ADMIN" && request.user.role !== "SUPERADMIN")
    ) {
      throw new AppError("FORBIDDEN", 403, "Insufficient permission");
    }
  };

  app.get(
    "/dashboard",
    {
      preHandler: requireAdmin,
      schema: {
        tags: ["Admin"],
        summary: "Get admin dashboard overview",
        security: [{ bearerAuth: [] }],
        response: {
          200: successSchema(anyDataSchema),
          401: errorResponseSchema,
          403: errorResponseSchema,
        },
      },
    },
    dashboardHandler,
  );

  app.get(
    "/dashboard/stats",
    {
      preHandler: requireAdmin,
      schema: {
        tags: ["Admin"],
        summary: "Get admin dashboard statistics",
        security: [{ bearerAuth: [] }],
        response: {
          200: successSchema(anyDataSchema),
          401: errorResponseSchema,
          403: errorResponseSchema,
        },
      },
    },
    dashboardStatsHandler,
  );

  app.get(
    "/tutors",
    {
      preHandler: requireAdmin,
      schema: {
        tags: ["Admin"],
        summary: "List tutors",
        security: [{ bearerAuth: [] }],
        querystring: fromZodSchema(AdminListTutorsQuerySchema),
        response: {
          200: successListSchema(listItemSchema),
          400: errorResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
        },
      },
    },
    listTutorsHandler,
  );

  app.post(
    "/tutors",
    {
      preHandler: requireAdmin,
      schema: {
        tags: ["Admin"],
        summary: "Create tutor",
        security: [{ bearerAuth: [] }],
        body: fromZodSchema(CreateTutorBodySchema),
        response: {
          200: successSchema(anyDataSchema),
          400: errorResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          409: errorResponseSchema,
        },
      },
    },
    createTutorHandler,
  );

  app.get(
    "/tutors/:id",
    {
      preHandler: requireAdmin,
      schema: {
        tags: ["Admin"],
        summary: "Get tutor detail",
        security: [{ bearerAuth: [] }],
        params: fromZodSchema(IdParamSchema),
        response: {
          200: successSchema(anyDataSchema),
          400: errorResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    getTutorByIdHandler,
  );

  app.patch(
    "/tutors/:id",
    {
      preHandler: requireAdmin,
      schema: {
        tags: ["Admin"],
        summary: "Update tutor",
        security: [{ bearerAuth: [] }],
        params: fromZodSchema(IdParamSchema),
        body: fromZodSchema(UpdateTutorBodySchema),
        response: {
          200: successSchema(anyDataSchema),
          400: errorResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
          409: errorResponseSchema,
        },
      },
    },
    updateTutorHandler,
  );

  app.patch(
    "/tutors/:id/approve",
    {
      preHandler: requireAdmin,
      schema: {
        tags: ["Admin"],
        summary: "Approve tutor",
        security: [{ bearerAuth: [] }],
        params: fromZodSchema(IdParamSchema),
        response: {
          200: successSchema(anyDataSchema),
          400: errorResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    approveTutorHandler,
  );

  app.patch(
    "/tutors/:id/reject",
    {
      preHandler: requireAdmin,
      schema: {
        tags: ["Admin"],
        summary: "Reject tutor",
        security: [{ bearerAuth: [] }],
        params: fromZodSchema(IdParamSchema),
        body: fromZodSchema(RejectTutorBodySchema),
        response: {
          200: successSchema(anyDataSchema),
          400: errorResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    rejectTutorHandler,
  );

  app.get(
    "/class-requests",
    {
      preHandler: requireAdmin,
      schema: {
        tags: ["Admin"],
        summary: "List class requests",
        security: [{ bearerAuth: [] }],
        querystring: fromZodSchema(AdminListClassRequestsQuerySchema),
        response: {
          200: successListSchema(listItemSchema),
          400: errorResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
        },
      },
    },
    listClassRequestsHandler,
  );

  app.get(
    "/class-requests/:id",
    {
      preHandler: requireAdmin,
      schema: {
        tags: ["Admin"],
        summary: "Get class request detail",
        security: [{ bearerAuth: [] }],
        params: fromZodSchema(IdParamSchema),
        response: {
          200: successSchema(anyDataSchema),
          400: errorResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    getClassRequestByIdHandler,
  );

  app.patch(
    "/class-requests/:id/convert",
    {
      preHandler: requireAdmin,
      schema: {
        tags: ["Admin"],
        summary: "Convert class request to class",
        security: [{ bearerAuth: [] }],
        params: fromZodSchema(IdParamSchema),
        body: fromZodSchema(ConvertRequestBodySchema),
        response: {
          200: successSchema(anyDataSchema),
          400: errorResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    convertClassRequestHandler,
  );

  app.patch(
    "/class-requests/:id/reject",
    {
      preHandler: requireAdmin,
      schema: {
        tags: ["Admin"],
        summary: "Reject class request",
        security: [{ bearerAuth: [] }],
        params: fromZodSchema(IdParamSchema),
        body: fromZodSchema(RejectRequestBodySchema),
        response: {
          200: successSchema(anyDataSchema),
          400: errorResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    rejectClassRequestHandler,
  );

  app.get(
    "/classes",
    {
      preHandler: requireAdmin,
      schema: {
        tags: ["Admin"],
        summary: "List classes",
        security: [{ bearerAuth: [] }],
        querystring: fromZodSchema(AdminListClassesQuerySchema),
        response: {
          200: successListSchema(listItemSchema),
          400: errorResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
        },
      },
    },
    listClassesHandler,
  );

  app.post(
    "/classes",
    {
      preHandler: requireAdmin,
      schema: {
        tags: ["Admin"],
        summary: "Create class",
        security: [{ bearerAuth: [] }],
        body: fromZodSchema(CreateClassBodySchema),
        response: {
          200: successSchema(anyDataSchema),
          400: errorResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
        },
      },
    },
    createClassHandler,
  );

  app.get(
    "/classes/:id",
    {
      preHandler: requireAdmin,
      schema: {
        tags: ["Admin"],
        summary: "Get class detail",
        security: [{ bearerAuth: [] }],
        params: fromZodSchema(IdParamSchema),
        response: {
          200: successSchema(anyDataSchema),
          400: errorResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    getClassByIdHandler,
  );

  app.patch(
    "/classes/:id",
    {
      preHandler: requireAdmin,
      schema: {
        tags: ["Admin"],
        summary: "Update class",
        security: [{ bearerAuth: [] }],
        params: fromZodSchema(IdParamSchema),
        body: fromZodSchema(UpdateClassBodySchema),
        response: {
          200: successSchema(anyDataSchema),
          400: errorResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    updateClassHandler,
  );

  app.patch(
    "/classes/:id/close",
    {
      preHandler: requireAdmin,
      schema: {
        tags: ["Admin"],
        summary: "Close class",
        security: [{ bearerAuth: [] }],
        params: fromZodSchema(IdParamSchema),
        response: {
          200: successSchema(anyDataSchema),
          400: errorResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    closeClassHandler,
  );

  app.get(
    "/classes/:id/applicants",
    {
      preHandler: requireAdmin,
      schema: {
        tags: ["Admin"],
        summary: "List class applicants",
        security: [{ bearerAuth: [] }],
        params: fromZodSchema(IdParamSchema),
        response: {
          200: successSchema(anyDataSchema),
          400: errorResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    listClassApplicantsHandler,
  );

  app.post(
    "/classes/:id/assign",
    {
      preHandler: requireAdmin,
      schema: {
        tags: ["Admin"],
        summary: "Assign class to tutor",
        security: [{ bearerAuth: [] }],
        params: fromZodSchema(IdParamSchema),
        body: fromZodSchema(AssignClassBodySchema),
        response: {
          200: successSchema(anyDataSchema),
          400: errorResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    assignClassHandler,
  );

  app.get(
    "/payments",
    {
      preHandler: requireAdmin,
      schema: {
        tags: ["Admin"],
        summary: "List payments",
        security: [{ bearerAuth: [] }],
        querystring: fromZodSchema(AdminListPaymentsQuerySchema),
        response: {
          200: successListSchema(listItemSchema),
          400: errorResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
        },
      },
    },
    listPaymentsHandler,
  );

  app.get(
    "/payments/:id",
    {
      preHandler: requireAdmin,
      schema: {
        tags: ["Admin"],
        summary: "Get payment detail",
        security: [{ bearerAuth: [] }],
        params: fromZodSchema(IdParamSchema),
        response: {
          200: successSchema(anyDataSchema),
          400: errorResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    getPaymentByIdHandler,
  );

  app.patch(
    "/payments/:id/confirm",
    {
      preHandler: requireAdmin,
      schema: {
        tags: ["Admin"],
        summary: "Confirm payment",
        security: [{ bearerAuth: [] }],
        params: fromZodSchema(IdParamSchema),
        body: fromZodSchema(ConfirmPaymentBodySchema),
        response: {
          200: successSchema(anyDataSchema),
          400: errorResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    confirmPaymentHandler,
  );

  app.patch(
    "/payments/:id/reject",
    {
      preHandler: requireAdmin,
      schema: {
        tags: ["Admin"],
        summary: "Reject payment",
        security: [{ bearerAuth: [] }],
        params: fromZodSchema(IdParamSchema),
        body: fromZodSchema(RejectPaymentBodySchema),
        response: {
          200: successSchema(anyDataSchema),
          400: errorResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    rejectPaymentHandler,
  );

  app.get(
    "/audit-logs",
    {
      preHandler: requireAdmin,
      schema: {
        tags: ["Admin"],
        summary: "List audit logs",
        security: [{ bearerAuth: [] }],
        querystring: fromZodSchema(AdminListAuditLogsQuerySchema),
        response: {
          200: successListSchema(listItemSchema),
          400: errorResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
        },
      },
    },
    listAuditLogsHandler,
  );
}
