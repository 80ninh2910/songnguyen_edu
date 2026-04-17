import type { FastifyReply, FastifyRequest } from "fastify";

import { authService } from "./auth.service.js";
import {
  AdminLoginSchema,
  LogoutSchema,
  RefreshSchema,
  TutorLoginSchema,
} from "./auth.schema.js";
import { success } from "../../common/utils/response.js";

export async function loginAdminHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const body = AdminLoginSchema.parse(request.body);
  const result = await authService.loginAdmin(
    request.server,
    body.email,
    body.password,
  );
  void reply.send(success(result));
}

export async function loginTutorHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const body = TutorLoginSchema.parse(request.body);
  const result = await authService.loginTutor(
    request.server,
    body.email,
    body.password,
  );
  void reply.send(success(result));
}

export async function refreshHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const body = RefreshSchema.parse(request.body);
  const result = await authService.refreshAccessToken(
    request.server,
    body.refreshToken,
  );
  void reply.send(success(result));
}

export async function logoutHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const body = LogoutSchema.parse(request.body);
  const result = await authService.revokeRefreshToken(body.refreshToken);
  void reply.send(success(result));
}

export async function meHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const user = request.user
    ? await authService.getCurrentUser(request.user)
    : null;
  void reply.send(success({ user }));
}
