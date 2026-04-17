import type { FastifyReply, FastifyRequest } from "fastify";

import { success, successList } from "../../common/utils/response.js";
import { adminService } from "./admin.service.js";
import {
  AdminListAuditLogsQuerySchema,
  AdminListClassesQuerySchema,
  AdminListClassRequestsQuerySchema,
  AdminListPaymentsQuerySchema,
  AdminListTutorsQuerySchema,
  AssignClassBodySchema,
  ConvertRequestBodySchema,
  CreateClassBodySchema,
  IdParamSchema,
  RejectRequestBodySchema,
  RejectTutorBodySchema,
  UpdateClassBodySchema,
  UpdatePaymentStatusBodySchema,
} from "./admin.schema.js";

function getActor(request: FastifyRequest): { id: string; email: string } {
  if (!request.user) {
    throw new Error("Authenticated user is required");
  }

  return {
    id: request.user.sub,
    email: request.user.email,
  };
}

export async function dashboardHandler(
  _request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const result = await adminService.getDashboard();
  void reply.send(success(result));
}

export async function listTutorsHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const query = AdminListTutorsQuerySchema.parse(request.query);
  const result = await adminService.listTutors(query);
  void reply.send(successList(result.data, result.meta));
}

export async function getTutorByIdHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { id } = IdParamSchema.parse(request.params);
  const result = await adminService.getTutorById(id);
  void reply.send(success(result));
}

export async function approveTutorHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { id } = IdParamSchema.parse(request.params);
  const result = await adminService.approveTutor(getActor(request), id);
  void reply.send(success(result));
}

export async function rejectTutorHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { id } = IdParamSchema.parse(request.params);
  const body = RejectTutorBodySchema.parse(request.body);
  const result = await adminService.rejectTutor(
    getActor(request),
    id,
    body.reason,
  );
  void reply.send(success(result));
}

export async function listClassRequestsHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const query = AdminListClassRequestsQuerySchema.parse(request.query);
  const result = await adminService.listClassRequests(query);
  void reply.send(successList(result.data, result.meta));
}

export async function getClassRequestByIdHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { id } = IdParamSchema.parse(request.params);
  const result = await adminService.getClassRequestById(id);
  void reply.send(success(result));
}

export async function convertClassRequestHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { id } = IdParamSchema.parse(request.params);
  const body = ConvertRequestBodySchema.parse(request.body);
  const result = await adminService.convertClassRequest(
    getActor(request),
    id,
    body,
  );
  void reply.send(success(result));
}

export async function rejectClassRequestHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { id } = IdParamSchema.parse(request.params);
  const body = RejectRequestBodySchema.parse(request.body);
  const result = await adminService.rejectClassRequest(
    getActor(request),
    id,
    body.reason,
  );
  void reply.send(success(result));
}

export async function listClassesHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const query = AdminListClassesQuerySchema.parse(request.query);
  const result = await adminService.listClasses(query);
  void reply.send(successList(result.data, result.meta));
}

export async function createClassHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const body = CreateClassBodySchema.parse(request.body);
  const result = await adminService.createClass(getActor(request), body);
  void reply.send(success(result));
}

export async function getClassByIdHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { id } = IdParamSchema.parse(request.params);
  const result = await adminService.getClassById(id);
  void reply.send(success(result));
}

export async function updateClassHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { id } = IdParamSchema.parse(request.params);
  const body = UpdateClassBodySchema.parse(request.body);
  const result = await adminService.updateClass(getActor(request), id, body);
  void reply.send(success(result));
}

export async function closeClassHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { id } = IdParamSchema.parse(request.params);
  const result = await adminService.closeClass(getActor(request), id);
  void reply.send(success(result));
}

export async function listClassApplicantsHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { id } = IdParamSchema.parse(request.params);
  const result = await adminService.listClassApplicants(id);
  void reply.send(success(result));
}

export async function assignClassHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { id } = IdParamSchema.parse(request.params);
  const body = AssignClassBodySchema.parse(request.body);
  const result = await adminService.assignClass(
    getActor(request),
    id,
    body.tutorId,
    body.note,
  );
  void reply.send(success(result));
}

export async function listPaymentsHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const query = AdminListPaymentsQuerySchema.parse(request.query);
  const result = await adminService.listPayments(query);
  void reply.send(successList(result.data, result.meta));
}

export async function getPaymentByIdHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { id } = IdParamSchema.parse(request.params);
  const result = await adminService.getPaymentById(id);
  void reply.send(success(result));
}

export async function confirmPaymentHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { id } = IdParamSchema.parse(request.params);
  const body = UpdatePaymentStatusBodySchema.parse(request.body);
  const result = await adminService.confirmPayment(
    getActor(request),
    id,
    body.note,
  );
  void reply.send(success(result));
}

export async function rejectPaymentHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { id } = IdParamSchema.parse(request.params);
  const body = UpdatePaymentStatusBodySchema.parse(request.body);
  const result = await adminService.rejectPayment(
    getActor(request),
    id,
    body.note,
  );
  void reply.send(success(result));
}

export async function listAuditLogsHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const query = AdminListAuditLogsQuerySchema.parse(request.query);
  const result = await adminService.listAuditLogs(query);
  void reply.send(successList(result.data, result.meta));
}
