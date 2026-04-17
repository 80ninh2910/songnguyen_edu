import type { FastifyInstance, FastifyRequest } from "fastify";

import { AppError } from "../../common/errors/AppError.js";
import {
  approveTutorHandler,
  assignClassHandler,
  closeClassHandler,
  confirmPaymentHandler,
  convertClassRequestHandler,
  createClassHandler,
  dashboardHandler,
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
} from "./admin.handler.js";

export async function registerAdminRoutes(app: FastifyInstance): Promise<void> {
  const requireAdmin = async (request: FastifyRequest): Promise<void> => {
    await request.jwtVerify();

    if (!request.user || request.user.role !== "ADMIN") {
      throw new AppError("FORBIDDEN", 403, "Insufficient permission");
    }
  };

  app.get("/dashboard", { preHandler: requireAdmin }, dashboardHandler);

  app.get("/tutors", { preHandler: requireAdmin }, listTutorsHandler);
  app.get("/tutors/:id", { preHandler: requireAdmin }, getTutorByIdHandler);
  app.patch(
    "/tutors/:id/approve",
    { preHandler: requireAdmin },
    approveTutorHandler,
  );
  app.patch(
    "/tutors/:id/reject",
    { preHandler: requireAdmin },
    rejectTutorHandler,
  );

  app.get(
    "/class-requests",
    { preHandler: requireAdmin },
    listClassRequestsHandler,
  );
  app.get(
    "/class-requests/:id",
    { preHandler: requireAdmin },
    getClassRequestByIdHandler,
  );
  app.patch(
    "/class-requests/:id/convert",
    { preHandler: requireAdmin },
    convertClassRequestHandler,
  );
  app.patch(
    "/class-requests/:id/reject",
    { preHandler: requireAdmin },
    rejectClassRequestHandler,
  );

  app.get("/classes", { preHandler: requireAdmin }, listClassesHandler);
  app.post("/classes", { preHandler: requireAdmin }, createClassHandler);
  app.get("/classes/:id", { preHandler: requireAdmin }, getClassByIdHandler);
  app.patch("/classes/:id", { preHandler: requireAdmin }, updateClassHandler);
  app.patch(
    "/classes/:id/close",
    { preHandler: requireAdmin },
    closeClassHandler,
  );
  app.get(
    "/classes/:id/applicants",
    { preHandler: requireAdmin },
    listClassApplicantsHandler,
  );
  app.post(
    "/classes/:id/assign",
    { preHandler: requireAdmin },
    assignClassHandler,
  );

  app.get("/payments", { preHandler: requireAdmin }, listPaymentsHandler);
  app.get("/payments/:id", { preHandler: requireAdmin }, getPaymentByIdHandler);
  app.patch(
    "/payments/:id/confirm",
    { preHandler: requireAdmin },
    confirmPaymentHandler,
  );
  app.patch(
    "/payments/:id/reject",
    { preHandler: requireAdmin },
    rejectPaymentHandler,
  );

  app.get("/audit-logs", { preHandler: requireAdmin }, listAuditLogsHandler);
}
